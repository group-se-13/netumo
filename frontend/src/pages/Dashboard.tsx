import { useEffect, useState, useMemo } from "react";
import { getTargets, getMonitoringResults } from "../api/targets";
import type { Target, MonitoringResult } from "../types/types";
import { theme } from "../styles/theme";
import TargetForm from "../components/sections/AddTargetForm";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const PAGE_SIZE = 10;
const SUCCESS_COLOR = "#4ade80"; // green-400
const FAILURE_COLOR = "#f87171"; // red-400

const Dashboard = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [results, setResults] = useState<MonitoringResult[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterTargetId, setFilterTargetId] = useState("");

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await getTargets();
        setTargets(data);
      } catch (err) {
        console.error("Failed to fetch targets:", err);
      }
    };
    fetchTargets();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const offset = page * PAGE_SIZE;
        const data = await getMonitoringResults(undefined, PAGE_SIZE, offset);
        setResults(data);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("Failed to fetch monitoring results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 0) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const filteredResults = useMemo(() => {
    if (!filterTargetId.trim()) return results;
    return results.filter((res) =>
      res.target_id.toString().toLowerCase().includes(filterTargetId.toLowerCase())
    );
  }, [results, filterTargetId]);

  const statusData = useMemo(() => {
    const success = filteredResults.filter((r) => r.success).length;
    const failure = filteredResults.length - success;
    return [
      { name: "Success", value: success },
      { name: "Failure", value: failure },
    ];
  }, [filteredResults]);

  const responseTimeData = useMemo(() => {
    return [...filteredResults]
      .filter((r) => r.response_time != null)
      .sort(
        (a, b) =>
          new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
      )
      .map((r) => ({
        time: new Date(r.checked_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        responseTime: r.response_time,
      }));
  }, [filteredResults]);

  const errorData = useMemo(() => {
    const errorCounts: Record<string, number> = {};
    filteredResults.forEach((r) => {
      if (r.error?.trim()) {
        errorCounts[r.error] = (errorCounts[r.error] || 0) + 1;
      }
    });
    return Object.entries(errorCounts).map(([error, count]) => ({
      error,
      count,
    }));
  }, [filteredResults]);

  return (
    <div className="p-8 space-y-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black min-h-screen">
      <h1 className={theme.title}>🚂 Mini-Netumo Monitoring Dashboard</h1>

      {/* Targets Overview */}
      <section className={theme.section}>
        <h2 className={theme.subtitle}>🎯 Targets</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {targets.map((target) => (
            <li key={target.id} className={theme.card}>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {target.name}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {target.url}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Charts */}
      <section className={theme.section}>
        <h2 className={theme.subtitle}>📈 Monitoring Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Success" ? SUCCESS_COLOR : FAILURE_COLOR
                      }
                    />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Response Time Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <ReTooltip />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Errors Count */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow max-h-[300px] overflow-auto">
            <h3 className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Errors Count
            </h3>
            {errorData.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No errors found
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={errorData}
                  layout="vertical"
                  margin={{ left: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="error" type="category" width={150} />
                  <ReTooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Filter by Target ID */}
      <section className={theme.section}>
        <h2 className={theme.subtitle}>🔍 Filter by Target ID</h2>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            placeholder="Enter Target ID..."
            value={filterTargetId}
            onChange={(e) => setFilterTargetId(e.target.value)}
            className="px-4 py-2 w-full md:w-1/3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
          <button
            onClick={() => setFilterTargetId("")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Monitoring Results Table */}
      <section className={theme.section}>
        <h2 className={theme.subtitle}>📊 Latest Monitoring Results</h2>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 0 || loading}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page + 1} — Showing {filteredResults.length} result
            {filteredResults.length !== 1 && "s"}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasMore || loading}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg">
          <table className={`${theme.table} w-full text-left border-collapse`}>
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                {[
                  "Target ID",
                  "Status",
                  "Response Time (s)",
                  "Checked At",
                  "Error",
                ].map((header) => (
                  <th
                    key={header}
                    className={`${theme.th} px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredResults.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className={`${theme.td} px-6 py-4 text-sm`}>
                    {res.target_id}
                  </td>
                  <td className={`${theme.td} px-6 py-4 text-sm`}>
                    {res.success ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                        ✅ <span>{res.status_code ?? "N/A"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                        ❌ <span>{res.status_code ?? "N/A"}</span>
                      </span>
                    )}
                  </td>
                  <td className={`${theme.td} px-6 py-4 text-sm`}>
                    {res.response_time ?? "N/A"}
                  </td>
                  <td className={`${theme.td} px-6 py-4 text-sm`}>
                    {res.checked_at}
                  </td>
                  <td className={`${theme.td} px-6 py-4 text-sm`}>
                    {res.error ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Target Form */}
      <section className={theme.section}>
        <TargetForm
          onTargetSaved={async () => {
            const updatedTargets = await getTargets();
            setTargets(updatedTargets);
          }}
        />
      </section>
    </div>
  );
};

export default Dashboard;