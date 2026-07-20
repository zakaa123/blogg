"use client";

import { useState, useMemo } from "react";
import {
  Mail, Search, Trash2, Download, Users,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, deleteDoc, doc, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Subscriber {
  id: string;
  email: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

function NewsletterContent() {
  const { toast } = useToast();
  const { data: subscribers, loading } = useFirestoreCollection<Subscriber>(
    "newsletter",
    [orderBy("createdAt", "desc")]
  );
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search) return subscribers;
    return subscribers.filter((s) =>
      s.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [subscribers, search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "newsletter", deleteId));
      toast("Subscriber removed", "success");
    } catch {
      toast("Failed to remove subscriber", "error");
    }
    setDeleteId(null);
  };

  const exportCSV = () => {
    const header = "Email,Subscribe Date\n";
    const rows = filtered.map((s) => {
      const date = s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : "";
      return `${s.email},${date}`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV exported successfully", "success");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-40 mb-2" /><Skeleton className="h-4 w-32" /></div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-secondary-50">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
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
          <h1 className="text-xl font-bold text-secondary-900">Newsletter</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{subscribers.length} subscribers</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-100 bg-secondary-50/50">
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Subscribe Date</th>
                <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary-500" />
                      </div>
                      <span className="text-sm font-medium text-secondary-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-secondary-500">
                    {sub.createdAt ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end">
                      <button onClick={() => setDeleteId(sub.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Remove">
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
            <Mail className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">{search ? "No subscribers match your search." : "No subscribers yet."}</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Remove Subscriber</h3>
            <p className="text-sm text-secondary-600 mb-6">This subscriber will be permanently removed from the newsletter.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsletterPage() {
  return (
    <AuthGuard>
      <NewsletterContent />
    </AuthGuard>
  );
}
