"""
ForestConnect AI — Database Models (SQLite)
Defines schema for users, products, schemes, and price history.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'forestconnect.db')


def get_db():
    """Get a database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Create all tables if they don't exist."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            email TEXT DEFAULT '',
            password_hash TEXT NOT NULL,
            village TEXT DEFAULT '',
            district TEXT DEFAULT '',
            state TEXT DEFAULT 'Telangana',
            language TEXT DEFAULT 'en',
            role TEXT DEFAULT 'seller',
            active_uploads_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            seller_id INTEGER NOT NULL,
            seller_name TEXT NOT NULL,
            seller_phone TEXT DEFAULT '',
            location TEXT DEFAULT '',
            quantity TEXT DEFAULT '',
            market_price REAL DEFAULT 0,
            predicted_price REAL DEFAULT 0,
            description TEXT DEFAULT '',
            gradient TEXT DEFAULT 'from-emerald-500 to-emerald-700',
            tag TEXT DEFAULT '',
            harvest_month TEXT DEFAULT '',
            expected_demand TEXT DEFAULT 'Medium',
            image TEXT DEFAULT '',
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            name_local TEXT DEFAULT '',
            category TEXT DEFAULT '',
            eligibility TEXT DEFAULT '',
            benefits TEXT DEFAULT '',
            apply_procedure TEXT DEFAULT '',
            tag TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_type TEXT NOT NULL,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            price REAL NOT NULL,
            demand_level TEXT DEFAULT 'Medium',
            rainfall_index REAL DEFAULT 50.0,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    try:
        cursor.execute("ALTER TABLE products ADD COLUMN image TEXT DEFAULT ''")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()
    print("✅ Database tables created successfully.")


def row_to_dict(row):
    """Convert a sqlite3.Row to a regular dictionary."""
    if row is None:
        return None
    return dict(row)


def rows_to_list(rows):
    """Convert a list of sqlite3.Row objects to a list of dicts."""
    return [dict(row) for row in rows]
