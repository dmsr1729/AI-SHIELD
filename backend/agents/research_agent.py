
class ResearchAgent:

    def __init__(self):
        self.name = "Research Agent"

    def plan_task(self, task):

        task_lower = task.lower()

        # Detect requests for confidential information
        sensitive_requests = [
            "password",
            "bank account",
            "confidential financial",
            "customer financial",
            "private transaction",
            "salary database"
        ]

        if any(word in task_lower for word in sensitive_requests):

            return {
                "agent": self.name,
                "task": task,
                "tool": "read_confidential_financial_data",
                "arguments": {
                    "query": task
                }
            }

        # Detect financial report requests
        financial_requests = [
            "financial report",
            "revenue report",
            "expenses report",
            "quarterly finance"
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

        # Normal research request
        return {
            "agent": self.name,
            "task": task,
            "tool": "search_public_knowledge",
            "arguments": {
                "query": task
            }
        }
