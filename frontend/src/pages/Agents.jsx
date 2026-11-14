import { useCallback, useEffect, useState } from "react";

import {
  Search,
  Wallet,
  Settings,
  ShieldCheck,
  RefreshCw,
  Lock,
  Activity,
} from "lucide-react";

import { getAgents } from "../services/api";

const agentDetails = {
  "Research Agent": {
    description: "Handles public knowledge research and information retrieval.",
    tool: "search_public_knowledge",
    icon: Search,
    category: "RESEARCH",
    color: "#38bdf8",
  },

  "Finance Agent": {
    description: "Accesses authorized financial reporting tools.",
    tool: "view_financial_reports",
    icon: Wallet,
    category: "FINANCE",
    color: "#f59e0b",
  },

  "Admin Agent": {
    description: "Accesses authorized system monitoring and reporting tools.",
    tool: "view_system_reports",
    icon: Settings,
    category: "ADMINISTRATION",
    color: "#c084fc",
  },
};

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAgents = useCallback(async () => {
    try {
      setError("");

      const response = await getAgents();

      setAgents(response.data.available_agents || []);
    } catch (err) {
      console.error("Agent loading failed:", err);
      setError("Unable to load registered agents.");
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
    return (
      <div className="agents-loading">
        Loading registered AI agents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="agents-error">
        {error}

        <button onClick={loadAgents}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="agents-page">

      {/* HEADER */}

      <div className="agents-heading">
        <div>
          <h2>AI Agents Management</h2>

          <p>
            Monitor registered agents and their security permissions.
          </p>
        </div>

        <button
          className="agents-refresh"
          onClick={loadAgents}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}

      <div className="agents-summary">

        <div className="agents-summary-card">
          <Activity />
          <span>Registered Agents</span>
          <h2>{agents.length}</h2>
        </div>

        <div className="agents-summary-card">
          <ShieldCheck />
          <span>Permission Controlled</span>
          <h2>{agents.length}</h2>
        </div>

        <div className="agents-summary-card">
          <Lock />
          <span>Gateway Protection</span>
          <h2>ACTIVE</h2>
        </div>

      </div>

      {/* AGENT CARDS */}

      <div className="agents-section-heading">
        <h3>Registered Agents</h3>

        <span>
          {agents.length} AGENTS FOUND
        </span>
      </div>

      <div className="agents-grid">

        {agents.map((agent) => {

          const details = agentDetails[agent];

          if (!details) return null;

          const Icon = details.icon;

          return (
            <div className="agent-card" key={agent}>

              <div className="agent-card-top">

                <div
                  className="agent-icon"
                  style={{
                    color: details.color,
                    borderColor: `${details.color}55`,
                    background: `${details.color}15`,
                  }}
                >
                  <Icon size={25} />
                </div>

                <span className="agent-registered">
                  <span></span>
                  REGISTERED
                </span>

              </div>

              <div className="agent-information">

                <span className="agent-category">
                  {details.category}
                </span>

                <h3>{agent}</h3>

                <p>{details.description}</p>

              </div>

              <div className="agent-permission">

                <div className="permission-heading">
                  <ShieldCheck size={16} />
                  Authorized Tool
                </div>

                <div className="permission-tool">
                  {details.tool}
                </div>

              </div>

              <div className="agent-security">

                <Lock size={15} />

                <span>
                  Tool access controlled by Security Gateway
                </span>

              </div>

            </div>
          );
        })}

      </div>

      {/* SECURITY INFORMATION */}

      <div className="agents-security-panel">

        <div className="security-panel-icon">
          <ShieldCheck size={25} />
        </div>

        <div>
          <h3>Security Gateway Protection</h3>

          <p>
            Every agent tool request must pass through the
            AI-SHIELD Security Gateway. Unauthorized tool
            requests are blocked and recorded in the audit logs.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Agents;