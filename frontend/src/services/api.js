import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Backend API functions

export const getHealth = () =>
    API.get("/health");

export const getAgents = () =>
    API.get("/agents");

export const getAnalytics = () =>
    API.get("/analytics");

export const getAuditLogs = () =>
    API.get("/audit/logs");

export const getIncidents = () =>
    API.get("/incidents");

// Manual agent execution
export const executeTask = (agent, task) =>
    API.post("/agent/execute", {
        agent,
        task,
    });

// Universal command execution with automatic agent routing
export const executeCommand = (task) =>
    API.post("/command/execute", {
        task,
    });

export const updateIncidentStatus = (id, status) =>
    API.put(`/incidents/${id}/status`, {
        status,
    });

export default API;