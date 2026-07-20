"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Globe, Mail, Shield, Palette } from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface Settings {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  adminEmail: string;
  postsPerPage: string;
}

const defaultSettings: Settings = {
  siteName: "AI TechHub",
  siteUrl: "https://aitechhub.com",
  siteDescription: "The ultimate AI & technology resource for developers, students & businesses.",
  adminEmail: "hello@aitechhub.com",
  postsPerPage: "10",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const ref = doc(db, "settings", "general");
    const unsub = onSnapshot(ref, (snap) => {
      if (!mounted) return;
      if (snap.exists()) {
        setSettings({ ...defaultSettings, ...snap.data() } as Settings);
      }
      setLoading(false);
    }, (err) => {
      const code = (err as { code?: string })?.code || "";
      if (!mounted || code === "cancelled" || code === "aborted") return;
      setLoading(false);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "general"), settings);
      toast("Settings saved successfully", "success");
    } catch {
      toast("Failed to save settings", "error");
    }
    setSaving(false);
  };

  return (
    <AuthGuard>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/dashboard" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-secondary-900">Settings</h1>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Globe className="w-5 h-5 text-primary-500" />
                <h2 className="text-base font-semibold text-secondary-900">General Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site Name</label>
                  <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site URL</label>
                  <input type="url" value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site Description</label>
                  <textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Mail className="w-5 h-5 text-primary-500" />
                <h2 className="text-base font-semibold text-secondary-900">Email Settings</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Admin Email</label>
                <input type="email" value={settings.adminEmail} onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield className="w-5 h-5 text-primary-500" />
                <h2 className="text-base font-semibold text-secondary-900">Firebase Configuration</h2>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-medium text-emerald-700">Firebase Connected</span>
                </div>
                <p className="text-xs text-emerald-600 mt-1">Project: blogging-326e8</p>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
