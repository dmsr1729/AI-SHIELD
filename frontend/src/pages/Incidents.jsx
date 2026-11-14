import { useCallback, useEffect, useState } from "react";

import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  RefreshCw,
  CheckCircle,
  Search,
} from "lucide-react";

import {
  getIncidents,
  updateIncidentStatus,
} from "../services/api";


function Incidents() {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");


  // LOAD INCIDENTS

  const loadIncidents = useCallback(async () => {

    try {

      const response = await getIncidents();

      setIncidents(response.data.incidents || []);
      setError("");

    } catch (err) {

      console.error("Incident loading error:", err);

      setError("Unable to load security incidents.");

    } finally {

      setLoading(false);

    }

  }, []);


  // INITIAL LOAD AND AUTOMATIC REFRESH

  useEffect(() => {

    const timer = setTimeout(loadIncidents, 0);

    const interval = setInterval(loadIncidents, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };

  }, [loadIncidents]);


  // UPDATE INCIDENT STATUS

  const changeStatus = async (incidentId, status) => {

    try {

      setUpdating(incidentId);
      setError("");

      await updateIncidentStatus(incidentId, status);

      await loadIncidents();

    } catch (err) {

      console.error("Status update error:", err);

      setError("Unable to update incident status.");

    } finally {

      setUpdating(null);

    }

  };


  // FORMAT DATE

  const formatDate = (timestamp) => {

    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleDateString();

  };


  // FORMAT TIME

  const formatTime = (timestamp) => {

    if (!timestamp) return "Unknown";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleTimeString();

  };


  // SEARCH INCIDENTS

  const filteredIncidents = incidents.filter((incident) => {

    const text = [
      incident.incident_id,
      incident.agent,
      incident.tool,
      incident.severity,
      incident.status,
      incident.description,
    ].join(" ").toLowerCase();

    return text.includes(search.toLowerCase());

  });


  // SUMMARY COUNTS

  const criticalCount = incidents.filter(
    (item) => item.severity === "CRITICAL"
  ).length;

  const openCount = incidents.filter(
    (item) => item.status === "OPEN"
  ).length;

  const resolvedCount = incidents.filter(
    (item) => item.status === "RESOLVED"
  ).length;


  return (

    <div className="incidents-page">

      {/* PAGE HEADER */}

      <div className="page-title">

        <div>

          <span className="page-eyebrow">
            SECURITY OPERATIONS
          </span>

          <h1>Security Incidents</h1>

          <p>
            Detect, investigate and manage security threats.
          </p>

        </div>

        <button
          className="refresh-button"
          onClick={loadIncidents}
          disabled={loading}
        >

          <RefreshCw size={17} />
          Refresh

        </button>

      </div>


      {/* ERROR MESSAGE */}

      {error && (

        <div className="error-message">

          <AlertTriangle size={18} />

          {error}

        </div>

      )}


      {/* SUMMARY CARDS */}

      <div className="incident-stats">

        <div className="incident-stat-card">

          <AlertTriangle />

          <span>Total Incidents</span>

          <strong>{incidents.length}</strong>

        </div>


        <div className="incident-stat-card critical-stat">

          <ShieldAlert />

          <span>Critical Threats</span>

          <strong>{criticalCount}</strong>

        </div>


        <div className="incident-stat-card open-stat">

          <Clock />

          <span>Open Incidents</span>

          <strong>{openCount}</strong>

        </div>


        <div className="incident-stat-card resolved-stat">

          <CheckCircle />

          <span>Resolved</span>

          <strong>{resolvedCount}</strong>

        </div>

      </div>


      {/* SEARCH */}

      <div className="incident-search">

        <Search size={19} />

        <input
          type="text"
          placeholder="Search incident ID, agents or tools..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

      </div>


      {/* THREAT DETECTION TABLE */}

      <section className="panel incident-management-panel">

        <div className="panel-heading">

          <div>

            <h3>Threat Detection Records</h3>

            <p>
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </p>

          </div>

          <ShieldAlert />

        </div>


        {loading ? (

          <p className="loading-text">
            Loading security incidents...
          </p>

        ) : filteredIncidents.length === 0 ? (

          <div className="empty-incidents">

            <CheckCircle size={40} />

            <h3>No incidents found</h3>

            <p>
              No records match your search.
            </p>

          </div>

        ) : (

          <div className="incident-table-wrapper">

            <table className="incident-table">

              <thead>

                <tr>

                  <th>INCIDENT ID</th>

                  <th>AGENT</th>

                  <th>REQUESTED TOOL</th>

                  <th>RISK SCORE</th>

                  <th>SEVERITY</th>

                  <th>STATUS</th>

                  <th>DETECTED AT</th>

                  <th>ACTION</th>

                </tr>

              </thead>


              <tbody>

                {filteredIncidents.map((incident) => (

                  <tr key={incident.incident_id}>

                    {/* INCIDENT ID */}

                    <td className="incident-id">

                      <span>
                        {incident.incident_id}
                      </span>

                    </td>


                    {/* AGENT */}

                    <td className="incident-agent">

                      {incident.agent || "Unknown"}

                    </td>


                    {/* TOOL */}

                    <td className="incident-tool">

                      <span>
                        {incident.tool || "Unknown"}
                      </span>

                      {incident.description && (

                        <small>
                          {incident.description}
                        </small>

                      )}

                    </td>


                    {/* RISK SCORE */}

                    <td>

                      <span className="incident-risk-score">

                        {incident.risk_score ?? 0}

                        <small>/100</small>

                      </span>

                    </td>


                    {/* SEVERITY */}

                    <td>

                      <span
                        className={`severity-badge ${
                          (incident.severity || "LOW").toLowerCase()
                        }`}
                      >

                        {incident.severity || "LOW"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`incident-status-badge ${
                          (incident.status || "OPEN").toLowerCase()
                        }`}
                      >

                        {incident.status || "OPEN"}

                      </span>

                    </td>


                    {/* DETECTED TIME */}

                    <td>

                      <div className="incident-table-time">

                        <Clock size={13} />

                        <div>

                          <span>
                            {formatDate(incident.detected_at)}
                          </span>

                          <small>
                            {formatTime(incident.detected_at)}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="incident-table-actions">

                        {incident.status === "OPEN" && (

                          <button
                            className="investigate-button"
                            disabled={updating === incident.incident_id}
                            onClick={() => changeStatus(
                              incident.incident_id,
                              "INVESTIGATING"
                            )}
                          >

                            {updating === incident.incident_id
                              ? "Updating..."
                              : "Investigate"}

                          </button>

                        )}


                        {incident.status === "INVESTIGATING" && (

                          <button
                            className="resolve-button"
                            disabled={updating === incident.incident_id}
                            onClick={() => changeStatus(
                              incident.incident_id,
                              "RESOLVED"
                            )}
                          >

                            <CheckCircle size={14} />

                            {updating === incident.incident_id
                              ? "Updating..."
                              : "Resolve"}

                          </button>

                        )}


                        {incident.status === "RESOLVED" && (

                          <span className="resolved-label">

                            <CheckCircle size={15} />

                            Resolved

                          </span>

                        )}

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


export default Incidents;