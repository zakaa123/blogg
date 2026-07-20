"use client";

import { useState, useMemo } from "react";
import {
  Users, Plus, Edit3, Trash2, Search, ChevronDown, X, AlertCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  lastLogin?: { seconds: number; nanoseconds: number };
  createdAt?: { seconds: number; nanoseconds: number };
}

function UsersContent() {
  const { toast } = useToast();
  const { data: users, loading } = useFirestoreCollection<User>("users", [orderBy("createdAt", "desc")]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("author");
  const [userStatus, setUserStatus] = useState("active");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = search === "" ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === "all" || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  const resetForm = () => {
    setName(""); setEmail(""); setRole("author"); setUserStatus("active");
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (u: User) => {
    setEditingId(u.id); setName(u.name); setEmail(u.email);
    setRole(u.role); setUserStatus(u.status); setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    setSaving(true);
    try {
      const data = { name: name.trim(), email: email.trim(), role, status: userStatus, updatedAt: serverTimestamp() };
      if (editingId) {
        await updateDoc(doc(db, "users", editingId), data);
        toast("User updated!", "success");
      } else {
        await addDoc(collection(db, "users"), { ...data, createdAt: serverTimestamp() });
        toast("User created!", "success");
      }
      resetForm();
    } catch {
      toast("Failed to save user", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "users", deleteId));
      toast("User deleted", "success");
    } catch {
      toast("Failed to delete user", "error");
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-secondary-50">
              <Skeleton className="w-9 h-9 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
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
          <h1 className="text-xl font-bold text-secondary-900">Users</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{users.length} total users</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-secondary-100 p-5 mb-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-secondary-900 mb-4">{editingId ? "Edit User" : "New User"}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Role</label>
                <div className="relative">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="appearance-none w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Status</label>
                <div className="relative">
                  <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="appearance-none w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                </div>
              </div>
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
          <div className="relative">
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="appearance-none bg-secondary-50 border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="author">Author</option>
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
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Email</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Joined</th>
                <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-500">{(user.name || "U")[0]}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-secondary-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-secondary-500">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      user.role === "admin" ? "bg-violet-50 text-violet-700" :
                      user.role === "editor" ? "bg-blue-50 text-blue-700" :
                      "bg-secondary-100 text-secondary-700"
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-secondary-100 text-secondary-500"
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-secondary-500">
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(user)} className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(user.id)} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-sm text-secondary-500">No users found.</p>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-500" /></div>
              <h3 className="text-lg font-semibold text-secondary-900">Delete User</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">This user will be permanently removed.</p>
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

export default function UsersPage() {
  return (
    <AuthGuard>
      <UsersContent />
    </AuthGuard>
  );
}
