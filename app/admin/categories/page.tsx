"use client";

import { useState } from "react";
import { FolderOpen, Plus, Edit3, Trash2, FileText, ChevronDown } from "lucide-react";
import { categories } from "@/lib/data";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Categories</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-secondary-100 p-5 mb-6 animate-slide-up">
          <h3 className="text-sm font-semibold text-secondary-900 mb-4">New Category</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")); }}
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-600 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-600 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">Save</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-secondary-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary-100 bg-secondary-50/50">
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Name</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Slug</th>
              <th className="text-left text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Articles</th>
              <th className="text-right text-xs font-medium text-secondary-500 uppercase tracking-wider px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.slug} className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                      <FolderOpen className="w-4 h-4" style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium text-secondary-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-secondary-500 font-mono">{cat.slug}</td>
                <td className="px-5 py-4 text-sm text-secondary-500">{cat.articleCount}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
