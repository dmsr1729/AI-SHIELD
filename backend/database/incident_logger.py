import sqlite3

DATABASE = "database/ai_shield.db"


def initialize_incident_table():

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_incidents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            incident_id TEXT UNIQUE,
            agent TEXT,
            tool TEXT,
            task TEXT,
            decision TEXT,
            risk_score INTEGER,
            severity TEXT,
            description TEXT,
            status TEXT,
            detected_at TEXT

        )
    """)

    connection.commit()
    connection.close()


def save_incident(incident):

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO security_incidents (
            incident_id, agent, tool, task,
            decision, risk_score, severity,
            description, status, detected_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        incident["incident_id"],
        incident["agent"],
        incident["tool"],
        incident["task"],
        incident["decision"],
        incident["risk_score"],
        incident["severity"],
        incident["description"],
        incident["status"],
        incident["detected_at"]
    ))

    connection.commit()
    connection.close()


def get_incidents():

    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM security_incidents
        ORDER BY id DESC
    """)

    incidents = [
        dict(row) for row in cursor.fetchall()
    ]

    connection.close()

    return incidents


# Update incident status
def update_incident_status(incident_id, new_status):

    allowed_statuses = [
        "OPEN",
        "INVESTIGATING",
        "RESOLVED"
    ]

    if new_status not in allowed_statuses:
        return False

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE security_incidents
        SET status = ?
        WHERE incident_id = ?
    """, (new_status, incident_id))

    updated = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return updated