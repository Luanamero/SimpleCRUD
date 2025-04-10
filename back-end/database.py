import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# Database connection parameters
DB_CONFIG = {
    "host": "caboose.proxy.rlwy.net",
    "port": "56510",
    "database": "railway",
    "user": "postgres",
    "password": "OPMuEZPtCOBSIxbSGdbYDYgjcGlwQebr"
}

@contextmanager
def get_db_connection():
    """Create a database connection as a context manager."""
    conn = None
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            database=DB_CONFIG["database"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"]
        )
        yield conn
    finally:
        if conn is not None:
            conn.close()

@contextmanager
def get_db_cursor(commit=False):
    """Create a database cursor as a context manager."""
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cursor
            if commit:
                conn.commit()
        finally:
            cursor.close()