import { useEffect, useState } from "react";

import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RefreshCw
} from "lucide-react";

import { getAuditLogs } from "../services/api";


function ActivityFeed() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    let active = true;

    const loadLogs = async () => {

      try {

        const response = await getAuditLogs();

        if (active) {
          setLogs(response.data.slice(0, 8));
        }

      } catch (error) {

        console.error("Activity feed error:", error);

      } finally {

        if (active) {
          setLoading(false);
        }

      }

    };

    const initialFetch = setTimeout(loadLogs, 0);

    const interval = setInterval(loadLogs, 15000);

    return () => {

      active = false;

      clearTimeout(initialFetch);
      clearInterval(interval);

    };

  }, []);


  const formatTime = (timestamp) => {

    if (!timestamp) return "Unknown time";

    return new Date(timestamp).toLocaleString();

  };


  return (

    <section className="panel activity-panel">

      <div className="panel-heading">

        <div>

          <h3>Security Activity Stream</h3>

          <p>Recent agent execution events from audit logs</p>

        </div>

        <div className="activity-live">

          <span className="activity-pulse"></span>

          LIVE

        </div>

      </div>


      {loading ? (

        <p className="loading-text">
          Loading security activity...
        </p>

      ) : logs.length === 0 ? (

        <p className="loading-text">
          No activity recorded yet.
        </p>

      ) : (

        <div className="activity-list">

          {logs.map((log) => {

            const blocked = log.decision === "BLOCKED";

            const critical = log.severity === "CRITICAL";

            return (

              <div
                className="activity-item"
                key={log.id}
              >

                <div className={`activity-icon ${
                  blocked ? "blocked" : "allowed"
                }`}>

                  {blocked
                    ? <ShieldAlert size={19} />
                    : <ShieldCheck size={19} />
                  }

                </div>


                <div className="activity-details">

                  <strong>
                    {log.agent}
                  </strong>

                  <span>
                    {log.tool}
                  </span>

                  <small>
                    <Clock size={12} />
                    {formatTime(log.timestamp)}
                  </small>

                </div>


                <div className="activity-result">

                  <span className={
                    blocked ? "blocked-label" : "allowed-label"
                  }>

                    {log.decision}

                  </span>

                  <small className={
                    critical ? "critical-label" : "normal-label"
                  }>

                    {log.severity || "LOW"}

                  </small>

                </div>

              </div>

            );

          })}

        </div>

      )}

      <div className="activity-footer">

        <Activity size={14} />

        Automatically refreshed every 15 seconds

        <RefreshCw size={13} />

      </div>

    </section>

  );

}

export default ActivityFeed;