import { useEffect, useState, useCallback } from "react";

import AuditLogs from "./pages/AuditLogs";
import Incidents from "./pages/Incidents";
import RiskAnalytics from "./pages/RiskAnalytics";
import Agents from "./pages/Agents";
import WebResearch from "./pages/WebResearch";
import CommandCenter from "./pages/CommandCenter";

import HolographicGlobe from "./components/HolographicGlobe";
import BackgroundFX from "./components/BackgroundFX";
import ActivityFeed from "./components/ActivityFeed";

import {
  Shield,
  LayoutDashboard,
  Activity,
  AlertTriangle,
  FileText,
  Bot,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Server,
  Search,
  Terminal,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import {
  getAnalytics,
  getHealth,
  getAgents,
} from "./services/api";

import "./App.css";


function App() {

  const [analytics, setAnalytics] = useState(null);
  const [agents, setAgents] = useState([]);

  const [activePage, setActivePage] = useState("overview");

  const [serverStatus, setServerStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // FETCH DASHBOARD DATA

  const fetchDashboardData = useCallback(async () => {

    try {

      const [
        analyticsResponse,
        healthResponse,
        agentsResponse
      ] = await Promise.all([
        getAnalytics(),
        getHealth(),
        getAgents(),
      ]);

      setAnalytics(analyticsResponse.data);

      setServerStatus(
        healthResponse.data.status === "healthy"
          ? "Online"
          : "Offline"
      );

      setAgents(
        agentsResponse.data.available_agents || []
      );

      setError("");

    } catch (err) {

      console.error("Dashboard error:", err);

      setServerStatus("Offline");

      setError(
        "Unable to connect to the AI-SHIELD backend."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  // AUTOMATIC DATA REFRESH

  useEffect(() => {

    const initialFetch = setTimeout(() => {
      fetchDashboardData();
    }, 0);

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);

    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };

  }, [fetchDashboardData]);


  // RISK CHART DATA

  const riskData = analytics
    ? [
        {
          name: "Critical",
          value: analytics.execution_risk_levels?.CRITICAL || 0,
          color: "#ff1744",
        },
        {
          name: "High",
          value: analytics.execution_risk_levels?.HIGH || 0,
          color: "#ff8a50",
        },
        {
          name: "Low",
          value: analytics.execution_risk_levels?.LOW || 0,
          color: "#b76e79",
        },
      ].filter((item) => item.value > 0)
    : [];


  // PAGE TITLES

  const pageTitles = {
    overview: "Security Overview",
    command: "Universal Command Center",
    research: "Web Research Console",
    analytics: "Risk Analytics",
    incidents: "Security Incidents",
    audit: "Audit Logs",
    agents: "AI Agent Management",
  };


  const pageDescriptions = {
    overview: "Monitor and manage your AI agent security.",
    command: "Execute general tasks through automatically routed and protected AI agents.",
    research: "Search public information through the protected security gateway.",
    analytics: "Analyze execution risks and security activity.",
    incidents: "Detect, investigate and manage security threats.",
    audit: "Review recorded agent executions and security decisions.",
    agents: "Monitor registered agents and their tool permissions.",
  };


  return (

    <div className="app-container">

      <BackgroundFX />


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            <Shield size={27} />
          </div>

          <div>
            <h2>AI-SHIELD</h2>
            <span>by OMEGA</span>
          </div>

        </div>


        <div className="menu-label">
          MAIN MENU
        </div>


        <nav className="navigation">

          <div
            className={`nav-item ${
              activePage === "overview" ? "active" : ""
            }`}
            onClick={() => setActivePage("overview")}
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "command" ? "active" : ""
            }`}
            onClick={() => setActivePage("command")}
          >
            <Terminal size={19} />
            <span>Command Center</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "research" ? "active" : ""
            }`}
            onClick={() => setActivePage("research")}
          >
            <Search size={19} />
            <span>Web Research</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "analytics" ? "active" : ""
            }`}
            onClick={() => setActivePage("analytics")}
          >
            <Activity size={19} />
            <span>Risk Analytics</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "incidents" ? "active" : ""
            }`}
            onClick={() => setActivePage("incidents")}
          >
            <AlertTriangle size={19} />
            <span>Incidents</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "audit" ? "active" : ""
            }`}
            onClick={() => setActivePage("audit")}
          >
            <FileText size={19} />
            <span>Audit Logs</span>
          </div>


          <div
            className={`nav-item ${
              activePage === "agents" ? "active" : ""
            }`}
            onClick={() => setActivePage("agents")}
          >
            <Bot size={19} />
            <span>AI Agents</span>
          </div>

        </nav>


        {/* SIDEBAR FOOTER */}

        <div className="sidebar-bottom">

          <div className="security-status">

            <ShieldCheck size={20} />

            <div>
              <strong>Security Active</strong>
              <span>Gateway protection enabled</span>
            </div>

          </div>

          <p>AI-SHIELD v1.0.0</p>

        </div>

      </aside>



      {/* MAIN CONTENT */}

      <main className="main-content">


        {/* TOP HEADER */}

        <header className="topbar">

          <div>

            <h1>
              {pageTitles[activePage]}
            </h1>

            <p>
              {pageDescriptions[activePage]}
            </p>

          </div>


          <div className="topbar-right">

            <div className="server-indicator">

              <span
                className={
                  serverStatus === "Online"
                    ? "status-dot online"
                    : "status-dot offline"
                }
              />

              Backend {serverStatus}

            </div>


            <button
              className="refresh-button"
              onClick={fetchDashboardData}
            >

              <RefreshCw size={17} />

              Refresh

            </button>

          </div>

        </header>


        {/* COMMAND CENTER PAGE */}

        {activePage === "command" && (
          <CommandCenter />
        )}


        {/* WEB RESEARCH PAGE */}

        {activePage === "research" && (
          <WebResearch />
        )}


        {/* INCIDENTS PAGE */}

        {activePage === "incidents" && (
          <Incidents />
        )}


        {/* AUDIT LOGS PAGE */}

        {activePage === "audit" && (
          <AuditLogs />
        )}


        {/* RISK ANALYTICS PAGE */}

        {activePage === "analytics" && (
          <RiskAnalytics />
        )}


        {/* AI AGENTS PAGE */}

        {activePage === "agents" && (
          <Agents />
        )}


        {/* OVERVIEW PAGE */}

        {activePage === "overview" && (

          <>

            {error && (

              <div className="error-message">

                <AlertTriangle size={18} />

                {error}

              </div>

            )}


            {/* WELCOME SECTION */}

            <section className="welcome-section">

              <div>

                <span className="welcome-tag">
                  AI SECURITY & GOVERNANCE PLATFORM
                </span>

                <h2>
                  Protecting your AI ecosystem.
                </h2>

                <p>
                  Real-time visibility into agent activity,
                  security risks and execution decisions.
                </p>

              </div>


              <div className="welcome-icon">

                <HolographicGlobe />

              </div>

            </section>


            {/* STATISTICS */}

            <section className="stats-grid">

              <StatCard
                title="Total Executions"
                value={analytics?.total_executions ?? "--"}
                icon={<Activity />}
                color="blue"
              />


              <StatCard
                title="Allowed Requests"
                value={analytics?.allowed_requests ?? "--"}
                icon={<ShieldCheck />}
                color="green"
              />


              <StatCard
                title="Blocked Requests"
                value={analytics?.blocked_requests ?? "--"}
                icon={<ShieldAlert />}
                color="red"
              />


              <StatCard
                title="Security Incidents"
                value={analytics?.total_incidents ?? "--"}
                icon={<AlertTriangle />}
                color="orange"
              />

            </section>


            {/* ANALYTICS SECTION */}

            <section className="content-grid">


              {/* EXECUTION RISK */}

              <div className="panel risk-panel">

                <div className="panel-heading">

                  <div>

                    <h3>Execution Risk Analysis</h3>

                    <p>
                      Distribution of security risk levels
                    </p>

                  </div>

                  <Activity size={21} />

                </div>


                {loading ? (

                  <p className="loading-text">
                    Loading analytics...
                  </p>

                ) : riskData.length > 0 ? (

                  <div className="chart-container">

                    <ResponsiveContainer
                      width="100%"
                      height={230}
                    >

                      <PieChart>

                        <Pie
                          data={riskData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={5}
                        >

                          {riskData.map((entry, index) => (

                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />

                          ))}

                        </Pie>


                        <Tooltip
                          contentStyle={{
                            background: "#160d13",
                            border: "1px solid #ff1744",
                            borderRadius: "10px",
                            color: "#ffffff",
                          }}
                        />

                      </PieChart>

                    </ResponsiveContainer>


                    <div className="chart-legend">

                      {riskData.map((item) => (

                        <div key={item.name}>

                          <span
                            className="legend-dot"
                            style={{
                              background: item.color
                            }}
                          />

                          <span>{item.name}</span>

                          <strong>{item.value}</strong>

                        </div>

                      ))}

                    </div>

                  </div>

                ) : (

                  <p className="loading-text">
                    No risk data available.
                  </p>

                )}

              </div>



              {/* INCIDENT STATUS */}

              <div className="panel incident-panel">

                <div className="panel-heading">

                  <div>

                    <h3>Incident Status</h3>

                    <p>
                      Current security incident overview
                    </p>

                  </div>

                  <AlertTriangle size={21} />

                </div>



                <div className="incident-total">

                  <strong>
                    {analytics?.total_incidents ?? "--"}
                  </strong>

                  <span>Total Incidents</span>

                </div>



                <div className="incident-status-row">


                  <div className="incident-status-card open-card">

                    <span>OPEN</span>

                    <strong>
                      {analytics?.incident_status?.OPEN || 0}
                    </strong>

                  </div>



                  <div className="incident-status-card investigating-card">

                    <span>INVESTIGATING</span>

                    <strong>
                      {analytics?.incident_status?.INVESTIGATING || 0}
                    </strong>

                  </div>



                  <div className="incident-status-card resolved-card">

                    <span>RESOLVED</span>

                    <strong>
                      {analytics?.incident_status?.RESOLVED || 0}
                    </strong>

                  </div>


                </div>

              </div>


            </section>



            {/* AGENT MONITORING */}

            <section className="panel agents-panel">

              <div className="panel-heading">

                <div>

                  <h3>AI Agent Monitoring</h3>

                  <p>
                    Registered agents in the security platform
                  </p>

                </div>

                <Bot size={21} />

              </div>



              <div className="agents-grid">

                {agents.map((agent) => (

                  <div
                    className="agent-card"
                    key={agent}
                  >

                    <div className="agent-icon">

                      <Bot size={23} />

                    </div>


                    <div className="agent-info">

                      <strong>{agent}</strong>

                      <span>Registered Agent</span>

                    </div>


                    <span className="agent-status">
                      Active
                    </span>

                  </div>

                ))}

              </div>

            </section>



            {/* SECURITY ACTIVITY FEED */}

            <ActivityFeed />


            {/* FOOTER */}

            <footer className="footer">

              <span>
                AI-SHIELD by OMEGA
              </span>

              <span>

                <Server size={14} />

                Security Gateway Monitoring System

              </span>

            </footer>

          </>

        )}

      </main>

    </div>

  );

}



// STATISTICS CARD COMPONENT

function StatCard({ title, value, icon, color }) {

  return (

    <div className="stat-card">

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>


      <div className="stat-info">

        <span>{title}</span>

        <strong>{value}</strong>

      </div>

    </div>

  );

}


export default App;