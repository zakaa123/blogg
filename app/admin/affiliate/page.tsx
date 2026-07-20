"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Link2, Plus, Edit3, Trash2, ArrowLeft, Search, ExternalLink,
  TrendingUp, DollarSign, Eye,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
  query, orderBy,
} from "firebase/firestore";

interface AffiliateLink {
  id: string;
  productName: string;
  description: string;
  affiliateUrl: string;
  category: string;
  commission: string;
  clicks: number;
  status: "active" | "inactive";
  createdAt: { toDate: () => Date } | Date | null;
}

const emptyForm = { productName: "", description: "", affiliateUrl: "", category: "", commission: "", status: "active" as const };

export default function AffiliatePage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "affiliate_links"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLinks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AffiliateLink)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = links.filter((l) => l.productName.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, "affiliate_links", editingId), form);
        toast("Affiliate link updated", "success");
      } else {
        await addDoc(collection(db, "affiliate_links"), { ...form, clicks: 0, createdAt: serverTimestamp() });
        toast("Affiliate link created", "success");
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch {
      toast("Something went wrong", "error");
    }
  };

  const handleEdit = (link: AffiliateLink) => {
    setForm({ productName: link.productName, description: link.description, affiliateUrl: link.affiliateUrl, category: link.category, commission: link.commission, status: link.status });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this affiliate link?")) return;
    await deleteDoc(doc(db, "affiliate_links", id));
    toast("Affiliate link deleted", "success");
  };

  const toggleStatus = async (link: AffiliateLink) => {
    await updateDoc(doc(db, "affiliate_links", link.id), { status: link.status === "active" ? "inactive" : "active" });
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">Affiliate Links</h1>
              <p className="text-sm text-secondary-500">{links.length} total links</p>
            </div>
          </div>
          <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm); }} className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-secondary-100 p-5 mb-6 space-y-4">
            <h3 className="text-sm font-semibold text-secondary-900">{editingId ? "Edit" : "New"} Affiliate Link</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Product Name</label>
                <input type="text" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Affiliate URL</label>
                <input type="url" value={form.affiliateUrl} onChange={(e) => setForm({ ...form, affiliateUrl: e.target.value })} required className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Commission</label>
                <input type="text" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">Cancel</button>
            </div>
          </form>
        )}

        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search links..." className="w-full pl-9 pr-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-secondary-100">
            <Link2 className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No affiliate links yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-100 bg-secondary-50/50">
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Category</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Clicks</th>
                  <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((link) => (
                  <tr key={link.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-secondary-900">{link.productName}</div>
                      <div className="text-xs text-secondary-400 truncate max-w-xs">{link.affiliateUrl}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-500">{link.category || "-"}</td>
                    <td className="px-5 py-4 text-sm text-secondary-500">{link.clicks || 0}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleStatus(link)} className={`px-2.5 py-0.5 text-xs font-medium rounded-full cursor-pointer transition-colors ${link.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-secondary-100 text-secondary-500"}`}>
                        {link.status}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a href={link.affiliateUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"><ExternalLink className="w-4 h-4" /></a>
                        <button onClick={() => handleEdit(link)} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(link.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
