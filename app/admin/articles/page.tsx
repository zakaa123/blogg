"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus, Search, Eye, Edit3, Trash2, ChevronDown,
  FileText, AlertCircle, X,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, query, orderBy, deleteDoc, doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: string;
  views: number;
  thumbnail?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

const ITEMS_PER_PAGE = 10;

function ArticlesPageContent() {
  const { toast } = useToast();
  const { data: articles, loading } = useFirestoreCollection<Article>(
    "articles",
    [orderBy("createdAt", "desc")]
  );
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category).filter(Boolean));
    return Array.from(cats);
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "all" || a.category === filterCategory;
      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [articles, search, filterCategory, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "articles", deleteId));
      toast("Article deleted successfully", "success");
    } catch {
      toast("Failed to delete article", "error");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-40 mb-2" /><Skeleton className="h-4 w-24" /></div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-secondary-50">
              <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
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

      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="appearance-none bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
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

      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50/50">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Author</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Views</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((article) => (
                <tr key={article.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary-400" />
                        </div>
                      )}
                      <Link href={`/admin/articles/${article.id}`} className="text-sm font-medium text-secondary-900 hover:text-primary-500 transition-colors line-clamp-1">
                        {article.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-secondary-500">{article.category || "—"}</td>
                  <td className="px-5 py-4 text-sm text-secondary-500">{article.author || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      article.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {article.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-secondary-500">{article.views ?? 0}</td>
                  <td className="px-5 py-4 text-sm text-secondary-500">
                    {article.createdAt
                      ? new Date(article.createdAt.seconds * 1000).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/article/${article.slug}`} target="_blank" className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/articles/${article.id}`} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(article.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">No articles found.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-secondary-100">
            <p className="text-xs text-secondary-500">
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-xs font-medium rounded-md border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md border ${
                    p === page
                      ? "bg-primary-500 text-white border-primary-500"
                      : "border-secondary-200 text-secondary-600 hover:bg-secondary-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-xs font-medium rounded-md border border-secondary-200 text-secondary-600 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">Delete Article</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <AuthGuard>
      <ArticlesPageContent />
    </AuthGuard>
  );
}
