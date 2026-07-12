"""
ForestConnect AI — Seed Data
Populates the database with initial products, schemes, and price history for ML training.
"""

import bcrypt
from models import get_db, init_db
import random


def seed_users():
    """Seed demo users."""
    conn = get_db()
    cursor = conn.cursor()

    users = [
        ("Raju Mandavi", "9876543210", "raju.mandavi@gmail.com", "password123", "Gudipadu", "Adilabad", "Telangana", "te", "seller"),
        ("Somu Pendur", "9848022310", "", "password123", "Utnoor", "Adilabad", "Telangana", "te", "seller"),
        ("Jangu Kodapa", "8500299188", "", "password123", "Kerameri", "Adilabad", "Telangana", "te", "seller"),
        ("Laxmi Madavi", "9618233455", "", "password123", "Indervelly", "Adilabad", "Telangana", "te", "seller"),
        ("Ramanji Kodapa", "7382044521", "", "password123", "Narnoor", "Adilabad", "Telangana", "te", "seller"),
        ("Director of Tribal Welfare", "9900990099", "admin@tribalwelfare.gov.in", "admin123", "Hyderabad HQ", "Hyderabad", "Telangana", "en", "admin"),
    ]

    for name, mobile, email, password, village, district, state, lang, role in users:
        pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            cursor.execute('''
                INSERT INTO users (name, mobile, email, password_hash, village, district, state, language, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, mobile, email, pw_hash, village, district, state, lang, role))
        except Exception:
            pass  # Skip duplicates on re-seed

    conn.commit()
    conn.close()
    print("✅ Users seeded.")


def seed_products():
    """Seed initial forest products."""
    conn = get_db()
    cursor = conn.cursor()

    products = [
        ("Organic Wild Honey (అడవి తేనె)", "honey", 2, "Somu Pendur", "+91 98480 22310",
         "Utnoor Forest, Adilabad District", "45 kg", 320, 380,
         "Pure, unprocessed honey collected by tribal gatherers from high cliff beehives. Excellent medicinal value, rich in antioxidants and free of artificial additives.",
         "from-amber-400 to-amber-600", "High Demand", "May", "High"),

        ("Premium Bamboo Poles (వెదురు కర్రలు)", "bamboo", 1, "Kumram Bheem SHG", "+91 94405 11200",
         "Gudipadu Village, Adilabad District", "500 pieces", 110, 135,
         "Strong, seasoned solid bamboo poles ideal for construction, handicrafts, scaffolding, and fencing. Ethically harvested under local community forest management.",
         "from-green-500 to-emerald-700", "Bulk Available", "December", "Medium"),

        ("Dried Amla Fruit (ఎండిన ఉసిరి)", "fruits", 3, "Jangu Kodapa", "+91 85002 99188",
         "Kerameri Hills, Adilabad District", "120 kg", 90, 105,
         "Sun-dried organic gooseberries, manually harvested from deep forest tracts. High vitamin C content, processed naturally without chemical preservatives.",
         "from-lime-400 to-lime-600", "Best Price Forecast", "January", "High"),

        ("Mahua Flowers - Sun-dried (విప్ప పూలు)", "fruits", 4, "Laxmi Madavi", "+91 96182 33455",
         "Indervelly Forest, Adilabad District", "250 kg", 65, 85,
         "High-quality, freshly fallen Mahua flowers, collected at dawn and sun-dried on clean mats. Used widely for traditional food products and oil extraction.",
         "from-yellow-600 to-amber-800", "Stable Price", "April", "Medium"),

        ("Haritaki / Karakkaya (కరక్కాయ)", "herbs", 5, "Ramanji Kodapa", "+91 73820 44521",
         "Narnoor Forest, Adilabad District", "80 kg", 140, 160,
         "A-grade dried Haritaki fruits. Key ingredient in Triphala formulation, highly valued in Ayurvedic and traditional medicine for digestive health.",
         "from-emerald-800 to-teal-950", "Highly Valued", "November", "High"),

        ("Handwoven Bamboo Baskets (వెదురు బుట్టలు)", "handicrafts", 1, "Koya Craft Cooperative", "+91 91223 88440",
         "Bhadrachalam, Bhadradri Kothagudem", "60 items", 180, 220,
         "Finely split and hand-woven utility baskets. Made using traditional patterns passed down generations. Sturdy, eco-friendly, and lightweight.",
         "from-amber-700 to-yellow-900", "Artisanal", "Year-Round", "Medium"),
    ]

    for p in products:
        try:
            cursor.execute('''
                INSERT INTO products (name, category, seller_id, seller_name, seller_phone, location,
                    quantity, market_price, predicted_price, description, gradient, tag, harvest_month, expected_demand)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', p)
        except Exception:
            pass

    conn.commit()
    conn.close()
    print("✅ Products seeded.")


def seed_schemes():
    """Seed government welfare schemes."""
    conn = get_db()
    cursor = conn.cursor()

    schemes = [
        ("Pradhan Mantri Van Dhan Yojana (PMVDY)", "ప్రధాన మంత్రి వన్ ధన్ యోజన", "livelihood",
         "Tribal gatherers, members of Van Dhan Self-Help Groups (SHGs).",
         "Funding of ₹15 Lakhs per Van Dhan Vikas Kendra (300 members) for value addition infrastructure, tools, packaging machinery, and skill development training.",
         "Form a Self-Help Group of 15-20 gatherers and register via District Nodal Officer or Tribal Development Department portal.",
         "Recommended"),

        ("Minimum Support Price (MSP) for MFP", "అటవీ ఉత్పత్తులకు కనీస మద్దతు ధర", "economic",
         "All registered tribal forest gatherers selling declared Minor Forest Produce.",
         "Ensures floor prices for 73+ minor forest products (including Honey, Amla, Mahua, Tamarind). Direct bank transfer (DBT) to prevent exploitation by middlemen.",
         "Register with the local Primary Procurement Center run by GCC (Girijan Co-operative Corporation) or forest department.",
         "Financial Support"),

        ("National Bamboo Mission (NBM)", "జాతీయ వెదురు మిషన్", "agriculture",
         "Farmers, artisans, and cooperatives owning suitable land for bamboo plantation.",
         "Up to 50% subsidy (₹50,000 per hectare) for raising bamboo nurseries and plantations, along with technical support and marketing assistance.",
         "Submit application with land records and layout plan to state horticulture/forest nodal officers.",
         "Subsidy"),

        ("FRA (Forest Rights Act) Community Title Benefits", "అటవీ హక్కుల చట్టం ప్రయోజనాలు", "welfare",
         "Traditional forest dwellers and Scheduled Tribes residing in forest lands prior to Dec 2005.",
         "Legal recognition of rights to use, manage, and sell minor forest produce, construct minor check dams, and access community forest resources.",
         "Submit claim form through local Gram Sabha (Village Committee) to Sub-Divisional Committee.",
         "Legal Title"),
    ]

    for s in schemes:
        try:
            cursor.execute('''
                INSERT INTO schemes (name, name_local, category, eligibility, benefits, apply_procedure, tag)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', s)
        except Exception:
            pass

    conn.commit()
    conn.close()
    print("✅ Schemes seeded.")


def seed_price_history():
    """Generate 2 years of monthly price history for ML training."""
    conn = get_db()
    cursor = conn.cursor()

    # Base prices and seasonal patterns for each product type
    product_configs = {
        'honey': {
            'base_price': 280,
            'seasonal_peaks': [4, 5, 6],  # April-June (harvest season)
            'seasonal_low': [11, 12, 1],
            'volatility': 25,
            'trend': 3.5  # Monthly upward trend
        },
        'bamboo': {
            'base_price': 95,
            'seasonal_peaks': [10, 11, 12],  # Oct-Dec (construction season)
            'seasonal_low': [5, 6, 7],
            'volatility': 12,
            'trend': 1.5
        },
        'fruits': {
            'base_price': 70,
            'seasonal_peaks': [1, 2, 8],  # Post-harvest peaks
            'seasonal_low': [5, 6, 7],
            'volatility': 15,
            'trend': 2.0
        },
        'herbs': {
            'base_price': 120,
            'seasonal_peaks': [10, 11, 3],  # Ayurvedic demand peaks
            'seasonal_low': [6, 7, 8],
            'volatility': 18,
            'trend': 2.5
        }
    }

    rainfall_by_month = {
        1: 10, 2: 12, 3: 15, 4: 20, 5: 30, 6: 85,
        7: 95, 8: 90, 9: 75, 10: 55, 11: 25, 12: 12
    }

    for product_type, config in product_configs.items():
        for year in [2024, 2025, 2026]:
            for month in range(1, 13):
                if year == 2026 and month > 7:
                    continue  # Don't generate future data

                base = config['base_price']
                months_elapsed = (year - 2024) * 12 + month
                trend_adj = config['trend'] * months_elapsed

                if month in config['seasonal_peaks']:
                    seasonal_adj = config['volatility'] * 0.8
                elif month in config['seasonal_low']:
                    seasonal_adj = -config['volatility'] * 0.6
                else:
                    seasonal_adj = 0

                noise = random.uniform(-config['volatility'] * 0.3, config['volatility'] * 0.3)
                price = round(base + trend_adj + seasonal_adj + noise, 2)

                rainfall = rainfall_by_month[month] + random.uniform(-10, 10)

                demand = 'High' if month in config['seasonal_peaks'] else ('Low' if month in config['seasonal_low'] else 'Medium')

                cursor.execute('''
                    INSERT INTO price_history (product_type, month, year, price, demand_level, rainfall_index)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (product_type, month, year, price, demand, round(rainfall, 1)))

    conn.commit()
    conn.close()
    print("✅ Price history seeded (2+ years of monthly data for ML training).")


if __name__ == '__main__':
    init_db()
    seed_users()
    seed_products()
    seed_schemes()
    seed_price_history()
    print("\n🌿 ForestConnect AI database fully seeded!")
