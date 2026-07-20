"use client";

import { useState, useMemo } from "react";
import {
  FolderOpen, Plus, Edit3, Trash2, X, AlertCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection, useFirestoreCount } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status?: string;
  createdAt?: { seconds: number; nanoseconds: number };
}

function CategoriesContent() {
  const { toast } = useToast();
  const { data: categories, loading } = useFirestoreCollection<Category>(
    "categories",
    []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIcon("");
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIcon(cat.icon || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast("Category name is required", "error");
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description.trim(),
        icon: icon.trim(),
        status: "active",
        updatedAt: serverTimestamp(),
      };
      if (editingId) {
        await updateDoc(doc(db, "categories", editingId), data);
        toast("Category updated!", "success");
      } else {
        await addDoc(collection(db, "categories"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        toast("Category created!", "success");
      }
      resetForm();
    } catch {
      toast("Failed to save category", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "categories", deleteId));
      toast("Category deleted", "success");
    } catch {
      toast("Failed to delete category", "error");
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-32 mb-2" /><Skeleton className="h-4 w-20" /></div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-secondary-50">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Categories</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-secondary-100 p-5 mb-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-secondary-900 mb-4">{editingId ? "Edit Category" : "New Category"}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }}
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Icon</label>
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. Cpu, Code, BookOpen" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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

      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary-100 bg-secondary-50/50">
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Name</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Slug</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Description</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
              <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-sm font-medium text-secondary-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-secondary-500 font-mono">{cat.slug}</td>
                <td className="px-5 py-4 text-sm text-secondary-500 max-w-[200px] truncate">{cat.description || "—"}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                    {cat.status || "Active"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">No categories yet.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-500" /></div>
              <h3 className="text-lg font-semibold text-secondary-900">Delete Category</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">Are you sure? Articles in this category will not be deleted.</p>
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

export default function CategoriesPage() {
  return (
    <AuthGuard>
      <CategoriesContent />
    </AuthGuard>
  );
}
