"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Eye, Clock, Globe, Tag, ChevronDown,
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Link2, Image, Code, Quote, AlignLeft, AlignCenter, AlignRight,
  Upload, X, Calendar,
} from "lucide-react";
import { categories } from "@/lib/data";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [status, setStatus] = useState("Draft");
  const [visibility, setVisibility] = useState("Public");
  const [publishDate, setPublishDate] = useState("");
  const [showPreview, setShowPreview] = useState(false);

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-secondary-900">Create New Article</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="flex items-center gap-1.5 px-5 py-2 bg-primary-500 rounded-lg text-sm font-medium text-white hover:bg-primary-600 transition-colors">
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="xl:col-span-2 space-y-5">
          {/* Title & Slug */}
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
                    className="appearance-none w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm cursor-pointer"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
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

          {/* Rich Text Editor */}
          <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-secondary-100 bg-secondary-50/50 flex-wrap">
              <div className="relative">
                <select className="appearance-none bg-white border border-secondary-200 rounded-md px-3 py-1.5 pr-7 text-xs font-medium text-secondary-700 focus:outline-none cursor-pointer">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary-400 pointer-events-none" />
              </div>
              <div className="w-px h-5 bg-secondary-200 mx-1" />
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <UnderlineIcon className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-secondary-200 mx-1" />
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <List className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-secondary-200 mx-1" />
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Link2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Code className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <Quote className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-secondary-200 mx-1" />
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors">
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
            {/* Editor Area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="w-full px-5 py-4 min-h-[400px] text-secondary-700 placeholder-secondary-400 focus:outline-none resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Publish */}
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">Publish</h3>
            <div className="flex gap-2 mb-4">
              <button className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                Save Draft
              </button>
              <button className="flex-1 px-3 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                Preview
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-500 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" /> Status:
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-secondary-700 font-medium bg-transparent border-0 focus:outline-none cursor-pointer"
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Pending Review</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-500 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Visibility:
                </span>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-secondary-700 font-medium bg-transparent border-0 focus:outline-none cursor-pointer"
                >
                  <option>Public</option>
                  <option>Private</option>
                  <option>Password Protected</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Publish:
                </span>
                <span className="text-secondary-700 font-medium">Immediately</span>
              </div>
            </div>
            <button className="w-full mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
              Publish
            </button>
          </div>

          {/* SEO Settings */}
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

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-4">Featured Image</h3>
            <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
              <p className="text-sm text-secondary-500">Click to upload or drag & drop</p>
              <p className="text-xs text-secondary-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
