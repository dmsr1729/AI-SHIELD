import { useState } from "react";

import {
    Terminal,
    Send,
    ShieldCheck,
    ShieldAlert,
    Activity,
    BrainCircuit,
    Search,
    Wallet,
    Server,
    LoaderCircle,
    ExternalLink,
    Zap,
    Cpu,
    HardDrive,
    Clock,
    Monitor,
    MemoryStick,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { executeCommand } from "../services/api";


function CommandCenter() {

    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(null);


    // Suggested commands

    const suggestions = [
        "Explain the latest developments in artificial intelligence",
        "Show me the quarterly financial report",
        "Show me the current CPU and memory usage",
        "Show me the current disk usage",
        "Explain how AI agents work",
    ];


    // Execute command

    const handleExecute = async (e) => {

        e.preventDefault();

        if (!task.trim()) {
            setError("Please enter a task.");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setResponse(null);

            const result = await executeCommand(task.trim());

            setResponse(result.data);

        } catch (err) {

            console.error("Command execution failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to execute the command. Check your backend connection."
            );

        } finally {

            setLoading(false);

        }
    };


    // Response information

    const security = response?.security_analysis;
    const result = security?.result;
    const risk = security?.risk_analysis;

    const agent = response?.routing?.agent || security?.agent;


    // Agent icon

    const getAgentIcon = () => {

        if (agent === "Finance Agent") {
            return <Wallet size={20} />;
        }

        if (agent === "Admin Agent") {
            return <Server size={20} />;
        }

        return <Search size={20} />;
    };


    // Agent color

    const getAgentColor = () => {

        if (agent === "Finance Agent") return "finance";

        if (agent === "Admin Agent") return "admin";

        return "research";
    };


    // Safe metric formatting

    const formatMetric = (value) => {

        return value !== undefined && value !== null
            ? value
            : "N/A";

    };


    // Reusable system monitoring card

    const MetricCard = ({
        title,
        value,
        subtitle,
        icon,
        percentage,
    }) => (

        <div className="monitor-metric-card">

            <div className="monitor-metric-top">

                <span>{title}</span>

                <div className="monitor-metric-icon">
                    {icon}
                </div>

            </div>

            <h2>{value}</h2>

            <p>{subtitle}</p>

            {percentage !== undefined && (

                <div className="metric-progress">

                    <div
                        className="metric-progress-fill"
                        style={{
                            width: `${Math.min(
                                Math.max(Number(percentage) || 0, 0),
                                100
                            )}%`,
                        }}
                    ></div>

                </div>

            )}

        </div>

    );


    // Determine dashboard type

    const isAdminDashboard =
        agent === "Admin Agent" &&
        result?.cpu_usage_percent !== undefined;

    const isFinanceDashboard =
        agent === "Finance Agent" &&
        result?.revenue !== undefined;


    // Financial calculations

    const revenue = Number(result?.revenue) || 0;

    const expenses = Number(result?.expenses) || 0;

    const profit = Number(result?.net_profit) || 0;

    const profitMargin = revenue > 0
        ? ((profit / revenue) * 100).toFixed(1)
        : "0.0";


    // Financial chart data

    const chartData = [
        {
            name: "Revenue",
            amount: revenue,
        },
        {
            name: "Expenses",
            amount: expenses,
        },
        {
            name: "Net Profit",
            amount: profit,
        },
    ];


    return (

        <div className="command-page">

            {/* HEADER */}

            <div className="command-header">

                <div>

                    <div className="command-label">

                        <span className="status-dot"></span>

                        AI-SHIELD / UNIVERSAL COMMAND

                    </div>

                    <h1>Command Center</h1>

                    <p>
                        One interface. Multiple AI agents.
                        Every action protected by the Security Gateway.
                    </p>

                </div>

                <div className="command-header-icon">
                    <BrainCircuit size={38} />
                </div>

            </div>


            {/* COMMAND INPUT */}

            <section className="command-input-panel">

                <div className="command-panel-heading">

                    <div>
                        <Terminal size={19} />
                        <span>Universal Task Interface</span>
                    </div>

                    <span className="command-mode">
                        AUTO ROUTING ENABLED
                    </span>

                </div>


                <form onSubmit={handleExecute}>

                    <textarea
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="What would you like AI-SHIELD to do?"
                        rows={4}
                    />


                    <div className="command-input-footer">

                        <span>
                            Describe your task in natural language.
                        </span>


                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <LoaderCircle
                                        size={17}
                                        className="spin"
                                    />

                                    Processing...
                                </>

                            ) : (

                                <>
                                    Execute Command
                                    <Send size={17} />
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </section>


            {/* SUGGESTED COMMANDS */}

            <section className="command-suggestions">

                <h3>Try a command</h3>

                <div className="suggestion-list">

                    {suggestions.map((item, index) => (

                        <button
                            key={index}
                            onClick={() => {
                                setTask(item);
                                setError("");
                            }}
                        >

                            <Zap size={14} />

                            {item}

                        </button>

                    ))}

                </div>

            </section>


            {/* ERROR */}

            {error && (

                <div className="command-error">

                    <ShieldAlert size={20} />

                    <span>{error}</span>

                </div>

            )}


            {/* LOADING */}

            {loading && (

                <div className="command-loading">

                    <LoaderCircle
                        size={30}
                        className="spin"
                    />

                    <h3>Processing Your Request</h3>

                    <p>
                        Routing task, checking permissions and
                        executing through AI-SHIELD.
                    </p>

                </div>

            )}


            {/* EXECUTION RESULTS */}

            {response && security && (

                <section className="command-results">


                    {/* RESULTS HEADING */}

                    <div className="results-heading">

                        <div>

                            <span className="command-label">
                                EXECUTION REPORT
                            </span>

                            <h2>Command Results</h2>

                        </div>


                        <span className={
                            security.decision === "ALLOWED"
                                ? "decision-badge allowed"
                                : "decision-badge blocked"
                        }>

                            {security.decision === "ALLOWED"
                                ? <ShieldCheck size={16} />
                                : <ShieldAlert size={16} />
                            }

                            {security.decision}

                        </span>

                    </div>


                    {/* AGENT ROUTING */}

                    <div className="routing-card">

                        <div className={`routing-icon ${getAgentColor()}`}>

                            {getAgentIcon()}

                        </div>


                        <div className="routing-info">

                            <span>SELECTED AI AGENT</span>

                            <h3>{agent || "Unknown Agent"}</h3>

                            <p>
                                {response.routing?.reason ||
                                    "Agent selected for this task."}
                            </p>

                        </div>


                        <div className="routing-status">

                            <Activity size={16} />

                            ROUTED

                        </div>

                    </div>


                    {/* SECURITY INFORMATION */}

                    <div className="execution-grid">

                        <div className="execution-card">

                            <span>SECURITY DECISION</span>

                            <h3>{security.decision}</h3>

                        </div>


                        <div className="execution-card">

                            <span>RISK LEVEL</span>

                            <h3>
                                {risk?.risk_level ||
                                    risk?.severity ||
                                    "N/A"}
                            </h3>

                        </div>


                        <div className="execution-card">

                            <span>TOOL EXECUTED</span>

                            <h3>{security.tool || "N/A"}</h3>

                        </div>


                        <div className="execution-card">

                            <span>EXECUTION STATUS</span>

                            <h3>
                                {security.executed
                                    ? "COMPLETED"
                                    : "NOT EXECUTED"}
                            </h3>

                        </div>

                    </div>


                    {/* SECURITY REASON */}

                    <div className="security-message">

                        {security.decision === "ALLOWED" ? (

                            <ShieldCheck size={20} />

                        ) : (

                            <ShieldAlert size={20} />

                        )}

                        <span>{security.reason}</span>

                    </div>


                    {/* TOOL OUTPUT */}

                    {result && (

                        <div className="tool-result">

                            <div className="tool-result-heading">

                                <Activity size={19} />

                                <h3>Agent Output</h3>

                            </div>


                            {/* RESEARCH AGENT */}

                            {Array.isArray(result.results) && (

                                <div className="web-results">

                                    <div className="result-summary">

                                        <strong>
                                            {result.total_results || 0}
                                        </strong>

                                        <span>Search results</span>

                                    </div>


                                    {result.status === "ERROR" && (

                                        <p>{result.message}</p>

                                    )}


                                    {result.results.map((item, index) => (

                                        <div
                                            className="web-result-card"
                                            key={index}
                                        >

                                            <h4>{item.title}</h4>

                                            <p>{item.description}</p>


                                            {item.url && (

                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >

                                                    Visit Source

                                                    <ExternalLink size={14} />

                                                </a>

                                            )}

                                        </div>

                                    ))}


                                    <small>
                                        Research results are search snippets.
                                        Verify information using the original sources.
                                    </small>

                                </div>

                            )}


                            {/* ADMIN AGENT - LIVE MONITORING */}

                            {isAdminDashboard && (

                                <div className="monitor-dashboard">


                                    <div className="monitor-dashboard-header">

                                        <div>

                                            <span className="monitor-live-dot"></span>

                                            LIVE SYSTEM MONITORING

                                        </div>


                                        <span className="monitor-online">

                                            {result.server_status || "ONLINE"}

                                        </span>

                                    </div>


                                    {/* CPU RAM DISK */}

                                    <div className="monitor-grid">


                                        <MetricCard
                                            title="CPU USAGE"
                                            value={`${formatMetric(result.cpu_usage_percent)}%`}
                                            subtitle={`${formatMetric(result.cpu_logical_cores)} logical cores`}
                                            icon={<Cpu size={21} />}
                                            percentage={result.cpu_usage_percent}
                                        />


                                        <MetricCard
                                            title="MEMORY USAGE"
                                            value={`${formatMetric(result.memory_usage_percent)}%`}
                                            subtitle={`${formatMetric(result.memory_used_gb)} GB used / ${formatMetric(result.memory_total_gb)} GB`}
                                            icon={<MemoryStick size={21} />}
                                            percentage={result.memory_usage_percent}
                                        />


                                        <MetricCard
                                            title="DISK USAGE"
                                            value={`${formatMetric(result.disk_usage_percent)}%`}
                                            subtitle={`${formatMetric(result.disk_free_gb)} GB free`}
                                            icon={<HardDrive size={21} />}
                                            percentage={result.disk_usage_percent}
                                        />

                                    </div>


                                    {/* SYSTEM INFORMATION */}

                                    <div className="monitor-details">

                                        <div className="monitor-detail-heading">

                                            <Monitor size={19} />

                                            <h4>System Information</h4>

                                        </div>


                                        <div className="monitor-detail-grid">


                                            <div>

                                                <span>HOSTNAME</span>

                                                <strong>
                                                    {formatMetric(result.hostname)}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>OPERATING SYSTEM</span>

                                                <strong>
                                                    {formatMetric(result.operating_system)}
                                                </strong>

                                            </div>


                                            <div>

                                                <span>AVAILABLE RAM</span>

                                                <strong>
                                                    {formatMetric(result.memory_available_gb)} GB
                                                </strong>

                                            </div>


                                            <div>

                                                <span>DISK TOTAL</span>

                                                <strong>
                                                    {formatMetric(result.disk_total_gb)} GB
                                                </strong>

                                            </div>


                                            <div>

                                                <span>SYSTEM UPTIME</span>

                                                <strong>

                                                    <Clock size={15} />

                                                    {formatMetric(result.system_uptime_hours)} hours

                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="monitor-footer">

                                        <ShieldCheck size={16} />

                                        Metrics collected from the machine
                                        running the AI-SHIELD backend.

                                    </div>

                                </div>

                            )}


                            {/* FINANCE AGENT - ANALYTICS DASHBOARD */}

                            {isFinanceDashboard && (

                                <div className="finance-dashboard">


                                    {/* FINANCE HEADER */}

                                    <div className="finance-dashboard-header">

                                        <div>

                                            <span className="finance-live-dot"></span>

                                            FINANCIAL ANALYTICS

                                        </div>

                                        <span>
                                            {result.period || "Financial Report"}
                                        </span>

                                    </div>


                                    {/* FINANCIAL CARDS */}

                                    <div className="finance-metrics">


                                        <div className="finance-metric-card">

                                            <span>REVENUE</span>

                                            <h2>
                                                {revenue.toLocaleString("en-IN")}
                                            </h2>

                                            <p>Total revenue</p>

                                        </div>


                                        <div className="finance-metric-card">

                                            <span>EXPENSES</span>

                                            <h2>
                                                {expenses.toLocaleString("en-IN")}
                                            </h2>

                                            <p>Total expenditure</p>

                                        </div>


                                        <div className="finance-metric-card">

                                            <span>NET PROFIT</span>

                                            <h2>
                                                {profit.toLocaleString("en-IN")}
                                            </h2>

                                            <p>Revenue minus expenses</p>

                                        </div>


                                        <div className="finance-metric-card">

                                            <span>PROFIT MARGIN</span>

                                            <h2>{profitMargin}%</h2>

                                            <p>Profit as a percentage of revenue</p>

                                        </div>

                                    </div>


                                    {/* FINANCIAL CHART */}

                                    <div className="finance-chart-panel">

                                        <div className="finance-chart-heading">

                                            <h3>Financial Performance</h3>

                                            <p>
                                                Revenue vs Expenses vs Net Profit
                                            </p>

                                        </div>


                                        <div className="finance-chart">

                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >

                                                <BarChart
                                                    data={chartData}
                                                    margin={{
                                                        top: 20,
                                                        right: 20,
                                                        left: 10,
                                                        bottom: 10,
                                                    }}
                                                >

                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#38252e"
                                                    />


                                                    <XAxis
                                                        dataKey="name"
                                                        stroke="#aaa1a7"
                                                    />


                                                    <YAxis
                                                        stroke="#aaa1a7"
                                                    />


                                                    <Tooltip
                                                        contentStyle={{
                                                            background: "#180f15",
                                                            border: "1px solid #713044",
                                                            borderRadius: "10px",
                                                            color: "#fff",
                                                        }}

                                                        formatter={(value) =>
                                                            Number(value).toLocaleString("en-IN")
                                                        }
                                                    />


                                                    <Bar
                                                        dataKey="amount"
                                                        fill="#fb7185"
                                                        radius={[6, 6, 0, 0]}
                                                    />

                                                </BarChart>

                                            </ResponsiveContainer>

                                        </div>

                                    </div>


                                    {/* FINANCIAL SUMMARY */}

                                    <div className="finance-summary">

                                        <Wallet size={21} />

                                        <div>

                                            <h4>Financial Summary</h4>

                                            <p>

                                                The report records revenue of{" "}

                                                <strong>
                                                    {revenue.toLocaleString("en-IN")}
                                                </strong>

                                                , expenses of{" "}

                                                <strong>
                                                    {expenses.toLocaleString("en-IN")}
                                                </strong>

                                                , and net profit of{" "}

                                                <strong>
                                                    {profit.toLocaleString("en-IN")}
                                                </strong>

                                                . The calculated profit margin is{" "}

                                                <strong>{profitMargin}%</strong>.

                                            </p>

                                        </div>

                                    </div>


                                    {/* DATA DISCLAIMER */}

                                    <div className="finance-disclaimer">

                                        <ShieldCheck size={16} />

                                        This report uses synthetic demonstration data.
                                        It does not represent actual company financial records.

                                    </div>

                                </div>

                            )}


                            {/* GENERIC RESULTS */}

                            {!Array.isArray(result.results) &&
                                !isAdminDashboard &&
                                !isFinanceDashboard && (

                                    <div className="generic-result">

                                        {Object.entries(result).map(
                                            ([key, value]) => (

                                                <div
                                                    className="result-row"
                                                    key={key}
                                                >

                                                    <span>
                                                        {key.replaceAll("_", " ")}
                                                    </span>


                                                    <strong>

                                                        {typeof value === "object"
                                                            ? JSON.stringify(value)
                                                            : String(value)}

                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}


                            {/* DATA TYPE */}

                            {result.data_type && (

                                <p className="result-disclaimer">

                                    Data classification: {result.data_type}

                                </p>

                            )}

                        </div>

                    )}

                </section>

            )}

        </div>

    );

}

export default CommandCenter;