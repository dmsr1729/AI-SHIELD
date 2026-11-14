class FinanceAgent:

    def __init__(self):
        self.name = "Finance Agent"

    def plan_task(self, task):

        task_lower = task.lower()

        # Detect requests for restricted customer information
        restricted_requests = [
            "password",
            "customer account number",
            "bank account number",
            "private transaction",
            "personal financial data"
        ]

        if any(word in task_lower for word in restricted_requests):

            return {
                "agent": self.name,
                "task": task,
                "tool": "read_customer_private_data",
                "arguments": {
                    "query": task
                }
            }

        # Normal financial report request
        return {
            "agent": self.name,
            "task": task,
            "tool": "view_financial_reports",
            "arguments": {
                "query": task
            }
        }
