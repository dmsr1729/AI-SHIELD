import uuid
from datetime import datetime, timezone


class IncidentDetector:

    def detect_incident(self, task, result):

        risk = result.get("risk_analysis", {})

        risk_score = risk.get("risk_score", 0)
        severity = risk.get("severity", "LOW")

        # Create incidents only for HIGH or CRITICAL risks
        if severity not in ["HIGH", "CRITICAL"]:
            return None

        incident = {

            "incident_id": str(uuid.uuid4())[:8],

            "agent": result.get("agent"),

            "tool": result.get("tool"),

            "task": task,

            "decision": result.get("decision"),

            "risk_score": risk_score,

            "severity": severity,

            "description": (
                f"{severity} risk detected: "
                f"{result.get('tool')} requested by "
                f"{result.get('agent')}"
            ),

            "status": "OPEN",

            "detected_at": datetime.now(
                timezone.utc
            ).isoformat()
        }

        return incident