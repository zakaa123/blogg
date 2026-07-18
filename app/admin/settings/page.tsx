"use client";

import { useState } from "react";
import { Save, Globe, Mail, Palette, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("AI TechHub");
  const [siteUrl, setSiteUrl] = useState("https://aitechhub.com");
  const [siteDescription, setSiteDescription] = useState("The ultimate AI & technology resource for developers, students & businesses.");
  const [adminEmail, setAdminEmail] = useState("hello@aitechhub.com");
  const [postsPerPage, setPostsPerPage] = useState("10");

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-bold text-secondary-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold text-secondary-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site URL</label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Site Description</label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Posts Per Page</label>
              <input
                type="number"
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(e.target.value)}
                className="w-32 px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-xl border border-secondary-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold text-secondary-900">Email Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Firebase Status */}
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

        <button className="flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
