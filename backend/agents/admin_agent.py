
class AdminAgent:

    def __init__(self):
        self.name = "Admin Agent"

    def plan_task(self, task):

        task_lower = task.lower()

        # Detect restricted security information requests
        restricted_requests = [
            "user passwords",
            "database passwords",
            "secret keys",
            "api keys",
            "private credentials"
        ]

        if any(word in task_lower for word in restricted_requests):

            return {
                "agent": self.name,
                "task": task,
                "tool": "read_system_credentials",
                "arguments": {
                    "query": task
                }
            }

        # Normal system monitoring request
        return {
            "agent": self.name,
            "task": task,
            "tool": "view_system_reports",
            "arguments": {
                "query": task
            }
        }
