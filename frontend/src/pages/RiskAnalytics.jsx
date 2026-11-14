import { useCallback, useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { getAnalytics } from "../services/api";

function RiskAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setError("");

      const response = await getAnalytics();

      setAnalytics(response.data);
    } catch (err) {
      console.error("Analytics loading failed:", err);
      setError("Unable to load risk analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadAnalytics, 0);

    const interval = setInterval(loadAnalytics, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loadAnalytics]);

  if (loading) {
    return <div className="risk-loading">Loading risk analytics...</div>;
  }

  if (error) {
    return (
      <div className="risk-error">
        {error}
        <button onClick={loadAnalytics}>Retry</button>
      </div>
    );
  }

  if (!analytics) return null;

  const executionRisks = analytics.execution_risk_levels || {};
  const incidentRisks = analytics.incident_risk_levels || {};
  const agentActivity = analytics.agent_activity || {};

  const riskData = [
    { name: "LOW", value: executionRisks.LOW || 0 },
    { name: "HIGH", value: executionRisks.HIGH || 0 },
    { name: "CRITICAL", value: executionRisks.CRITICAL || 0 },
  ];

  const incidentData = [
    { name: "LOW", value: incidentRisks.LOW || 0 },
    { name: "HIGH", value: incidentRisks.HIGH || 0 },
    { name: "CRITICAL", value: incidentRisks.CRITICAL || 0 },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="risk-page">
      <div className="risk-heading">
        <div>
          <h2>Risk Analytics</h2>
          <p>Security risk monitoring and execution analysis</p>
        </div>

        <button className="risk-refresh" onClick={loadAnalytics}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="risk-summary-grid">
        <div className="risk-summary-card">
          <Activity />
          <span>Total Executions</span>
          <h2>{analytics.total_executions || 0}</h2>
        </div>

        <div className="risk-summary-card">
          <ShieldCheck />
          <span>Allowed Requests</span>
          <h2>{analytics.allowed_requests || 0}</h2>
        </div>

        <div className="risk-summary-card">
          <ShieldAlert />
          <span>Blocked Requests</span>
          <h2>{analytics.blocked_requests || 0}</h2>
        </div>

        <div className="risk-summary-card">
          <AlertTriangle />
          <span>Total Incidents</span>
          <h2>{analytics.total_incidents || 0}</h2>
        </div>
      </div>

      <div className="risk-chart-grid">
        <div className="risk-chart-card">
          <h3>Execution Risk Distribution</h3>
          <p>Risk levels across all tool executions</p>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {riskData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="risk-chart-card">
          <h3>Incident Risk Distribution</h3>
          <p>Risk levels associated with detected incidents</p>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={incidentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {incidentData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="risk-chart-card risk-agent-card">
        <h3>Agent Activity</h3>
        <p>Execution activity recorded for each AI agent</p>

        {Object.keys(agentActivity).length === 0 ? (
          <p>No agent activity available.</p>
        ) : (
          Object.entries(agentActivity).map(([agent, count]) => (
            <div className="risk-agent-row" key={agent}>
              <span>{agent}</span>
              <strong>{count}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RiskAnalytics;