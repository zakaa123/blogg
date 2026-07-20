"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe, Plus, Edit3, Trash2, Search, ChevronDown, X, AlertCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  author: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

function PagesContent() {
  const { toast } = useToast();
  const { data: pages, loading } = useFirestoreCollection<Page>("pages", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return pages.filter((p) =>
      search === "" || p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [pages, search]);

  const resetForm = () => {
    setTitle(""); setSlug(""); setContent(""); setStatus("draft");
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (p: Page) => {
    setEditingId(p.id); setTitle(p.title); setSlug(p.slug);
    setContent(p.content || ""); setStatus(p.status || "draft"); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast("Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content,
        status,
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "pages", editingId), data);
        toast("Page updated!", "success");
      } else {
        await addDoc(collection(db, "pages"), {
          ...data,
          author: "Admin",
          createdAt: serverTimestamp(),
        });
        toast("Page created!", "success");
      }
      resetForm();
    } catch {
      toast("Failed to save page", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "pages", deleteId));
      toast("Page deleted", "success");
    } catch {
      toast("Failed to delete page", "error");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-24 mb-2" /><Skeleton className="h-4 w-20" /></div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-secondary-50">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
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
          <h1 className="text-xl font-bold text-secondary-900">Pages</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{pages.length} pages</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" /> New Page
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-secondary-100 p-5 mb-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-secondary-900 mb-4">{editingId ? "Edit Page" : "New Page"}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} placeholder="Page content..." className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y" />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
              <button onClick={resetForm} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary-100 bg-secondary-50/50">
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Title</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Slug</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Author</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Date</th>
              <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((page) => (
              <tr key={page.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-accent-500" />
                    </div>
                    <span className="text-sm font-medium text-secondary-900">{page.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-secondary-500 font-mono">{page.slug}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    page.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>{page.status === "published" ? "Published" : "Draft"}</span>
                </td>
                <td className="px-5 py-4 text-sm text-secondary-500">{page.author || "—"}</td>
                <td className="px-5 py-4 text-sm text-secondary-500">
                  {page.createdAt ? new Date(page.createdAt.seconds * 1000).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(page)} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(page.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">{search ? "No pages match your search." : "No pages yet."}</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-500" /></div>
              <h3 className="text-lg font-semibold text-secondary-900">Delete Page</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">This page will be permanently deleted.</p>
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

export default function PagesPage() {
  return (
    <AuthGuard>
      <PagesContent />
    </AuthGuard>
  );
}
