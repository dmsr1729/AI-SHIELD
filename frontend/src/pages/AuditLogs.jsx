import { useCallback, useEffect, useState } from "react";

import {
  FileText,
  Search,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Clock,
} from "lucide-react";

import { getAuditLogs } from "../services/api";


function AuditLogs() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");


  // LOAD AUDIT LOGS

  const loadLogs = useCallback(async () => {

    try {

      const response = await getAuditLogs();

      setLogs(response.data || []);
      setError("");

    } catch (err) {

      console.error("Audit logs error:", err);

      setError("Unable to load audit logs.");

    } finally {

      setLoading(false);

    }

  }, []);


  // INITIAL LOAD

  useEffect(() => {

    const timer = setTimeout(loadLogs, 0);

    const interval = setInterval(loadLogs, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };

  }, [loadLogs]);


  // FORMAT DATE AND TIME

  const formatDate = (timestamp) => {

    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleDateString();

  };


  const formatTime = (timestamp) => {

    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleTimeString();

  };


  // SEARCH AND FILTER

  const filteredLogs = logs.filter((log) => {

    const searchText = [
      log.id,
      log.agent,
      log.tool,
      log.decision,
      log.severity,
      log.task,
    ].join(" ").toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesFilter =
      filter === "ALL" || log.decision === filter;

    return matchesSearch && matchesFilter;

  });


  // SUMMARY COUNTS

  const allowedCount = logs.filter(
    (log) => log.decision === "ALLOWED"
  ).length;

  const blockedCount = logs.filter(
    (log) => log.decision === "BLOCKED"
  ).length;


  return (

    <div className="audit-page">

      {/* PAGE HEADER */}

      <div className="page-title">

        <div>

          <span className="page-eyebrow">
            SECURITY MONITORING
          </span>

          <h1>Audit Logs</h1>

          <p>
            Complete execution history of AI agents and security decisions.
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadLogs}
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* SUMMARY CARDS */}

      <div className="audit-stats">

        <div className="audit-stat-card">

          <FileText />

          <span>Total Executions</span>

          <strong>{logs.length}</strong>

        </div>


        <div className="audit-stat-card">

          <ShieldCheck />

          <span>Allowed Requests</span>

          <strong className="allowed-text">
            {allowedCount}
          </strong>

        </div>


        <div className="audit-stat-card">

          <ShieldAlert />

          <span>Blocked Requests</span>

          <strong className="blocked-text">
            {blockedCount}
          </strong>

        </div>

      </div>


      {/* SEARCH AND FILTER */}

      <div className="audit-toolbar">

        <div className="audit-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search agents, tools or tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

        </div>


        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >

          <option value="ALL">All Decisions</option>

          <option value="ALLOWED">Allowed</option>

          <option value="BLOCKED">Blocked</option>

        </select>

      </div>


      {/* EXECUTION HISTORY TABLE */}

      <section className="panel audit-panel">

        <div className="panel-heading">

          <div>

            <h3>Execution History</h3>

            <p>
              Showing {filteredLogs.length} of {logs.length} records
            </p>

          </div>

          <FileText />

        </div>


        {loading ? (

          <p className="loading-text">
            Loading audit records...
          </p>

        ) : filteredLogs.length === 0 ? (

          <div className="audit-empty">

            <FileText size={38} />

            <h3>No audit records found</h3>

            <p>Try changing your search or filter.</p>

          </div>

        ) : (

          <div className="audit-table-wrapper">

            <table className="audit-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>AGENT</th>
                  <th>REQUESTED TOOL</th>
                  <th>DECISION</th>
                  <th>RISK SCORE</th>
                  <th>SEVERITY</th>
                  <th>DATE & TIME</th>
                </tr>

              </thead>


              <tbody>

                {filteredLogs.map((log) => (

                  <tr key={log.id}>

                    <td className="audit-id">
                      #{log.id}
                    </td>


                    <td className="audit-agent">
                      {log.agent || "Unknown"}
                    </td>


                    <td className="audit-tool">
                      {log.tool || "Unknown"}
                    </td>


                    <td>

                      <span
                        className={`audit-badge ${
                          log.decision === "BLOCKED"
                            ? "blocked"
                            : "allowed"
                        }`}
                      >

                        {log.decision}

                      </span>

                    </td>


                    <td>

                      <span className="audit-risk-score">

                        {log.risk_score ?? 0}

                        <span>/100</span>

                      </span>

                    </td>


                    <td>

                      <span
                        className={`severity-badge ${
                          (log.severity || "LOW").toLowerCase()
                        }`}
                      >

                        {log.severity || "LOW"}

                      </span>

                    </td>


                    <td>

                      <div className="audit-time">

                        <Clock size={14} />

                        <div>

                          <span>
                            {formatDate(log.timestamp)}
                          </span>

                          <small>
                            {formatTime(log.timestamp)}
                          </small>

                        </div>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>

  );

}


export default AuditLogs;