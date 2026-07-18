"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Eye, Users, DollarSign, TrendingUp, TrendingDown,
  Plus, ChevronDown, BarChart3, Activity,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const stats = [
  {
    label: "Total Articles",
    value: "1,245",
    change: "+12.5%",
    trend: "up" as const,
    icon: FileText,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
  },
  {
    label: "Total Views",
    value: "2.5M",
    change: "+8.3%",
    trend: "up" as const,
    icon: Eye,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
  },
  {
    label: "Subscribers",
    value: "78,250",
    change: "+15.7%",
    trend: "up" as const,
    icon: Users,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
  },
  {
    label: "Ad Revenue",
    value: "$12,450",
    change: "+11.4%",
    trend: "up" as const,
    icon: DollarSign,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
  },
];

const viewsData = [
  { month: "Jan", views: 120 },
  { month: "Feb", views: 95 },
  { month: "Mar", views: 140 },
  { month: "Apr", views: 110 },
  { month: "May", views: 155 },
  { month: "Jun", views: 130 },
  { month: "Jul", views: 170 },
];

const categoryData = [
  { name: "AI Tools", value: 35, color: "#2563EB" },
  { name: "Programming", value: 25, color: "#14B8A6" },
  { name: "Reviews", value: 20, color: "#F59E0B" },
  { name: "Guides", value: 10, color: "#8B5CF6" },
  { name: "News", value: 10, color: "#EF4444" },
];

const recentArticles = [
  { title: "Best AI Tools in 2026", category: "AI Tools", views: "12,500", status: "Published" },
  { title: "ChatGPT Complete Guide", category: "Guides", views: "9,850", status: "Published" },
  { title: "Next.js 16 Tutorial", category: "Tutorials", views: "8,420", status: "Published" },
  { title: "Best VPN for Privacy 2026", category: "Reviews", views: "7,100", status: "Draft" },
  { title: "Claude 3.7 Released", category: "AI News", views: "6,430", status: "Published" },
];

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState("This Month");

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-secondary-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${stat.lightColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace("bg-", "text-")}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.trend === "up" ? "text-emerald-600" : "text-red-500"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
            <div className="text-sm text-secondary-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Views Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-secondary-900">Views Overview</h2>
            <div className="relative">
              <select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
                className="appearance-none bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-400 pointer-events-none" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9CA3AF" }}
                />
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
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="text-base font-semibold text-secondary-900 mb-6">Top Categories</h2>
          <div className="h-52">
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
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-secondary-600">{cat.name}</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Articles Table */}
      <div className="bg-white rounded-xl border border-secondary-100">
        <div className="flex items-center justify-between p-5 border-b border-secondary-100">
          <h2 className="text-base font-semibold text-secondary-900">Latest Articles</h2>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
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
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((article, i) => (
                <tr key={i} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors cursor-pointer">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-secondary-900 hover:text-primary-500 transition-colors">{article.title}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary-500">{article.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary-500">{article.views}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      article.status === "Published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {article.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
