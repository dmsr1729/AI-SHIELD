import sqlite3

DATABASE = "database/ai_shield.db"


class AnalyticsEngine:

    def get_analytics(self):

        connection = sqlite3.connect(DATABASE)
        cursor = connection.cursor()

        # 1. Total executions
        cursor.execute("""
            SELECT COUNT(*) FROM audit_logs
        """)
        total_executions = cursor.fetchone()[0]

        # 2. Allowed requests
        cursor.execute("""
            SELECT COUNT(*) FROM audit_logs
            WHERE decision = 'ALLOWED'
        """)
        allowed_requests = cursor.fetchone()[0]

        # 3. Blocked requests
        cursor.execute("""
            SELECT COUNT(*) FROM audit_logs
            WHERE decision = 'BLOCKED'
        """)
        blocked_requests = cursor.fetchone()[0]

        # 4. Total incidents
        cursor.execute("""
            SELECT COUNT(*) FROM security_incidents
        """)
        total_incidents = cursor.fetchone()[0]

        # 5. Incident status breakdown
        cursor.execute("""
            SELECT status, COUNT(*)
            FROM security_incidents
            GROUP BY status
        """)

        incident_status = {
            status: count
            for status, count in cursor.fetchall()
        }

        # 6. Risk levels across ALL executions
        cursor.execute("""
            SELECT severity, COUNT(*)
            FROM audit_logs
            GROUP BY severity
        """)

        execution_risk_levels = {
            severity: count
            for severity, count in cursor.fetchall()
        }

        # 7. Risk levels of detected incidents
        cursor.execute("""
            SELECT severity, COUNT(*)
            FROM security_incidents
            GROUP BY severity
        """)

        incident_risk_levels = {
            severity: count
            for severity, count in cursor.fetchall()
        }

        # 8. Agent activity
        cursor.execute("""
            SELECT agent, COUNT(*)
            FROM audit_logs
            GROUP BY agent
        """)

        agent_activity = {
            agent: count
            for agent, count in cursor.fetchall()
        }

        connection.close()

        return {

            "total_executions": total_executions,

            "allowed_requests": allowed_requests,

            "blocked_requests": blocked_requests,

            "total_incidents": total_incidents,

            "incident_status": incident_status,

            "execution_risk_levels": execution_risk_levels,

            "incident_risk_levels": incident_risk_levels,

            "agent_activity": agent_activity

        }