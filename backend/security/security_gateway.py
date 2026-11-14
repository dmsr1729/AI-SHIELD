import uuid
import re
import os
import time
import platform
import psutil
from ddgs.exceptions import DDGSException

from ddgs import DDGS
from security.risk_engine import RiskEngine


# Permissions assigned to each agent
AGENT_PERMISSIONS = {

    "Research Agent": [
        "search_public_knowledge"
    ],

    "Finance Agent": [
        "view_financial_reports"
    ],

    "Admin Agent": [
        "view_system_reports"
    ]
}


risk_engine = RiskEngine()


# REAL WEB SEARCH TOOL


def search_public_knowledge(arguments):

    query = arguments.get("query", "").strip()

    if not query:
        return {
            "status": "ERROR",
            "message": "Search query cannot be empty.",
            "results": []
        }

    # Remove unnecessary question words
    stop_words = {
        "what", "are", "is", "the", "a", "an",
        "can", "you", "please", "tell", "me",
        "about", "explain", "how", "does", "do",
        "i", "want", "to", "know", "find",
        "search", "for", "give", "show"
    }

    words = re.findall(r"\b[\w'-]+\b", query.lower())

    keywords = [
        word for word in words
        if word not in stop_words
    ]

    simplified_query = " ".join(keywords)

    # Try different query formats
    search_queries = list(dict.fromkeys([
        query,
        simplified_query
    ]))

    for search_query in search_queries:

        try:

            with DDGS() as ddgs:

                search_results = ddgs.text(
                    search_query,
                    max_results=6
                )

                results = []

                for item in search_results:

                    results.append({
                        "title": item.get("title", ""),
                        "url": item.get("href", ""),
                        "description": item.get("body", "")
                    })

                if results:

                    return {
                        "status": "SUCCESS",
                        "query": query,
                        "search_query": search_query,
                        "total_results": len(results),
                        "results": results,
                        "source": "Live Web Search"
                    }

        except DDGSException:
            continue

        except Exception:
            continue

    return {
        "status": "ERROR",
        "message": "Unable to retrieve web search results.",
        "results": []
    }
# FINANCE TOOL
def view_financial_reports(arguments):

    return {
        "report": "Quarterly Financial Report",
        "period": "Q3 Demo",
        "revenue": 1250000,
        "expenses": 830000,
        "net_profit": 420000,
        "data_type": "Synthetic demonstration data"
    }


# ADMIN TOOL
def view_system_reports(arguments):
    try:
        # CPU monitoring
        cpu_usage = psutil.cpu_percent(interval=1)
        cpu_cores = psutil.cpu_count(logical=True)

        # RAM monitoring
        memory = psutil.virtual_memory()

        # Disk monitoring
        disk = psutil.disk_usage(os.path.abspath(os.sep))

        # System uptime
        uptime_seconds = time.time() - psutil.boot_time()
        uptime_hours = round(uptime_seconds / 3600, 2)

        return {
            "report": "Live System Monitoring Report",
            "server_status": "ONLINE",

            "hostname": platform.node(),
            "operating_system": (
                f"{platform.system()} {platform.release()}"
            ),

            "cpu_usage_percent": cpu_usage,
            "cpu_logical_cores": cpu_cores,

            "memory_total_gb": round(memory.total / (1024 ** 3), 2),
            "memory_used_gb": round(memory.used / (1024 ** 3), 2),
            "memory_available_gb": round(memory.available / (1024 ** 3), 2),
            "memory_usage_percent": memory.percent,

            "disk_total_gb": round(disk.total / (1024 ** 3), 2),
            "disk_used_gb": round(disk.used / (1024 ** 3), 2),
            "disk_free_gb": round(disk.free / (1024 ** 3), 2),
            "disk_usage_percent": disk.percent,

            "system_uptime_hours": uptime_hours,

            "monitoring_scope": "Machine running the AI-SHIELD backend",
            "data_type": "Live system metrics"
        }

    except Exception as error:
        return {
            "status": "ERROR",
            "message": str(error)
        }

# AVAILABLE TOOLS
AVAILABLE_TOOLS = {

    "search_public_knowledge": search_public_knowledge,

    "view_financial_reports": view_financial_reports,

    "view_system_reports": view_system_reports
}


class SecurityGateway:

    def execute(self, agent_name, tool_name, arguments):

        execution_id = str(uuid.uuid4())[:8]

        # STEP 1: CHECK PERMISSIONS
        permitted_tools = AGENT_PERMISSIONS.get(
            agent_name, []
        )

        if tool_name not in permitted_tools:

            return self.create_response(
                execution_id,
                agent_name,
                tool_name,
                "BLOCKED",
                "Agent does not have permission.",
                False
            )

        # STEP 2: CHECK TOOL AVAILABILITY
        tool_function = AVAILABLE_TOOLS.get(tool_name)

        if tool_function is None:

            return self.create_response(
                execution_id,
                agent_name,
                tool_name,
                "BLOCKED",
                "Tool is not available.",
                False
            )

        # STEP 3: EXECUTE AUTHORIZED TOOL
        result = tool_function(arguments)

        response = self.create_response(
            execution_id,
            agent_name,
            tool_name,
            "ALLOWED",
            "Permission verified.",
            True
        )

        response["result"] = result

        return response

    # GENERATE SECURITY RESPONSE
    def create_response(
        self,
        execution_id,
        agent_name,
        tool_name,
        decision,
        reason,
        executed
    ):

        risk = risk_engine.calculate_risk(
            agent_name,
            tool_name,
            decision
        )

        return {
            "execution_id": execution_id,
            "agent": agent_name,
            "tool": tool_name,
            "decision": decision,
            "reason": reason,
            "executed": executed,
            "risk_analysis": risk
        }