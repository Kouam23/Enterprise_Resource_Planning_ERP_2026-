import sqlite3
import os

DB_FILE = "erp_db.db"

def fix_db():
    if not os.path.exists(DB_FILE):
        print(f"Database {DB_FILE} not found!")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Fix ForumPost
    try:
        cursor.execute("ALTER TABLE forumpost ADD COLUMN target_role_id INTEGER")
        print("Added target_role_id to forumpost")
    except sqlite3.OperationalError as e:
        print(f"forumpost: {e}")

    # Fix Notice (just in case)
    try:
        cursor.execute("ALTER TABLE notice ADD COLUMN target_role_id INTEGER")
        print("Added target_role_id to notice")
    except sqlite3.OperationalError as e:
        print(f"notice: {e}")

    conn.commit()
    conn.close()
    print("Database fix completed.")

if __name__ == "__main__":
    fix_db()
