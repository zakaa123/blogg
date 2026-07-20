"use client";

import { useState, useMemo } from "react";
import {
  MessageSquare, Check, Trash2, Search, ChevronDown, X, Ban,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  articleTitle: string;
  articleId: string;
  content: string;
  status: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

function CommentsContent() {
  const { toast } = useToast();
  const { data: comments, loading } = useFirestoreCollection<Comment>(
    "comments",
    [orderBy("createdAt", "desc")]
  );
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const matchFilter = filter === "all" || c.status === filter;
      const matchSearch = search === "" ||
        c.authorName?.toLowerCase().includes(search.toLowerCase()) ||
        c.content?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [comments, filter, search]);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "comments", id), { status: "approved", updatedAt: serverTimestamp() });
      toast("Comment approved", "success");
    } catch {
      toast("Failed to approve comment", "error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "comments", id), { status: "pending", updatedAt: serverTimestamp() });
      toast("Comment rejected", "success");
    } catch {
      toast("Failed to reject comment", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "comments", deleteId));
      toast("Comment deleted", "success");
    } catch {
      toast("Failed to delete comment", "error");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-32 mb-2" /><Skeleton className="h-4 w-28" /></div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Comments</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{comments.length} total comments</p>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="all">All Comments</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author or content..."
            className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl border border-secondary-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-500">{(comment.authorName || "A")[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-900">{comment.authorName || "Anonymous"}</div>
                  <div className="text-xs text-secondary-400">{comment.authorEmail}</div>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                comment.status === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {comment.status === "approved" ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mb-3">{comment.content}</p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-secondary-400">
                On: <span className="text-secondary-600">{comment.articleTitle || "Unknown article"}</span>
                {comment.createdAt && ` · ${new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}`}
              </div>
              <div className="flex items-center gap-1">
                {comment.status !== "approved" && (
                  <button onClick={() => handleApprove(comment.id)} className="p-1.5 text-secondary-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {comment.status === "approved" && (
                  <button onClick={() => handleReject(comment.id)} className="p-1.5 text-secondary-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors" title="Reject">
                    <Ban className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setDeleteId(comment.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
            <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">No comments found.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Delete Comment</h3>
            <p className="text-sm text-secondary-600 mb-6">This comment will be permanently deleted.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentsPage() {
  return (
    <AuthGuard>
      <CommentsContent />
    </AuthGuard>
  );
}
