"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Save, Eye, ChevronDown, X, Trash2, Image, AlertCircle,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreDoc, useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collection, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  status: string;
  author: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function EditArticleContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const { data: article, loading } = useFirestoreDoc<Article>("articles", id);
  const { data: categories } = useFirestoreCollection<Category>("categories", [orderBy("name")]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setSlug(article.slug || "");
      setCategory(article.category || "");
      setTags(article.tags || []);
      setContent(article.content || "");
      setFeaturedImage(article.featuredImage || "");
      setMetaTitle(article.metaTitle || "");
      setMetaDescription(article.metaDescription || "");
      setFocusKeyword(article.focusKeyword || "");
      setStatus(article.status || "draft");
    }
  }, [article]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast("Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "articles", id), {
        title: title.trim(),
        slug: slug.trim(),
        category,
        tags,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        focusKeyword,
        status,
        updatedAt: serverTimestamp(),
      });
      toast("Article updated!", "success");
    } catch {
      toast("Failed to update article", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "articles", id));
      toast("Article deleted", "success");
      router.push("/admin/articles");
    } catch {
      toast("Failed to delete article", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6 text-center py-20">
        <AlertCircle className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500">Article not found.</p>
        <Link href="/admin/articles" className="text-primary-500 text-sm mt-2 inline-block hover:underline">Back to articles</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-secondary-900">Edit Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowDelete(true)} className="flex items-center gap-1.5 px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 bg-primary-500 rounded-lg text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-secondary-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Title</label>
              <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title..." className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-medium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Slug</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Category</label>
                <div className="relative">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="appearance-none w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm cursor-pointer">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-md">
                      {tag}
                      <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-primary-800"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder={tags.length === 0 ? "Type and press enter..." : ""} className="flex-1 min-w-[100px] bg-transparent border-0 outline-none text-sm text-secondary-900 placeholder-secondary-400 py-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <div className="border-b border-secondary-100 bg-secondary-50/50 px-4 py-2.5">
              <span className="text-sm font-medium text-secondary-700">Content</span>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your article content here..." className="w-full px-5 py-4 min-h-[400px] text-secondary-700 placeholder-secondary-400 focus:outline-none resize-y leading-relaxed" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">Publish</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-500">Status:</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-secondary-700 font-medium bg-transparent border-0 focus:outline-none cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">Featured Image</h3>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1.5">Image URL</label>
              <input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            {featuredImage && (
              <div className="mt-3 relative">
                <img src={featuredImage} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                <button onClick={() => setFeaturedImage("")} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"><X className="w-3 h-3" /></button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta title..." className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <p className="text-xs text-secondary-400 mt-1">{metaTitle.length}/60</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Meta Description</label>
                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                <p className="text-xs text-secondary-400 mt-1">{metaDescription.length}/160</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Focus Keyword</label>
                <input type="text" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900">Delete Article</h3>
            </div>
            <p className="text-sm text-secondary-600 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowDelete(false)} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditArticlePage() {
  return (
    <AuthGuard>
      <EditArticleContent />
    </AuthGuard>
  );
}
