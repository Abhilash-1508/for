"""
ForestConnect AI — Flask Backend API
REST API endpoints for authentication, products, schemes, predictions, and weather.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import base64
import hmac
import json
import hashlib
import time
import os
import requests as http_requests

from models import get_db, init_db, row_to_dict, rows_to_list
from ml_model import predict_price, train_all_models

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─── Configuration ───────────────────────────────────────────
OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY', '')
SECRET_KEY = os.environ.get('SECRET_KEY', 'forestconnect-ai-2026-secret')

# ─── Stateless JWT Authentication ────────────────────────────

def base64url_encode(data: bytes) -> str:
    """Encode bytes to Base64URL string without padding."""
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def base64url_decode(data_str: str) -> bytes:
    """Decode Base64URL string back to bytes with automatic padding."""
    padding = '=' * (4 - (len(data_str) % 4))
    return base64.urlsafe_b64decode((data_str + padding).encode('utf-8'))

def generate_token(user_id, expires_in=7 * 24 * 3600):
    """Generate a stateless HMAC-SHA256 JWT auth token (7 days default)."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "user_id": user_id,
        "exp": int(time.time()) + expires_in
    }

    header_b64 = base64url_encode(json.dumps(header).encode('utf-8'))
    payload_b64 = base64url_encode(json.dumps(payload).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    signature_b64 = base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"

def verify_token(token_str):
    """Verify stateless JWT token signature and expiration. Returns user_id or None."""
    try:
        parts = token_str.split('.')
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        actual_sig = base64url_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(base64url_decode(payload_b64).decode('utf-8'))
        if payload.get('exp', 0) < time.time():
            return None  # Expired

        return payload.get('user_id')
    except Exception:
        return None

def get_current_user():
    """Extract user from Authorization header using stateless JWT verification."""
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header[7:]
        user_id = verify_token(token)
        if user_id:
            conn = get_db()
            user = row_to_dict(conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone())
            conn.close()
            return user
    return None


# ═══════════════════════════════════════════════════════════════
#  AUTH ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login with mobile/email and password."""
    data = request.get_json()
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '').strip()

    if not identifier or not password:
        return jsonify({'success': False, 'message': 'Please fill all fields'}), 400

    conn = get_db()
    user = row_to_dict(conn.execute(
        'SELECT * FROM users WHERE mobile = ? OR email = ?',
        (identifier, identifier)
    ).fetchone())
    conn.close()

    if not user:
        # For demo: create user on-the-fly with default password
        return jsonify({'success': False, 'message': 'User not found. Please register first.'}), 404

    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'success': False, 'message': 'Invalid password'}), 401

    token = generate_token(user['id'])

    user_data = {k: v for k, v in user.items() if k != 'password_hash'}
    user_data['activeUploadsCount'] = user_data.pop('active_uploads_count', 0)

    return jsonify({
        'success': True,
        'token': token,
        'user': user_data
    })


@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    name = data.get('name', '').strip()
    mobile = data.get('mobile', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    village = data.get('village', '').strip()
    district = data.get('district', '').strip()
    state = data.get('state', 'Telangana').strip()
    language = data.get('language', 'en').strip()

    if not name or not mobile or not password:
        return jsonify({'success': False, 'message': 'Name, mobile, and password are required'}), 400

    pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db()
    try:
        cursor = conn.execute('''
            INSERT INTO users (name, mobile, email, password_hash, village, district, state, language, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'seller')
        ''', (name, mobile, email, pw_hash, village, district, state, language))
        conn.commit()
        user_id = cursor.lastrowid

        token = generate_token(user_id)

        user_data = {
            'id': user_id, 'name': name, 'mobile': mobile, 'email': email,
            'village': village, 'district': district, 'state': state,
            'language': language, 'role': 'seller', 'activeUploadsCount': 0
        }

        conn.close()
        return jsonify({'success': True, 'token': token, 'user': user_data}), 201

    except Exception as e:
        conn.close()
        if 'UNIQUE constraint' in str(e):
            return jsonify({'success': False, 'message': 'Mobile number already registered'}), 409
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/auth/profile', methods=['PUT'])
def update_profile():
    """Update user profile."""
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    data = request.get_json()
    conn = get_db()
    conn.execute('''
        UPDATE users SET name=?, email=?, village=?, district=?, state=?, language=?
        WHERE id=?
    ''', (
        data.get('name', user['name']),
        data.get('email', user['email']),
        data.get('village', user['village']),
        data.get('district', user['district']),
        data.get('state', user['state']),
        data.get('language', user['language']),
        user['id']
    ))
    conn.commit()

    updated = row_to_dict(conn.execute('SELECT * FROM users WHERE id=?', (user['id'],)).fetchone())
    conn.close()

    updated_data = {k: v for k, v in updated.items() if k != 'password_hash'}
    updated_data['activeUploadsCount'] = updated_data.pop('active_uploads_count', 0)
    return jsonify({'success': True, 'user': updated_data})


# ═══════════════════════════════════════════════════════════════
#  PRODUCT ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all active products, with optional category/search filters."""
    category = request.args.get('category', 'all')
    search = request.args.get('search', '').lower()
    location = request.args.get('location', 'all')

    conn = get_db()
    query = 'SELECT * FROM products WHERE status = "active"'
    params = []

    if category != 'all':
        query += ' AND category = ?'
        params.append(category)

    if search:
        query += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(seller_name) LIKE ?)'
        params.extend([f'%{search}%'] * 3)

    if location != 'all':
        query += ' AND location LIKE ?'
        params.append(f'%{location}%')

    query += ' ORDER BY created_at DESC'
    rows = rows_to_list(conn.execute(query, params).fetchall())
    conn.close()

    # Convert snake_case to camelCase for frontend compatibility
    products = []
    for row in rows:
        products.append({
            'id': f"p{row['id']}",
            'name': row['name'],
            'category': row['category'],
            'sellerName': row['seller_name'],
            'sellerPhone': row['seller_phone'],
            'location': row['location'],
            'quantity': row['quantity'],
            'marketPrice': row['market_price'],
            'predictedPrice': row['predicted_price'],
            'description': row['description'],
            'gradient': row['gradient'],
            'tag': row['tag'],
            'harvestMonth': row['harvest_month'],
            'expectedDemand': row['expected_demand'],
            'image': row['image'] if 'image' in row.keys() else ''
        })

    return jsonify({'success': True, 'products': products})


@app.route('/api/products', methods=['POST'])
def add_product():
    """Add a new product listing."""
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    data = request.get_json()

    month_map = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    target_month = month_map.get(data.get('harvestMonth', ''), 7)
    
    # Get ML prediction for the product
    category = data.get('category', 'honey')
    market_price = float(data.get('marketPrice', 0))
    prediction = predict_price(category, target_month)
    predicted_price = prediction['predicted_price'] if prediction['predicted_price'] > 0 else market_price * 1.15

    gradient_map = {
        'honey': 'from-amber-400 to-amber-600',
        'bamboo': 'from-green-500 to-emerald-700',
        'fruits': 'from-lime-400 to-lime-600',
        'herbs': 'from-emerald-800 to-teal-950',
        'handicrafts': 'from-amber-700 to-yellow-900'
    }

    conn = get_db()
    cursor = conn.execute('''
        INSERT INTO products (name, category, seller_id, seller_name, seller_phone, location,
            quantity, market_price, predicted_price, description, gradient, tag, harvest_month, expected_demand, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get('name', ''),
        category,
        user['id'],
        user['name'],
        user['mobile'],
        data.get('location', f"{user['village']}, {user['district']}"),
        data.get('quantity', ''),
        market_price,
        round(predicted_price, 2),
        data.get('description', ''),
        gradient_map.get(category, 'from-emerald-500 to-emerald-700'),
        'New Listing',
        data.get('harvestMonth', ''),
        prediction.get('demand_level', 'Medium').split(' ')[0],
        data.get('image', '')
    ))
    conn.commit()

    # Update user's upload count
    conn.execute('UPDATE users SET active_uploads_count = active_uploads_count + 1 WHERE id = ?', (user['id'],))
    conn.commit()
    return jsonify({'success': True, 'message': 'Product listed successfully', 'productId': cursor.lastrowid}), 201


@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID."""
    try:
        numeric_id = int(str(product_id).replace('p', ''))
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid product ID format'}), 400

    conn = get_db()
    row = row_to_dict(conn.execute('SELECT * FROM products WHERE id = ? AND status = "active"', (numeric_id,)).fetchone())
    conn.close()

    if not row:
        return jsonify({'success': False, 'message': 'Product not found'}), 404

    product = {
        'id': f"p{row['id']}",
        'name': row['name'],
        'category': row['category'],
        'sellerName': row['seller_name'],
        'sellerPhone': row['seller_phone'],
        'location': row['location'],
        'quantity': row['quantity'],
        'marketPrice': row['market_price'],
        'predictedPrice': row['predicted_price'],
        'description': row['description'],
        'gradient': row['gradient'],
        'tag': row['tag'],
        'harvestMonth': row['harvest_month'],
        'expectedDemand': row['expected_demand'],
        'image': row['image'] if 'image' in row.keys() else ''
    }

    return jsonify({'success': True, 'product': product})



@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Update an existing product listing."""
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    try:
        numeric_id = int(str(product_id).replace('p', ''))
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid product ID format'}), 400

    data = request.get_json()
    
    conn = get_db()
    # Ensure the user is the owner
    row = conn.execute('SELECT id FROM products WHERE id = ? AND seller_id = ? AND status = "active"', (numeric_id, user['id'])).fetchone()
    if not row:
        conn.close()
        return jsonify({'success': False, 'message': 'Product not found or unauthorized'}), 404

    # Get ML prediction for the updated product
    category = data.get('category', 'honey')
    market_price = float(data.get('marketPrice', 0))
    
    month_map = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    target_month = month_map.get(data.get('harvestMonth', ''), 7)
    
    prediction = predict_price(category, target_month)
    predicted_price = prediction['predicted_price'] if prediction['predicted_price'] > 0 else market_price * 1.15

    gradient_map = {
        'honey': 'from-amber-400 to-amber-600',
        'bamboo': 'from-green-500 to-emerald-700',
        'fruits': 'from-lime-400 to-lime-600',
        'herbs': 'from-emerald-800 to-teal-950',
        'handicrafts': 'from-amber-700 to-yellow-900'
    }

    conn.execute('''
        UPDATE products SET 
            name = ?, category = ?, location = ?, quantity = ?, 
            market_price = ?, predicted_price = ?, description = ?, 
            gradient = ?, harvest_month = ?, expected_demand = ?
        WHERE id = ?
    ''', (
        data.get('name', ''),
        category,
        data.get('location', ''),
        data.get('quantity', ''),
        market_price,
        round(predicted_price, 2),
        data.get('description', ''),
        gradient_map.get(category, 'from-emerald-500 to-emerald-700'),
        data.get('harvestMonth', ''),
        prediction.get('demand_level', 'Medium').split(' ')[0],
        numeric_id
    ))
    conn.commit()
    conn.close()

    return jsonify({'success': True, 'message': 'Product updated successfully'})


@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete (deactivate) a product listing."""
    user = get_current_user()
    if not user:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    try:
        numeric_id = int(str(product_id).replace('p_temp_', '').replace('p', ''))
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid product ID format'}), 400

    conn = get_db()
    cursor = conn.execute('UPDATE products SET status = "deleted" WHERE id = ? AND seller_id = ?', (numeric_id, user['id']))
    affected = cursor.rowcount
    if affected > 0:
        conn.execute('UPDATE users SET active_uploads_count = MAX(0, active_uploads_count - 1) WHERE id = ?', (user['id'],))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Product deleted successfully'})
    else:
        conn.close()
        return jsonify({'success': False, 'message': 'Product not found or unauthorized'}), 404


# ═══════════════════════════════════════════════════════════════
#  SCHEMES ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    """Get all government schemes, optionally filtered by occupation and state."""
    occupation = request.args.get('occupation', 'all').strip().lower()
    state = request.args.get('state', 'all').strip().lower()

    conn = get_db()
    rows = rows_to_list(conn.execute('SELECT * FROM schemes').fetchall())
    conn.close()

    # Basic normalization & filtering based on occupation
    if occupation in ('farmer', 'bamboo farmer', 'amla farmer'):
        rows = [s for s in rows if s['category'] in ('agriculture', 'economic')]
    elif occupation in ('artisan', 'handicrafts artisan'):
        rows = [s for s in rows if s['category'] in ('livelihood', 'agriculture')]
    elif occupation in ('gatherer', 'forest gatherer'):
        rows = [s for s in rows if s['category'] in ('livelihood', 'economic', 'welfare')]

    # Filter by state eligibility if specified
    if state != 'all':
        # Ensure regional programs are matched (e.g., GCC/Telangana specifics)
        # Note: Seeding contains national schemes, which are always kept
        rows = [s for s in rows if 'telangana' in s['eligibility'].lower() or 'all' in s['eligibility'].lower() or 'tribal' in s['eligibility'].lower() or 'state' in s['eligibility'].lower() or 'national' in s['eligibility'].lower()]

    schemes = []
    for row in rows:
        schemes.append({
            'id': f"s{row['id']}",
            'name': row['name'],
            'nameLocal': row['name_local'],
            'category': row['category'],
            'eligibility': row['eligibility'],
            'benefits': row['benefits'],
            'applyProcedure': row['apply_procedure'],
            'tag': row['tag']
        })

    return jsonify({'success': True, 'schemes': schemes})


# ═══════════════════════════════════════════════════════════════
#  ML PREDICTION ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.route('/api/predict', methods=['POST'])
def get_prediction():
    """Run ML price prediction for a forest product."""
    data = request.get_json()
    product_type = data.get('productType', 'honey')
    quantity = int(data.get('quantity', 1))
    month_name = data.get('month', 'July')

    month_map = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    target_month = month_map.get(month_name, 7)

    result = predict_price(product_type, target_month, quantity)
    return jsonify({'success': True, 'prediction': result})


# ═══════════════════════════════════════════════════════════════
#  WEATHER ENDPOINT
# ═══════════════════════════════════════════════════════════════

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data — real API or fallback to mock."""
    lat = request.args.get('lat', '19.08')  # Adilabad
    lon = request.args.get('lon', '78.27')

    if OPENWEATHER_API_KEY:
        try:
            # Current weather
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            current_resp = http_requests.get(current_url, timeout=5).json()

            # 5-day forecast
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            forecast_resp = http_requests.get(forecast_url, timeout=5).json()

            temp = round(current_resp['main']['temp'])
            humidity = current_resp['main']['humidity']
            wind = round(current_resp['wind']['speed'] * 3.6)  # m/s to km/h
            condition = current_resp['weather'][0]['description'].title()

            # Generate forest-gatherer advisory
            advisory_en, advisory_te = generate_advisory(temp, humidity, condition)

            # Process 5-day forecast (pick noon readings)
            day_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            forecast_list = []
            seen_dates = set()
            for entry in forecast_resp.get('list', []):
                from datetime import datetime
                dt = datetime.fromtimestamp(entry['dt'])
                date_str = dt.strftime('%Y-%m-%d')
                if date_str not in seen_dates and len(forecast_list) < 5:
                    seen_dates.add(date_str)
                    icon = map_weather_icon(entry['weather'][0]['main'])
                    forecast_list.append({
                        'day': day_names[dt.weekday()] if len(forecast_list) > 0 else 'Today',
                        'temp': f"{round(entry['main']['temp'])}°C",
                        'icon': icon
                    })

            return jsonify({
                'success': True,
                'source': 'live',
                'weather': {
                    'temp': f"{temp}°C",
                    'condition': condition,
                    'humidity': f"{humidity}%",
                    'wind': f"{wind} km/h",
                    'advisory': {'en': advisory_en, 'te': advisory_te},
                    'forecast': forecast_list
                }
            })

        except Exception as e:
            print(f"Weather API error: {e}")
            # Fall through to mock data

    # Fallback mock data
    return jsonify({
        'success': True,
        'source': 'offline',
        'weather': {
            'temp': '29°C',
            'condition': 'Scattered Showers (జల్లులు కురిసే అవకాశం)',
            'humidity': '82%',
            'wind': '14 km/h',
            'advisory': {
                'en': 'High humidity is expected. Ensure gathered Mahua flowers and herbs are kept covered in dry, elevated areas to prevent mold formation. Ideal weather for planting bamboo saplings.',
                'te': 'అధిక తేమ నమోదయ్యే అవకాశం ఉంది. సేకరించిన విప్ప పువ్వులు, మూలికలు బూజు పట్టకుండా పొడిగా ఉండే ఎత్తైన ప్రదేశాలలో భద్రపరచండి. వెదురు మొక్కలు నాటడానికి అనుకూలమైన వాతావరణం.'
            },
            'forecast': [
                {'day': 'Today', 'temp': '29°C', 'icon': 'cloud-rain'},
                {'day': 'Thu', 'temp': '30°C', 'icon': 'cloud'},
                {'day': 'Fri', 'temp': '32°C', 'icon': 'sun'},
                {'day': 'Sat', 'temp': '31°C', 'icon': 'cloud-sun'},
                {'day': 'Sun', 'temp': '28°C', 'icon': 'cloud-rain'}
            ]
        }
    })


def map_weather_icon(condition):
    """Map OpenWeather condition to our icon names."""
    mapping = {
        'Clear': 'sun',
        'Clouds': 'cloud',
        'Rain': 'cloud-rain',
        'Drizzle': 'cloud-rain',
        'Thunderstorm': 'cloud-rain',
        'Mist': 'cloud',
        'Haze': 'cloud-sun',
        'Fog': 'cloud',
    }
    return mapping.get(condition, 'cloud-sun')


def generate_advisory(temp, humidity, condition):
    """Generate forest-gatherer specific weather advisory."""
    advisories_en = []
    advisories_te = []

    if humidity > 75:
        advisories_en.append("High humidity detected. Keep dried forest produce (Mahua, herbs) in covered, elevated areas to prevent mold.")
        advisories_te.append("అధిక తేమ ఉంది. ఎండబెట్టిన అటవీ ఉత్పత్తులను (విప్ప, మూలికలు) బూజు పట్టకుండా కప్పి ఉంచండి.")

    if 'rain' in condition.lower() or 'drizzle' in condition.lower():
        advisories_en.append("Rain expected. Delay honey collection and ensure bamboo stocks are covered.")
        advisories_te.append("వర్షం వచ్చే అవకాశం. తేనె సేకరణను వాయిదా వేయండి, వెదురు నిల్వలను కప్పి ఉంచండి.")

    if temp > 35:
        advisories_en.append("Heat advisory: Carry water during forest gathering. Avoid midday collection hours.")
        advisories_te.append("వేడి హెచ్చరిక: అటవీ సేకరణ సమయంలో నీరు తీసుకెళ్లండి. మధ్యాహ్నం సేకరించడం మానుకోండి.")

    if temp < 15:
        advisories_en.append("Cold conditions. Morning dew may affect dried produce quality. Allow extra sun-drying time.")
        advisories_te.append("చల్లని వాతావరణం. ఉదయం మంచు ఎండబెట్టిన ఉత్పత్తుల నాణ్యతను ప్రభావితం చేయవచ్చు.")

    if not advisories_en:
        advisories_en.append("Weather is favorable for forest product gathering and processing activities.")
        advisories_te.append("అటవీ ఉత్పత్తుల సేకరణ మరియు ప్రాసెసింగ్ కార్యకలాపాలకు వాతావరణం అనుకూలంగా ఉంది.")

    return ' '.join(advisories_en), ' '.join(advisories_te)


# ═══════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ═══════════════════════════════════════════════════════════════

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'ForestConnect AI Backend', 'version': '1.0.0'})


# ═══════════════════════════════════════════════════════════════
#  APPLICATION STARTUP
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    print("🌿 ForestConnect AI Backend Starting...")

    # Initialize database
    init_db()

    # Check if DB needs seeding
    conn = get_db()
    user_count = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    conn.close()

    if user_count == 0:
        print("📦 Seeding database with initial data...")
        from seed_data import seed_users, seed_products, seed_schemes, seed_price_history
        seed_users()
        seed_products()
        seed_schemes()
        seed_price_history()

    # Train ML models
    print("🤖 Training ML price prediction models...")
    train_all_models()

    print("\n✅ Backend ready at http://localhost:5000")
    print("📡 API Base: http://localhost:5000/api")
    print(f"🌦️  Weather API: {'Configured' if OPENWEATHER_API_KEY else 'Using mock data (set OPENWEATHER_API_KEY env var)'}")

    app.run(debug=True, port=5000)
