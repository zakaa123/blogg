"use client";

import { useState, useEffect, useRef } from "react";
import {
  Image, Upload, Trash2, Copy, Search, X, CheckCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { storage, db } from "@/lib/firebase";
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll,
} from "firebase/storage";
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt?: { seconds: number; nanoseconds: number };
}

function MediaContent() {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as MediaItem[];
      setMedia(items);
    } catch {
      // silently fail
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `media/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        () => {
          toast("Upload failed", "error");
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "media"), {
            name: file.name,
            url,
            size: file.size,
            storagePath: `media/${fileName}`,
            createdAt: serverTimestamp(),
          });
          toast("File uploaded successfully", "success");
          setUploading(false);
          setProgress(0);
          loadMedia();
        }
      );
    } catch {
      toast("Upload failed", "error");
      setUploading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const item = media.find((m) => m.id === deleteId);
    try {
      if (item) {
        const storageRef = ref(storage, `media/${item.name}`);
        try { await deleteObject(storageRef); } catch { /* may not exist */ }
      }
      await deleteDoc(doc(db, "media", deleteId));
      toast("File deleted", "success");
      setMedia((prev) => prev.filter((m) => m.id !== deleteId));
    } catch {
      toast("Failed to delete file", "error");
    }
    setDeleteId(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("URL copied to clipboard", "success");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const filtered = search
    ? media.filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()))
    : media;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between">
          <div><Skeleton className="h-7 w-36 mb-2" /><Skeleton className="h-4 w-24" /></div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Media Library</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{media.length} files</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      {uploading && (
        <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-secondary-700">Uploading... {progress}%</span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="aspect-square bg-secondary-50 relative overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(item.url)} className="p-2 bg-white rounded-lg text-secondary-700 hover:text-primary-500 shadow-lg" title="Copy URL">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="p-2 bg-white rounded-lg text-secondary-700 hover:text-red-500 shadow-lg" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-secondary-900 truncate">{item.name}</p>
              <p className="text-xs text-secondary-400 mt-0.5">{formatSize(item.size || 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-secondary-100">
          <Image className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
          <p className="text-sm text-secondary-500">{search ? "No files match your search." : "No media files yet."}</p>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Delete File</h3>
            <p className="text-sm text-secondary-600 mb-6">This file will be permanently deleted from storage.</p>
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

export default function MediaPage() {
  return (
    <AuthGuard>
      <MediaContent />
    </AuthGuard>
  );
}
