from flask import Flask, request, jsonify
from flask_cors import CORS

from database.analytics import AnalyticsEngine

from agents.research_agent import ResearchAgent
from agents.finance_agent import FinanceAgent
from agents.admin_agent import AdminAgent

from security.security_gateway import SecurityGateway
from security.incident_detector import IncidentDetector

from database.audit_logger import (
    initialize_database,
    save_audit_log,
    get_audit_logs
)

from database.incident_logger import (
    initialize_incident_table,
    save_incident,
    get_incidents,
    update_incident_status
)


app = Flask(__name__)
CORS(app)


# ==========================================
# INITIALIZE AGENTS
# ==========================================

research_agent = ResearchAgent()
finance_agent = FinanceAgent()
admin_agent = AdminAgent()


# ==========================================
# AGENT REGISTRY
# ==========================================

AGENT_REGISTRY = {
    "Research Agent": research_agent,
    "Finance Agent": finance_agent,
    "Admin Agent": admin_agent
}


# ==========================================
# SECURITY COMPONENTS
# ==========================================

security_gateway = SecurityGateway()
incident_detector = IncidentDetector()
analytics_engine = AnalyticsEngine()


# ==========================================
# DATABASE INITIALIZATION
# ==========================================

initialize_database()
initialize_incident_table()


# ==========================================
# AUTOMATIC REQUEST CLASSIFIER
# ==========================================

def classify_request(task):
    task_lower = task.lower()

    finance_keywords = [
        "financial report",
        "finance report",
        "revenue",
        "expenses",
        "net profit",
        "profit and loss",
        "quarterly finance",
        "financial performance",
        "budget",
        "financial statement"
    ]

    admin_keywords = [
        "server status",
        "system status",
        "system monitoring",
        "cpu usage",
        "memory usage",
        "ram usage",
        "disk usage",
        "disk space",
        "storage usage",
        "system uptime",
        "uptime",
        "active agents",
        "security incidents",
        "audit logs",
        "system report",
        "server health",
        "system health",
        "operating system",
        "system information",
        "hardware information"
    ]

    if any(word in task_lower for word in finance_keywords):
        return {
            "agent": "Finance Agent",
            "reason": "Financial-related request detected."
        }

    if any(word in task_lower for word in admin_keywords):
        return {
            "agent": "Admin Agent",
            "reason": "System monitoring or administration request detected."
        }

    return {
        "agent": "Research Agent",
        "reason": "General research request detected."
    }
    # Check Finance requests

    if any(word in task_lower for word in finance_keywords):

        return {
            "agent": "Finance Agent",
            "reason": "Financial information request detected."
        }

    # Check Admin requests

    if any(word in task_lower for word in admin_keywords):

        return {
            "agent": "Admin Agent",
            "reason": "System monitoring or administration request detected."
        }

    # Default to Research Agent

    return {
        "agent": "Research Agent",
        "reason": "General public research request detected."
    }


# ==========================================
# COMMON TASK EXECUTION FUNCTION
# ==========================================

def execute_agent_task(task, agent_name):

    agent = AGENT_REGISTRY.get(agent_name)

    if agent is None:
        return None, 400

    # Agent creates a tool proposal

    plan = agent.plan_task(task)

    # Security Gateway validates and executes the tool

    result = security_gateway.execute(
        plan["agent"],
        plan["tool"],
        plan["arguments"]
    )

    # Save audit record

    save_audit_log(task, result)

    # Detect possible security incidents

    incident = incident_detector.detect_incident(
        task,
        result
    )

    if incident is not None:
        save_incident(incident)

    return {
        "task": task,
        "agent_plan": plan,
        "security_analysis": result,
        "incident": incident
    }, 200


# ==========================================
# HOME
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "project": "AI-SHIELD by OMEGA",
        "description": "AI Agent Security and Governance Platform",
        "status": "Running"
    })


# ==========================================
# HEALTH
# ==========================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy"
    })


# ==========================================
# AVAILABLE AGENTS
# ==========================================

@app.route("/agents", methods=["GET"])
def list_agents():

    return jsonify({
        "available_agents": list(AGENT_REGISTRY.keys())
    })


# ==========================================
# AUTOMATIC AGENT ROUTING
# ==========================================

@app.route("/command/execute", methods=["POST"])
def universal_command():

    data = request.get_json(silent=True) or {}

    task = data.get("task", "")

    if not isinstance(task, str) or not task.strip():

        return jsonify({
            "error": "Task cannot be empty."
        }), 400

    task = task.strip()

    # Automatically identify the appropriate agent

    routing = classify_request(task)

    selected_agent = routing["agent"]

    # Execute through the existing security pipeline

    response, status_code = execute_agent_task(
        task,
        selected_agent
    )

    if response is None:
        return jsonify({
            "error": "Unable to select an agent."
        }), status_code

    response["routing"] = routing

    return jsonify(response), status_code


# ==========================================
# MANUAL AGENT PLANNING
# ==========================================

@app.route("/agent/plan", methods=["POST"])
def plan_task():

    data = request.get_json(silent=True) or {}

    task = data.get("task", "")
    agent_name = data.get("agent", "Research Agent")

    if not isinstance(task, str) or not task.strip():

        return jsonify({
            "error": "Task cannot be empty."
        }), 400

    agent = AGENT_REGISTRY.get(agent_name)

    if agent is None:

        return jsonify({
            "error": "Unknown agent."
        }), 400

    plan = agent.plan_task(task)

    return jsonify(plan)


# ==========================================
# MANUAL AGENT EXECUTION
# ==========================================

@app.route("/agent/execute", methods=["POST"])
def execute_task():

    data = request.get_json(silent=True) or {}

    task = data.get("task", "")
    agent_name = data.get("agent", "Research Agent")

    if not isinstance(task, str) or not task.strip():

        return jsonify({
            "error": "Task cannot be empty."
        }), 400

    task = task.strip()

    if agent_name not in AGENT_REGISTRY:

        return jsonify({
            "error": "Unknown agent."
        }), 400

    response, status_code = execute_agent_task(
        task,
        agent_name
    )

    return jsonify(response), status_code


# ==========================================
# AUDIT LOGS
# ==========================================

@app.route("/audit/logs", methods=["GET"])
def audit_logs():

    return jsonify(get_audit_logs())


# ==========================================
# SECURITY INCIDENTS
# ==========================================

@app.route("/incidents", methods=["GET"])
def view_incidents():

    incidents = get_incidents()

    return jsonify({
        "total_incidents": len(incidents),
        "incidents": incidents
    })


# ==========================================
# UPDATE INCIDENT STATUS
# ==========================================

@app.route(
    "/incidents/<incident_id>/status",
    methods=["PUT"]
)
def change_incident_status(incident_id):

    data = request.get_json(silent=True) or {}

    new_status = data.get("status")

    allowed_statuses = [
        "OPEN",
        "INVESTIGATING",
        "RESOLVED"
    ]

    if new_status not in allowed_statuses:

        return jsonify({
            "error": "Invalid status.",
            "allowed_statuses": allowed_statuses
        }), 400

    updated = update_incident_status(
        incident_id,
        new_status
    )

    if not updated:

        return jsonify({
            "error": "Incident not found."
        }), 404

    return jsonify({
        "message": "Incident status updated successfully.",
        "incident_id": incident_id,
        "new_status": new_status
    })


# ==========================================
# RISK ANALYTICS
# ==========================================

@app.route("/analytics", methods=["GET"])
def view_analytics():

    analytics = analytics_engine.get_analytics()

    return jsonify(analytics)


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(debug=True, port=5000)