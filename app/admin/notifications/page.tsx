"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell, Check, CheckCheck, Trash2, ArrowLeft, Filter, ChevronDown,
  MessageSquare, User, FileText, Mail,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import {
  collection, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc,
  writeBatch, where,
} from "firebase/firestore";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "article" | "comment" | "user" | "newsletter";
  read: boolean;
  createdAt: { toDate: () => Date } | Date | null;
}

const typeIcons: Record<string, React.ElementType> = {
  article: FileText,
  comment: MessageSquare,
  user: User,
  newsletter: Mail,
};

const typeColors: Record<string, string> = {
  article: "bg-blue-50 text-blue-600",
  comment: "bg-amber-50 text-amber-600",
  user: "bg-green-50 text-green-600",
  newsletter: "bg-purple-50 text-purple-600",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.filter((n) => !n.read).forEach((n) => {
      batch.update(doc(db, "notifications", n.id), { read: true });
    });
    await batch.commit();
    toast("All notifications marked as read", "success");
  };

  const clearAll = async () => {
    const batch = writeBatch(db);
    notifications.forEach((n) => batch.delete(doc(db, "notifications", n.id)));
    await batch.commit();
    toast("All notifications cleared", "success");
  };

  const deleteNotification = async (id: string) => {
    await deleteDoc(doc(db, "notifications", id));
    toast("Notification deleted", "success");
  };

  const formatDate = (date: { toDate: () => Date } | Date | null) => {
    if (!date) return "";
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AuthGuard>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">Notifications</h1>
              <p className="text-sm text-secondary-500">{unreadCount} unread</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "all" ? "bg-primary-500 text-white" : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"}`}
          >All</button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "unread" ? "bg-primary-500 text-white" : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"}`}
          >Unread ({unreadCount})</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-secondary-100">
            <Bell className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <div key={n.id} className={`flex items-start gap-4 p-4 bg-white rounded-xl border border-secondary-100 transition-colors ${!n.read ? "border-l-4 border-l-primary-500 bg-primary-50/30" : ""}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[n.type] || "bg-secondary-100 text-secondary-600"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-secondary-900">{n.title}</h3>
                    <p className="text-sm text-secondary-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-xs text-secondary-400 mt-1 block">{formatDate(n.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="p-1.5 text-secondary-400 hover:text-green-500 hover:bg-green-50 rounded-md transition-colors" title="Mark as read">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
