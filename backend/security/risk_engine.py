
class RiskEngine:

    def calculate_risk(self, agent, tool, decision):

        risk_score = 0
        severity = "LOW"

        # Unauthorized access
        if decision == "BLOCKED":
            risk_score = 75
            severity = "HIGH"

        # Sensitive information requests
        if any(word in tool.lower() for word in [
            "password",
            "credential",
            "private",
            "confidential"
        ]):
            risk_score = 95
            severity = "CRITICAL"

        # Authorized financial access
        elif decision == "ALLOWED" and "financial" in tool.lower():
            risk_score = 10
            severity = "LOW"

        # Authorized public research
        elif decision == "ALLOWED" and "public" in tool.lower():
            risk_score = 0
            severity = "LOW"

        return {
            "risk_score": risk_score,
            "severity": severity
        }
