"use client";

import { useState, useEffect } from "react";
import { Save, Search, Globe } from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreDoc } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SeoSettings {
  id: string;
  metaTitle: string;
  metaDescription: string;
  robots: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  googleVerification: string;
  bingVerification: string;
}

function SeoContent() {
  const { toast } = useToast();
  const { data: settings, loading } = useFirestoreDoc<SeoSettings>("seo_settings", "global");
  const [form, setForm] = useState({
    metaTitle: "", metaDescription: "", robots: "index, follow", canonicalUrl: "",
    ogTitle: "", ogDescription: "", ogImageUrl: "",
    twitterCard: "summary_large_image", twitterTitle: "", twitterDescription: "",
    googleVerification: "", bingVerification: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        robots: settings.robots || "index, follow",
        canonicalUrl: settings.canonicalUrl || "",
        ogTitle: settings.ogTitle || "",
        ogDescription: settings.ogDescription || "",
        ogImageUrl: settings.ogImageUrl || "",
        twitterCard: settings.twitterCard || "summary_large_image",
        twitterTitle: settings.twitterTitle || "",
        twitterDescription: settings.twitterDescription || "",
        googleVerification: settings.googleVerification || "",
        bingVerification: settings.bingVerification || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "seo_settings", "global"), {
        ...form,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast("SEO settings saved!", "success");
    } catch {
      toast("Failed to save SEO settings", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-60 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-secondary-900">SEO Settings</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-primary-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="space-y-6">
        {/* General SEO */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Search className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold text-secondary-900">General SEO</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Meta Title</label>
              <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="Enter meta title..." className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <p className="text-xs text-secondary-400 mt-1">{form.metaTitle.length}/60 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Meta Description</label>
              <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} rows={3} placeholder="Enter meta description..." className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              <p className="text-xs text-secondary-400 mt-1">{form.metaDescription.length}/160 characters</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Robots</label>
                <select value={form.robots} onChange={(e) => setForm({ ...form, robots: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                  <option>index, follow</option>
                  <option>noindex, follow</option>
                  <option>index, nofollow</option>
                  <option>noindex, nofollow</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Canonical URL</label>
                <input type="url" value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} placeholder="https://example.com" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold text-secondary-900">Open Graph / Social</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">OG Title</label>
              <input type="text" value={form.ogTitle} onChange={(e) => setForm({ ...form, ogTitle: e.target.value })} placeholder="Open Graph title..." className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">OG Description</label>
              <textarea value={form.ogDescription} onChange={(e) => setForm({ ...form, ogDescription: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">OG Image URL</label>
              <input type="url" value={form.ogImageUrl} onChange={(e) => setForm({ ...form, ogImageUrl: e.target.value })} placeholder="https://example.com/og-image.jpg" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Twitter Card Type</label>
                <select value={form.twitterCard} onChange={(e) => setForm({ ...form, twitterCard: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>
              <div />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Twitter Title</label>
              <input type="text" value={form.twitterTitle} onChange={(e) => setForm({ ...form, twitterTitle: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Twitter Description</label>
              <textarea value={form.twitterDescription} onChange={(e) => setForm({ ...form, twitterDescription: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Verification Codes */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Search className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold text-secondary-900">Verification Codes</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Google Verification Code</label>
              <input type="text" value={form.googleVerification} onChange={(e) => setForm({ ...form, googleVerification: e.target.value })} placeholder="Google meta tag content" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Bing Verification Code</label>
              <input type="text" value={form.bingVerification} onChange={(e) => setForm({ ...form, bingVerification: e.target.value })} placeholder="Bing meta tag content" className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        {/* Google Preview */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <h2 className="text-base font-semibold text-secondary-900 mb-4">Google Preview</h2>
          <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50/50">
            <p className="text-xs text-secondary-400 mb-1">https://example.com{form.canonicalUrl}</p>
            <h3 className="text-lg text-blue-700 font-normal hover:underline cursor-pointer mb-1">
              {form.metaTitle || "Your Page Title"}
            </h3>
            <p className="text-sm text-secondary-600 line-clamp-2">
              {form.metaDescription || "Your meta description will appear here in Google search results..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeoPage() {
  return (
    <AuthGuard>
      <SeoContent />
    </AuthGuard>
  );
}
