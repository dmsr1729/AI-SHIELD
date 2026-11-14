import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  Lock,
  Wrench,
  Activity,
} from "lucide-react";

import { getAgents } from "../services/api";

function AIAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAgents = useCallback(async () => {
    try {
      setError("");

      const response = await getAgents();

      const data = response.data;

      // Support either a direct array or an object containing agents.
      const agentList = Array.isArray(data)
        ? data
        : data.agents || [];

      setAgents(agentList);
    } catch (err) {
      console.error("Failed to load agents:", err);
      setError("Unable to load AI agents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadAgents, 0);
    const interval = setInterval(loadAgents, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [loadAgents]);

  if (loading) {
    return <div className="agents-loading">Loading AI agents...</div>;
  }

  if (error) {
    return (
      <div className="agents-error">
        <p>{error}</p>
        <button onClick={loadAgents}>Retry</button>
      </div>
    );
  }

  return (
    <div className="agents-page">
      <div className="agents-heading">
        <div>
          <h2>AI Agent Management</h2>
          <p>Monitor agent identities, permissions and tool access.</p>
        </div>

        <button className="agents-refresh" onClick={loadAgents}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="agents-overview">
        <div className="agents-overview-card">
          <Bot size={22} />
          <span>Total Agents</span>
          <h2>{agents.length}</h2>
        </div>

        <div className="agents-overview-card">
          <ShieldCheck size={22} />
          <span>Registered Agents</span>
          <h2>{agents.length}</h2>
        </div>

        <div className="agents-overview-card">
          <Activity size={22} />
          <span>Access Control</span>
          <h2>ACTIVE</h2>
        </div>
      </div>

      <div className="agents-grid">
        {agents.length === 0 ? (
          <div className="agents-empty">
            No registered agents found.
          </div>
        ) : (
          agents.map((agent, index) => {
            const name =
              typeof agent === "string"
                ? agent
                : agent.name || agent.agent || `Agent ${index + 1}`;

            const permissions =
              typeof agent === "object"
                ? agent.permissions || agent.tools || []
                : [];

            return (
              <div className="agent-card" key={name}>
                <div className="agent-card-header">
                  <div className="agent-icon">
                    <Bot size={25} />
                  </div>

                  <span className="agent-status">
                    <span className="status-dot"></span>
                    REGISTERED
                  </span>
                </div>

                <h3>{name}</h3>

                <p className="agent-description">
                  AI agent registered with AI-SHIELD security gateway.
                </p>

                <div className="agent-divider"></div>

                <div className="agent-permission-heading">
                  <Lock size={15} />
                  <span>AUTHORIZED TOOLS</span>
                </div>

                {permissions.length > 0 ? (
                  <div className="agent-tools">
                    {permissions.map((tool) => (
                      <div className="agent-tool" key={tool}>
                        <Wrench size={13} />
                        {tool}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="agent-no-tools">
                    Permission details are not provided by the API.
                  </p>
                )}

                <div className="agent-security-footer">
                  <ShieldAlert size={15} />
                  <span>Requests monitored by Security Gateway</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AIAgents;