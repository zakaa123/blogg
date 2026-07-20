"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, Save, Code,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreDoc } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AdSlot {
  name: string;
  code: string;
  enabled: boolean;
  position: string;
}

interface AdSettings {
  id: string;
  slots: AdSlot[];
}

const DEFAULT_SLOTS: AdSlot[] = [
  { name: "Header Ad", code: "", enabled: false, position: "header" },
  { name: "Sidebar Ad", code: "", enabled: false, position: "sidebar" },
  { name: "Footer Ad", code: "", enabled: false, position: "footer" },
  { name: "In-Article Ad", code: "", enabled: false, position: "in-article" },
  { name: "Between Posts Ad", code: "", enabled: false, position: "between-posts" },
];

function AdsContent() {
  const { toast } = useToast();
  const { data: adData, loading } = useFirestoreDoc<AdSettings>("advertisements", "global");
  const [slots, setSlots] = useState<AdSlot[]>(DEFAULT_SLOTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (adData?.slots) {
      setSlots(adData.slots);
    }
  }, [adData]);

  const updateSlot = (index: number, field: keyof AdSlot, value: string | boolean) => {
    setSlots((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "advertisements", "global"), {
        slots,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast("Ad settings saved!", "success");
    } catch {
      toast("Failed to save ad settings", "error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <Skeleton className="h-7 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-secondary-900">Ads Management</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-primary-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="space-y-5">
        {slots.map((slot, index) => (
          <div key={slot.position} className="bg-white rounded-xl border border-secondary-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-secondary-900">{slot.name}</h3>
                  <p className="text-xs text-secondary-400">Position: {slot.position}</p>
                </div>
              </div>
              <button
                onClick={() => updateSlot(index, "enabled", !slot.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  slot.enabled ? "bg-primary-500" : "bg-secondary-300"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  slot.enabled ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-secondary-600 mb-1.5">
                <Code className="w-3.5 h-3.5" /> Ad Code
              </label>
              <textarea
                value={slot.code}
                onChange={(e) => updateSlot(index, "code", e.target.value)}
                placeholder={`Paste your ${slot.name} ad code here...`}
                rows={4}
                className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-mono text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                slot.enabled ? "bg-emerald-50 text-emerald-700" : "bg-secondary-100 text-secondary-500"
              }`}>
                {slot.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdsPage() {
  return (
    <AuthGuard>
      <AdsContent />
    </AuthGuard>
  );
}
