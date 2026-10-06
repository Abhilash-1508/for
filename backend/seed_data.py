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
            pass

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

        ("Mahua Flowers - Sun-dried (విప్ప పూలు)", "seeds_gums", 4, "Laxmi Madavi", "+91 96182 33455",
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

        ("Wild Turmeric & Black Pepper (అడవి పసుపు & మిరియాలు)", "spices", 1, "Bheemrao Soyam", "+91 98491 55667",
         "Jainoor Forest Range, Adilabad", "95 kg", 210, 260,
         "Organic forest-grown wild turmeric rhizomes and sun-dried aromatic black pepper. Rich in curcumin and high in natural essential oils.",
         "from-amber-500 to-orange-700", "High Quality", "February", "High"),

        ("Tendu Leaves Bundle (తునికి ఆకులు)", "leaves_fibers", 1, "Gond Van Sahakari Society", "+91 94901 33211",
         "Asifabad Forest Division", "1500 bundles", 45, 55,
         "Premium hand-picked season Tendu leaves tied in standard bundles. Clean, dry, flexible leaves stored in climate-controlled godowns.",
         "from-emerald-700 to-green-900", "Bulk Ready", "May", "High")
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
        ("Pradhan Mantri Van Dhan Yojana (PMVDY)", "ప్రధాన మంత్రి వన్ ధన్ యోజన", "Livelihood",
         "Tribal gatherers, members of Van Dhan Self-Help Groups (SHGs) and forest cooperatives.",
         "Funding of ₹15 Lakhs per Van Dhan Vikas Kendra (300 members) for value addition tools, solar dryers, packaging machinery, and skill training.",
         "Form a Self-Help Group of 15-20 gatherers and register via District Nodal Officer or TRIFED PMVDY Portal.",
         "Recommended"),

        ("Minimum Support Price (MSP) for Minor Forest Produce (MSP for MFP)", "అటవీ ఉత్పత్తులకు కనీస మద్దతు ధర", "Financial",
         "All registered tribal forest gatherers selling declared Minor Forest Produce items.",
         "Floor price protection for 87+ notified minor forest products (Honey, Amla, Mahua, Tamarind, Karaya Gum). Direct bank transfer (DBT).",
         "Register with the local Primary Procurement Center run by GCC (Girijan Co-operative Corporation) or Forest Department.",
         "Financial Support"),

        ("Girijan Cooperative Corporation (GCC) Procurement Scheme", "గిరిజన సహకార సంస్థ (GCC) సేకరణ పథకం", "Financial",
         "Tribal gatherers in Telangana & Andhra Pradesh forest regions.",
         "Guaranteed door-step fair price procurement of forest produce, prompt cash/digital payment, micro-credit access, and seasonal advance payouts.",
         "Enroll at your nearest GCC Divisional Office or Primary Marketing Society with Aadhar & Bank Passbook.",
         "State Guarantee"),

        ("PM-JANMAN (Pradhan Mantri Janjati Adivasi Nyaya Maha Abhiyan)", "పీఎం-జన్మన్ (ప్రధాన మంత్రి జనజాతి ఆదివాసీ న్యాయ్ మహా అభియాన్)", "Livelihood",
         "Particularly Vulnerable Tribal Groups (PVTGs) and tribal habitations across forest belts.",
         "Comprehensive electrification, Pucca housing (PMAY-G), clean drinking water pipelines, mobile medical units, and VDVK multi-purpose facility centers.",
         "Applications processed through District Tribal Welfare Nodal Officers and Gram Sabha enumeration camps.",
         "Priority Mission"),

        ("TRIFED Retail & E-Commerce Marketing Linkage", "ట్రైఫెడ్ రిటైల్ & ఈ-కామర్స్ మార్కెటింగ్ లింకేజ్", "Livelihood",
         "Tribal artisans, gatherers, SHGs, and forest product producers.",
         "Listing and direct sale of products on Tribes India retail outlets, Amazon, Flipkart, and GeM portal with zero platform commission.",
         "Submit sample products and SHG certification to regional TRIFED office for quality auditing and cataloging.",
         "Market Linkage"),

        ("National Scheduled Tribes Finance and Development Corporation (NSTFDC) Term Loan Scheme", "జాతీయ షెడ్యూల్డ్ తెగల ఆర్థిక మరియు అభివృద్ధి సంస్థ రుణాలు", "Financial",
         "Scheduled Tribe individuals or SHGs with annual family income up to ₹3,00,000.",
         "Concessional loans up to ₹10 Lakhs for setting up agro-processing units, bamboo workshops, and forest produce value-addition business with interest as low as 6% p.a.",
         "Apply through State Channelizing Agencies (SCA) or Scheduled Commercial Banks handling tribal welfare funds.",
         "Low Interest Loan"),

        ("Eklavya Model Residential Schools (EMRS) & Scholarship Scheme", "ఏకలవ్య మోడల్ గురుకుల పాఠశాలలు & స్కాలర్‌షిప్ పథకం", "Education",
         "ST students from Class 6 to 12 and higher education tribal scholars.",
         "100% free quality boarding education, uniforms, textbooks, computer labs, sports coaching, and full pre/post-matric scholarship grants.",
         "Apply online via National Scholarship Portal (NSP) or State EMRS Admission Entrance Portal.",
         "Education Welfare")
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

    product_configs = {
        'honey': {'base_price': 280, 'seasonal_peaks': [4, 5, 6], 'seasonal_low': [11, 12, 1], 'volatility': 25, 'trend': 3.5},
        'bamboo': {'base_price': 95, 'seasonal_peaks': [10, 11, 12], 'seasonal_low': [5, 6, 7], 'volatility': 12, 'trend': 1.5},
        'fruits': {'base_price': 70, 'seasonal_peaks': [1, 2, 8], 'seasonal_low': [5, 6, 7], 'volatility': 15, 'trend': 2.0},
        'herbs': {'base_price': 120, 'seasonal_peaks': [10, 11, 3], 'seasonal_low': [6, 7, 8], 'volatility': 18, 'trend': 2.5}
    }

    rainfall_by_month = {
        1: 10, 2: 12, 3: 15, 4: 20, 5: 30, 6: 85,
        7: 95, 8: 90, 9: 75, 10: 55, 11: 25, 12: 12
    }

    for product_type, config in product_configs.items():
        for year in [2024, 2025, 2026]:
            for month in range(1, 13):
                if year == 2026 and month > 7:
                    continue

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
    print("✅ Price history seeded.")


if __name__ == '__main__':
    init_db()
    seed_users()
    seed_products()
    seed_schemes()
    seed_price_history()
    print("\n🌿 ForestConnect AI database fully seeded!")
