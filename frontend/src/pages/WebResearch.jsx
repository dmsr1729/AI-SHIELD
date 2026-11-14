import { useState } from "react";

import {
  Search,
  Globe,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  LoaderCircle,
  Activity,
  FileSearch,
  ArrowUpRight,
  Lock,
  Radio,
} from "lucide-react";

import { executeTask } from "../services/api";

function WebResearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const examples = [
    "Latest developments in artificial intelligence",
    "How does quantum computing work?",
    "Latest cybersecurity threats",
    "Climate change research and developments",
  ];

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      const result = await executeTask(
        "Research Agent",
        searchQuery
      );

      setResponse(result.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect to the AI-SHIELD backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const security = response?.security_analysis;
  const research = security?.result;
  const results = research?.results || [];
  const decision = security?.decision;

  const isBlocked = decision === "BLOCKED";
  const isSuccessful = research?.status === "SUCCESS";

  return (
    <div className="web-research-page">

      {/* HEADER */}

      <div className="research-heading">

        <div>
          <div className="research-eyebrow">
            <Radio size={14} />
            INTELLIGENCE MODULE
          </div>

          <h1>Web Research Center</h1>

          <p>
            Search public information through a monitored AI agent.
            Every tool request passes through the AI-SHIELD Security Gateway.
          </p>
        </div>

        <div className="research-live-status">
          <span className="live-dot"></span>
          LIVE WEB SEARCH
        </div>

      </div>


      {/* SEARCH CONSOLE */}

      <div className="research-search-panel">

        <div className="research-panel-heading">
          <div className="research-panel-icon">
            <Globe size={21} />
          </div>

          <div>
            <h3>Research Query</h3>
            <p>Enter a topic to retrieve public web results.</p>
          </div>
        </div>

        <div className="research-input-wrapper">

          <Search size={21} />

          <input
            type="text"
            placeholder="Search artificial intelligence, technology, science..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <Search size={18} />
            )}

            {loading ? "Searching..." : "Search"}
          </button>

        </div>

        <div className="research-suggestions">

          <span>QUICK SEARCH</span>

          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleSearch(example)}
              disabled={loading}
            >
              {example}
            </button>
          ))}

        </div>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="research-loading">

          <div className="research-loader">
            <Globe size={34} />
          </div>

          <h3>Searching the public web...</h3>

          <p>
            Research Agent is retrieving information through the
            AI-SHIELD Security Gateway.
          </p>

          <div className="research-loading-bar">
            <span></span>
          </div>

        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="research-error">
          <ShieldAlert size={22} />

          <div>
            <h3>Connection Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}


      {/* RESULTS */}

      {response && !loading && (

        <>

          {/* SECURITY OVERVIEW */}

          <div className="research-section-title">
            <div>
              <h2>Execution Overview</h2>
              <p>Security gateway analysis and research status.</p>
            </div>

            <span className="execution-id">
              ID: {security?.execution_id || "N/A"}
            </span>
          </div>


          <div className="research-overview-grid">

            <div className="research-stat-card">

              <div className="research-stat-top">
                <span>GATEWAY DECISION</span>
                <ShieldCheck size={20} />
              </div>

              <h2 className={isBlocked ? "text-danger" : "text-success"}>
                {decision || "UNKNOWN"}
              </h2>

              <p>Security permission verification</p>

            </div>


            <div className="research-stat-card">

              <div className="research-stat-top">
                <span>RISK LEVEL</span>
                <Activity size={20} />
              </div>

              <h2>
                {security?.risk_analysis?.severity || "N/A"}
              </h2>

              <p>
                Risk score:{" "}
                {security?.risk_analysis?.risk_score ?? "N/A"}
              </p>

            </div>


            <div className="research-stat-card">

              <div className="research-stat-top">
                <span>SEARCH RESULTS</span>
                <FileSearch size={20} />
              </div>

              <h2>{results.length}</h2>

              <p>Public web sources retrieved</p>

            </div>


            <div className="research-stat-card">

              <div className="research-stat-top">
                <span>EXECUTION STATUS</span>
                <Lock size={20} />
              </div>

              <h2 className={
                security?.executed ? "text-success" : "text-danger"
              }>
                {security?.executed ? "EXECUTED" : "BLOCKED"}
              </h2>

              <p>Tool execution verification</p>

            </div>

          </div>


          {/* BLOCKED REQUEST */}

          {isBlocked && (
            <div className="research-blocked">

              <ShieldAlert size={30} />

              <div>
                <h3>Request Blocked by AI-SHIELD</h3>

                <p>
                  {security?.reason ||
                    "The requested operation was not authorized."}
                </p>

                <span>
                  Unauthorized tool execution was prevented.
                </span>
              </div>

            </div>
          )}


          {/* SUCCESSFUL RESEARCH */}

          {isSuccessful && !isBlocked && (

            <>

              <div className="research-results-heading">

                <div>
                  <h2>Research Intelligence</h2>
                  <p>
                    Public information retrieved for:
                    <strong> {query}</strong>
                  </p>
                </div>

                <span className="source-badge">
                  <Globe size={14} />
                  LIVE WEB SOURCES
                </span>

              </div>


              <div className="research-results-grid">

                {results.map((item, index) => (

                  <article
                    className="research-result-card"
                    key={index}
                  >

                    <div className="result-card-top">

                      <div className="result-number">
                        SOURCE {String(index + 1).padStart(2, "0")}
                      </div>

                      <ArrowUpRight size={19} />

                    </div>


                    <h3>{item.title || "Untitled source"}</h3>

                    <p>
                      {item.description ||
                        "No description available for this source."}
                    </p>


                    <div className="result-card-footer">

                      <span>
                        <Globe size={14} />
                        Public Web
                      </span>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Source
                          <ExternalLink size={14} />
                        </a>
                      )}

                    </div>

                  </article>

                ))}

              </div>

              <div className="research-disclaimer">
                <ShieldCheck size={17} />

                <span>
                  Search results are retrieved from public web sources.
                  Always verify important information against the original source.
                </span>
              </div>

            </>

          )}


          {/* SEARCH FAILURE */}

          {decision !== "BLOCKED" &&
            research &&
            research.status !== "SUCCESS" && (

            <div className="research-error">

              <FileSearch size={24} />

              <div>
                <h3>Search Unavailable</h3>

                <p>
                  {research.message ||
                    "No results could be retrieved. Please try another query."}
                </p>
              </div>

            </div>

          )}

        </>

      )}


      {/* INITIAL STATE */}

      {!response && !loading && !error && (

        <div className="research-empty-state">

          <div className="empty-globe">
            <Globe size={46} />
          </div>

          <h2>Explore Public Intelligence</h2>

          <p>
            Submit a research query to see live web results,
            gateway decisions, and security analysis.
          </p>

          <div className="empty-security-note">
            <ShieldCheck size={16} />
            Every request is monitored by AI-SHIELD.
          </div>

        </div>

      )}

    </div>
  );
}

export default WebResearch;