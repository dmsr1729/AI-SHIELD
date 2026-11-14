import sqlite3
from datetime import datetime, timezone

from security.risk_engine import RiskEngine


DATABASE = "database/ai_shield.db"

risk_engine = RiskEngine()


def initialize_database():

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,
            execution_id TEXT,
            agent TEXT,
            tool TEXT,
            decision TEXT,
            reason TEXT,
            executed BOOLEAN,
            task TEXT,
            timestamp TEXT

        )
    """)

    cursor.execute("PRAGMA table_info(audit_logs)")

    columns = [
        row[1] for row in cursor.fetchall()
    ]

    if "risk_score" not in columns:
        cursor.execute("""
            ALTER TABLE audit_logs
            ADD COLUMN risk_score INTEGER DEFAULT 0
        """)

    if "severity" not in columns:
        cursor.execute("""
            ALTER TABLE audit_logs
            ADD COLUMN severity TEXT DEFAULT 'LOW'
        """)

    # Recalculate risk information for historical records
    cursor.execute("""
        SELECT id, agent, tool, decision
        FROM audit_logs
    """)

    records = cursor.fetchall()

    for record in records:

        record_id, agent, tool, decision = record

        risk = risk_engine.calculate_risk(
            agent,
            tool,
            decision
        )

        cursor.execute("""
            UPDATE audit_logs
            SET risk_score = ?, severity = ?
            WHERE id = ?
        """, (
            risk["risk_score"],
            risk["severity"],
            record_id
        ))

    connection.commit()
    connection.close()


def save_audit_log(task, result):

    connection = sqlite3.connect(DATABASE)
    cursor = connection.cursor()

    risk = result.get("risk_analysis", {})

    cursor.execute("""
        INSERT INTO audit_logs (
            execution_id,
            agent,
            tool,
            decision,
            reason,
            executed,
            task,
            timestamp,
            risk_score,
            severity
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        result["execution_id"],
        result["agent"],
        result["tool"],
        result["decision"],
        result["reason"],
        result["executed"],
        task,
        datetime.now(timezone.utc).isoformat(),
        risk.get("risk_score", 0),
        risk.get("severity", "LOW")
    ))

    connection.commit()
    connection.close()


def get_audit_logs():

    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM audit_logs
        ORDER BY id DESC
    """)

    logs = [
        dict(row) for row in cursor.fetchall()
    ]

    connection.close()

    return logs