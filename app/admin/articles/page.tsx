"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Eye, Edit3, Trash2, ChevronDown,
  MoreVertical, FileText, ArrowUpDown,
} from "lucide-react";
import { articles } from "@/lib/data";

export default function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || article.categorySlug === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "published" && article.featured) ||
      (filterStatus === "draft" && !article.featured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Articles</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{articles.length} total articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="artificial-intelligence">Artificial Intelligence</option>
              <option value="programming">Programming</option>
              <option value="software-reviews">Software Reviews</option>
              <option value="web-development">Web Development</option>
              <option value="guides-tutorials">Guides & Tutorials</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50/50">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-secondary-700">
                    Title <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-secondary-700">
                    Views <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Author</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr key={article.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex-shrink-0" />
                      <div>
                        <Link href={`/admin/articles/${article.id}`} className="text-sm font-medium text-secondary-900 hover:text-primary-500 transition-colors line-clamp-1">
                          {article.title}
                        </Link>
                        <p className="text-xs text-secondary-400 mt-0.5">{article.readTime} min read</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary-500">{article.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary-500">{(article.views / 1000).toFixed(1)}K</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-secondary-500">{article.author.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                      Published
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/article/${article.slug}`} target="_blank" className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/articles/${article.id}`} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">No articles found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
