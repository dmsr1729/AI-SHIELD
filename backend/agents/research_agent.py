import re


class ResearchAgent:

    def __init__(self):
        self.name = "Research Agent"

    def is_restricted_request(self, task):

        task_lower = task.lower().strip()

        # Actions that indicate an attempt to access protected information
        restricted_actions = [
            r"\b(access|retrieve|extract|steal|dump|export)\b",
            r"\b(reveal|expose|disclose|obtain)\b",
            r"\b(show|give|send|list|fetch|download)\b",
            r"\b(bypass|break into|hack into|crack)\b",
            r"\b(read|copy|leak)\b"
        ]

        # Protected information and resources
        sensitive_targets = [
            r"\b(passwords?|credentials?)\b",
            r"\b(password|credential)\s+database\b",
            r"\b(api keys?|secret keys?|access tokens?)\b",
            r"\b(bank account details?|banking credentials?)\b",
            r"\b(confidential financial data)\b",
            r"\b(customer financial records?)\b",
            r"\b(private transactions?)\b",
            r"\b(salary database|employee salary records?)\b",
            r"\b(administrator credentials?|admin passwords?)\b"
        ]

        # Explicit attempts to bypass security restrictions
        bypass_patterns = [
            r"\b(ignore|disable|remove)\b.{0,50}\b(security|safety|restrictions?|permissions?)\b",
            r"\b(bypass|override|disable)\b.{0,50}\b(authentication|authorization|security)\b"
        ]

        action_found = any(
            re.search(pattern, task_lower)
            for pattern in restricted_actions
        )

        target_found = any(
            re.search(pattern, task_lower)
            for pattern in sensitive_targets
        )

        bypass_found = any(
            re.search(pattern, task_lower)
            for pattern in bypass_patterns
        )

        return (action_found and target_found) or bypass_found

    def plan_task(self, task):

        task_lower = task.lower()

        # Check the complete request for restricted intent
        if self.is_restricted_request(task):

            return {
                "agent": self.name,
                "task": task,
                "tool": "read_confidential_financial_data",
                "arguments": {
                    "query": task
                }
            }

        # Detect legitimate financial report requests
        financial_requests = [
            "financial report",
            "revenue report",
            "expenses report",
            "quarterly finance",
            "financial performance",
            "profit and loss"
        ]

        if any(word in task_lower for word in financial_requests):

            return {
                "agent": self.name,
                "task": task,
                "tool": "view_financial_reports",
                "arguments": {
                    "query": task
                }
            }

        # Normal educational and public research requests
        return {
            "agent": self.name,
            "task": task,
            "tool": "search_public_knowledge",
            "arguments": {
                "query": task
            }
        }