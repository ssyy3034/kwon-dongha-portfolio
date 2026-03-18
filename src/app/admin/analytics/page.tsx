"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Lock,
  Unlock,
  RefreshCw,
  MessageSquare,
  Users,
  Zap,
  Clock,
  ShieldAlert,
  Coins,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface Stats {
  period: string;
  totalChats: number;
  uniqueSessions: number;
  successRate: number;
  guardrailBlockRate: number;
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
  totalTokenUsage: number;
  avgTokensPerChat: number;
}

interface TrendItem {
  date: string;
  chats: number;
  uniqueSessions: number;
  avgResponseTimeMs: number;
  tokenUsage: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors">
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub && (
        <p className="text-xs text-[var(--color-muted)] mt-1">{sub}</p>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin-key");
    if (saved) {
      setAdminKey(saved);
      setAuthenticated(true);
    }
  }, []);

  const fetchData = useCallback(
    async (key: string, d: number) => {
      setLoading(true);
      setError("");
      try {
        const headers = { "x-admin-key": key };
        const [statsRes, trendRes] = await Promise.all([
          fetch(`${API_URL}/analytics/stats?days=${d}`, { headers }),
          fetch(`${API_URL}/analytics/trend?days=${d}`, { headers }),
        ]);

        if (statsRes.status === 401 || trendRes.status === 401) {
          setError("인증 실패: 올바른 Admin Key를 입력하세요.");
          setAuthenticated(false);
          localStorage.removeItem("admin-key");
          return;
        }

        if (!statsRes.ok || !trendRes.ok) {
          setError("데이터를 불러오는 데 실패했습니다.");
          return;
        }

        setStats(await statsRes.json());
        setTrend(await trendRes.json());
      } catch {
        setError("서버에 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (authenticated && adminKey) {
      fetchData(adminKey, days);
    }
  }, [authenticated, adminKey, days, fetchData]);

  const handleLogin = () => {
    if (!keyInput.trim()) return;
    localStorage.setItem("admin-key", keyInput);
    setAdminKey(keyInput);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-key");
    setAdminKey("");
    setAuthenticated(false);
    setStats(null);
    setTrend([]);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-[var(--color-muted)]" />
            <h1 className="text-lg font-bold">Analytics Dashboard</h1>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          <input
            type="password"
            placeholder="Admin Key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-amber-500 text-white font-medium py-2.5 text-sm hover:bg-amber-600 transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Unlock className="w-5 h-5 text-green-500" />
          <h1 className="text-xl font-bold">Chat Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm"
          >
            <option value={1}>오늘</option>
            <option value={7}>7일</option>
            <option value={14}>14일</option>
            <option value={30}>30일</option>
          </select>
          <button
            onClick={() => fetchData(adminKey, days)}
            disabled={loading}
            className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-border)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[var(--color-border)] transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-6">{error}</p>
      )}

      {stats && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              icon={MessageSquare}
              label="총 대화"
              value={stats.totalChats.toLocaleString()}
            />
            <StatCard
              icon={Users}
              label="고유 세션"
              value={stats.uniqueSessions.toLocaleString()}
            />
            <StatCard
              icon={Zap}
              label="성공률"
              value={`${stats.successRate}%`}
            />
            <StatCard
              icon={ShieldAlert}
              label="가드레일 차단"
              value={`${stats.guardrailBlockRate}%`}
            />
            <StatCard
              icon={Clock}
              label="평균 응답"
              value={`${stats.avgResponseTimeMs}ms`}
              sub={`p95: ${stats.p95ResponseTimeMs}ms`}
            />
            <StatCard
              icon={Coins}
              label="토큰 사용"
              value={stats.totalTokenUsage.toLocaleString()}
              sub={`평균 ${stats.avgTokensPerChat}/대화`}
            />
          </div>

          {/* Charts */}
          {trend.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily chats bar chart */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                <h3 className="text-sm font-medium text-[var(--color-muted)] mb-4">
                  일별 대화 수
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="chats" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Response time line chart */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                <h3 className="text-sm font-medium text-[var(--color-muted)] mb-4">
                  평균 응답 시간 (ms)
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgResponseTimeMs"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Sessions line chart */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                <h3 className="text-sm font-medium text-[var(--color-muted)] mb-4">
                  일별 고유 세션
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="uniqueSessions"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#10b981" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Token usage bar chart */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
                <h3 className="text-sm font-medium text-[var(--color-muted)] mb-4">
                  일별 토큰 사용량
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => v.slice(5)}
                      tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="tokenUsage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {!stats && !loading && !error && (
        <p className="text-[var(--color-muted)] text-center mt-20">
          데이터를 불러오는 중...
        </p>
      )}
    </div>
  );
}
