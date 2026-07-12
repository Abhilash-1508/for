"""
ForestConnect AI — ML Price Prediction Model
Uses Random Forest Regressor trained on historical GCC market data.
"""

import numpy as np
import os
import pickle
from models import get_db, rows_to_list

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'ml_models')
os.makedirs(MODEL_DIR, exist_ok=True)


def get_training_data(product_type):
    """Fetch historical price data from the database for a product type."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT month, year, price, demand_level, rainfall_index
        FROM price_history
        WHERE product_type = ?
        ORDER BY year, month
    ''', (product_type,))
    rows = rows_to_list(cursor.fetchall())
    conn.close()
    return rows


def encode_demand(demand):
    """Encode demand level as numeric."""
    mapping = {'Low': 0, 'Medium': 1, 'High': 2}
    return mapping.get(demand, 1)


def get_season(month):
    """Map month to season index."""
    if month in [12, 1, 2]:
        return 0  # Winter
    elif month in [3, 4, 5]:
        return 1  # Summer
    elif month in [6, 7, 8]:
        return 2  # Monsoon
    else:
        return 3  # Post-Monsoon


def prepare_features(rows):
    """Convert raw data rows into feature matrix and target vector."""
    X = []
    y = []

    for i, row in enumerate(rows):
        month = row['month']
        year = row['year']
        rainfall = row['rainfall_index']
        price = row['price']

        # Features: month, season, year_index, rainfall, prev_price, prev_prev_price
        season = get_season(month)
        year_idx = year - 2024  # Normalize year

        prev_price = rows[i - 1]['price'] if i > 0 else price
        prev_prev_price = rows[i - 2]['price'] if i > 1 else prev_price

        # Month as cyclical features (sin/cos encoding for circular nature)
        month_sin = np.sin(2 * np.pi * month / 12)
        month_cos = np.cos(2 * np.pi * month / 12)

        X.append([
            month,
            month_sin,
            month_cos,
            season,
            year_idx,
            rainfall,
            prev_price,
            prev_prev_price
        ])
        y.append(price)

    return np.array(X), np.array(y)


def train_model(product_type):
    """Train a Random Forest model for a specific product type."""
    from sklearn.ensemble import RandomForestRegressor

    rows = get_training_data(product_type)
    if len(rows) < 6:
        print(f"⚠️  Not enough data to train model for {product_type}")
        return None

    X, y = prepare_features(rows)

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=8,
        min_samples_split=3,
        random_state=42
    )
    model.fit(X, y)

    # Save model
    model_path = os.path.join(MODEL_DIR, f'{product_type}_model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)

    # Calculate training score
    score = model.score(X, y)
    print(f"✅ Model trained for '{product_type}' — R² Score: {score:.4f}")

    return model


def load_model(product_type):
    """Load a trained model from disk, or train one if it doesn't exist."""
    model_path = os.path.join(MODEL_DIR, f'{product_type}_model.pkl')

    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    else:
        return train_model(product_type)


def predict_price(product_type, target_month, quantity=1):
    """
    Predict the price for a forest product at a target month.

    Returns:
        dict with predicted_price, demand_level, best_selling_month,
        confidence_score, and historical_trend
    """
    model = load_model(product_type)
    rows = get_training_data(product_type)

    if model is None or len(rows) < 2:
        return {
            'predicted_price': 0,
            'demand_level': 'Unknown',
            'best_selling_month': 'Unknown',
            'confidence_score': 0,
            'historical_trend': [],
            'historical_labels': []
        }

    # Prepare prediction features
    last_row = rows[-1]
    prev_price = last_row['price']
    prev_prev = rows[-2]['price'] if len(rows) > 1 else prev_price

    # Average rainfall for target month from historical data
    rainfall_data = [r['rainfall_index'] for r in rows if r['month'] == target_month]
    avg_rainfall = np.mean(rainfall_data) if rainfall_data else 50.0

    season = get_season(target_month)
    year_idx = 2  # Current year offset (2026 - 2024)
    month_sin = np.sin(2 * np.pi * target_month / 12)
    month_cos = np.cos(2 * np.pi * target_month / 12)

    features = np.array([[
        target_month,
        month_sin,
        month_cos,
        season,
        year_idx,
        avg_rainfall,
        prev_price,
        prev_prev
    ]])

    predicted = model.predict(features)[0]
    predicted = round(predicted, 2)

    # Calculate confidence using model's estimator variance
    predictions_per_tree = [tree.predict(features)[0] for tree in model.estimators_]
    std_dev = np.std(predictions_per_tree)
    confidence = max(0, min(100, round(100 - (std_dev / predicted * 100), 1)))

    # Predict for all 12 months to find the best selling month
    monthly_predictions = {}
    for m in range(1, 13):
        m_rain = [r['rainfall_index'] for r in rows if r['month'] == m]
        m_avg_rain = np.mean(m_rain) if m_rain else 50.0
        m_season = get_season(m)
        m_sin = np.sin(2 * np.pi * m / 12)
        m_cos = np.cos(2 * np.pi * m / 12)
        m_features = np.array([[m, m_sin, m_cos, m_season, year_idx, m_avg_rain, prev_price, prev_prev]])
        monthly_predictions[m] = model.predict(m_features)[0]

    best_month_num = max(monthly_predictions, key=monthly_predictions.get)
    month_names = {1: 'January', 2: 'February', 3: 'March', 4: 'April',
                   5: 'May', 6: 'June', 7: 'July', 8: 'August',
                   9: 'September', 10: 'October', 11: 'November', 12: 'December'}
    best_month_name = month_names[best_month_num]

    # Determine demand level
    if predicted > prev_price * 1.1:
        demand_level = 'High (ఎక్కువ)'
    elif predicted < prev_price * 0.9:
        demand_level = 'Low (తక్కువ)'
    else:
        demand_level = 'Medium (మధ్యస్థం)'

    # Get last 6 months of historical data for the chart
    recent = rows[-6:] if len(rows) >= 6 else rows
    historical_trend = [round(r['price'], 0) for r in recent]
    historical_labels = [month_names[r['month']][:3] for r in recent]

    # Total estimated value
    unit = 'kg' if product_type != 'bamboo' else 'piece'
    total_value = round(predicted * quantity, 2)

    return {
        'predicted_price': predicted,
        'predicted_price_display': f'₹{predicted:.0f} / {unit}',
        'demand_level': demand_level,
        'best_selling_month': best_month_name,
        'confidence_score': confidence,
        'total_estimated_value': f'₹{total_value:,.0f}',
        'historical_trend': historical_trend,
        'historical_labels': historical_labels
    }


def train_all_models():
    """Train models for all product types."""
    product_types = ['honey', 'bamboo', 'fruits', 'herbs']
    for pt in product_types:
        train_model(pt)
    print("\n🤖 All ML models trained successfully!")


if __name__ == '__main__':
    train_all_models()
