"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Eye, ChevronDown, X, Image,
} from "lucide-react";
import AuthGuard from "@/components/auth-guard";
import { useFirestoreCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Category {
  id: string;
  name: string;
  slug: string;
}

function NewArticleContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories, loading: catsLoading } = useFirestoreCollection<Category>(
    "categories",
    [orderBy("name")]
  );

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

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async (publishStatus: string) => {
    if (!title.trim()) {
      toast("Title is required", "error");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "articles"), {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category,
        tags,
        content,
        featuredImage,
        metaTitle,
        metaDescription,
        focusKeyword,
        status: publishStatus,
        author: "Admin",
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast(publishStatus === "published" ? "Article published!" : "Draft saved!", "success");
      router.push("/admin/articles");
    } catch {
      toast("Failed to save article", "error");
    }
    setSaving(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-secondary-900">Create New Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-primary-500 rounded-lg text-sm font-medium text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-secondary-100 p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="enter-article-slug"
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm cursor-pointer"
                  >
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
                <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-md">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-primary-800">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={tags.length === 0 ? "Type and press enter..." : ""}
                    className="flex-1 min-w-[100px] bg-transparent border-0 outline-none text-sm text-secondary-900 placeholder-secondary-400 py-0.5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            <div className="border-b border-secondary-100 bg-secondary-50/50 px-4 py-2.5">
              <span className="text-sm font-medium text-secondary-700">Content</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="w-full px-5 py-4 min-h-[400px] text-secondary-700 placeholder-secondary-400 focus:outline-none resize-y leading-relaxed"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">Publish</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-500">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-secondary-700 font-medium bg-transparent border-0 focus:outline-none cursor-pointer"
                >
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
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {featuredImage && (
              <div className="mt-3 relative">
                <img src={featuredImage} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                <button onClick={() => setFeaturedImage("")} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {!featuredImage && (
              <div className="mt-3 border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center">
                <Image className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                <p className="text-xs text-secondary-400">Paste an image URL above</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Enter meta title..."
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-secondary-400 mt-1">{metaTitle.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Meta Description</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Enter meta description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-secondary-400 mt-1">{metaDescription.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1.5">Focus Keyword</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Enter focus keyword..."
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <AuthGuard>
      <NewArticleContent />
    </AuthGuard>
  );
}
