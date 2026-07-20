"use client";

import { useMemo } from "react";
import Link from "next/link";
import { where, orderBy, limit as fsLimit } from "firebase/firestore";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection, useFirestoreCount } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText, FolderOpen, Users, Mail, MessageSquare, Eye, Clock,
  Plus, TrendingUp, ChevronDown,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

interface Article {
  id: string;
  title?: string;
  category?: string;
  views?: number;
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

interface Comment {
  id: string;
  author?: string;
  content?: string;
  articleTitle?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

interface Subscriber {
  id: string;
  email?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-secondary-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="w-16 h-4 rounded" />
      </div>
      <Skeleton className="w-20 h-7 rounded mb-1" />
      <Skeleton className="w-28 h-4 rounded" />
    </div>
  );
}

function DashboardContent() {
  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

  const { count: totalArticles, loading: loadingArticles } = useFirestoreCount("articles");
  const { count: totalCategories, loading: loadingCategories } = useFirestoreCount("categories");
  const { count: totalUsers, loading: loadingUsers } = useFirestoreCount("users");
  const { count: totalSubscribers, loading: loadingSubscribers } = useFirestoreCount("newsletter");
  const { count: totalComments, loading: loadingComments } = useFirestoreCount("comments");

  const { count: publishedArticles } = useFirestoreCount("articles", [
    where("status", "==", "published"),
  ]);
  const { count: draftArticles } = useFirestoreCount("articles", [
    where("status", "==", "draft"),
  ]);
  const { count: pendingComments } = useFirestoreCount("comments", [
    where("status", "==", "pending"),
  ]);

  const { data: recentArticles, loading: loadingRecentArticles } = useFirestoreCollection<Article>(
    "articles",
    [orderBy("createdAt", "desc"), fsLimit(5)]
  );

  const { data: recentComments, loading: loadingRecentComments } = useFirestoreCollection<Comment>(
    "comments",
    [orderBy("createdAt", "desc"), fsLimit(5)]
  );

  const { data: recentSubscribers, loading: loadingRecentSubscribers } = useFirestoreCollection<Subscriber>(
    "newsletter",
    [orderBy("createdAt", "desc"), fsLimit(5)]
  );

  const { data: allArticles } = useFirestoreCollection<Article>("articles");

  const viewsData = useMemo(() => {
    if (!allArticles.length) {
      return [];
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped: Record<string, number> = {};
    allArticles.forEach((a) => {
      if (a.createdAt) {
        const d = new Date(a.createdAt.seconds * 1000);
        const key = monthNames[d.getMonth()];
        grouped[key] = (grouped[key] || 0) + (a.views || 0);
      }
    });
    return monthNames
      .filter((m) => grouped[m] !== undefined)
      .map((m) => ({ month: m, views: grouped[m] }));
  }, [allArticles]);

  const categoryData = useMemo(() => {
    const colors = ["#2563EB", "#14B8A6", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899", "#06B6D4"];
    const counts: Record<string, number> = {};
    allArticles.forEach((a) => {
      const cat = a.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length],
      }));
  }, [allArticles]);

  const stats = [
    { label: "Total Articles", value: totalArticles, icon: FileText, bg: "bg-blue-50", iconColor: "text-blue-500" },
    { label: "Published", value: publishedArticles, icon: Eye, bg: "bg-emerald-50", iconColor: "text-emerald-500" },
    { label: "Drafts", value: draftArticles, icon: Clock, bg: "bg-amber-50", iconColor: "text-amber-500" },
    { label: "Categories", value: totalCategories, icon: FolderOpen, bg: "bg-violet-50", iconColor: "text-violet-500" },
    { label: "Users", value: totalUsers, icon: Users, bg: "bg-cyan-50", iconColor: "text-cyan-500" },
    { label: "Subscribers", value: totalSubscribers, icon: Mail, bg: "bg-rose-50", iconColor: "text-rose-500" },
    { label: "Comments", value: totalComments, icon: MessageSquare, bg: "bg-indigo-50", iconColor: "text-indigo-500" },
    { label: "Pending Comments", value: pendingComments, icon: MessageSquare, bg: "bg-orange-50", iconColor: "text-orange-500" },
  ];

  const loadingStats = loadingArticles || loadingCategories || loadingUsers || loadingSubscribers || loadingComments;

  function formatDate(ts?: { seconds: number }) {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-sm text-secondary-500 mt-0.5">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-secondary-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
              <div className="text-sm text-secondary-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-secondary-900">Views Overview</h2>
            <div className="flex items-center gap-1.5 text-xs text-secondary-400">
              <TrendingUp className="w-3.5 h-3.5" /> From articles
            </div>
          </div>
          <div className="h-64">
            {viewsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={viewsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-secondary-400">
                No view data yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="text-base font-semibold text-secondary-900 mb-6">Top Categories</h2>
          <div className="h-52">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value} articles`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-secondary-400">
                No category data
              </div>
            )}
          </div>
          <div className="space-y-2.5 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-secondary-600">{cat.name}</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100">
        <div className="flex items-center justify-between p-5 border-b border-secondary-100">
          <h2 className="text-base font-semibold text-secondary-900">Latest Articles</h2>
          <Link
            href="/admin/articles"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Views</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingRecentArticles ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-secondary-50 last:border-0">
                    <td className="px-5 py-4"><Skeleton className="w-48 h-4 rounded" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-20 h-4 rounded" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-12 h-4 rounded" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-16 h-5 rounded-full" /></td>
                    <td className="px-5 py-4"><Skeleton className="w-24 h-4 rounded" /></td>
                  </tr>
                ))
              ) : recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-secondary-400">
                    No articles yet. Create your first article!
                  </td>
                </tr>
              ) : (
                recentArticles.map((article) => (
                  <tr key={article.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-secondary-900">{article.title || "Untitled"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-secondary-500">{article.category || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-secondary-500">{(article.views || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        article.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {article.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-secondary-500">{formatDate(article.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-secondary-100">
          <div className="p-5 border-b border-secondary-100">
            <h2 className="text-base font-semibold text-secondary-900">Recent Comments</h2>
          </div>
          <div className="divide-y divide-secondary-50">
            {loadingRecentComments ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 space-y-2">
                  <Skeleton className="w-32 h-4 rounded" />
                  <Skeleton className="w-full h-3 rounded" />
                  <Skeleton className="w-24 h-3 rounded" />
                </div>
              ))
            ) : recentComments.length === 0 ? (
              <div className="p-8 text-center text-sm text-secondary-400">No comments yet</div>
            ) : (
              recentComments.map((comment) => (
                <div key={comment.id} className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-900">{comment.author || "Anonymous"}</span>
                    <span className="text-xs text-secondary-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-secondary-600 line-clamp-2">{comment.content || ""}</p>
                  {comment.articleTitle && (
                    <p className="text-xs text-secondary-400 mt-1">
                      on <span className="text-primary-500">{comment.articleTitle}</span>
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-secondary-100">
          <div className="p-5 border-b border-secondary-100">
            <h2 className="text-base font-semibold text-secondary-900">Recent Subscribers</h2>
          </div>
          <div className="divide-y divide-secondary-50">
            {loadingRecentSubscribers ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="w-40 h-4 rounded" />
                    <Skeleton className="w-24 h-3 rounded" />
                  </div>
                </div>
              ))
            ) : recentSubscribers.length === 0 ? (
              <div className="p-8 text-center text-sm text-secondary-400">No subscribers yet</div>
            ) : (
              recentSubscribers.map((sub) => (
                <div key={sub.id} className="p-5 flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-secondary-900 truncate">{sub.email || "—"}</div>
                    <div className="text-xs text-secondary-400">{formatDate(sub.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
