"use client";

import { useState } from "react";
import { MessageSquare, Check, Trash2, Eye, Search, ChevronDown } from "lucide-react";

const sampleComments = [
  { id: 1, author: "John Doe", email: "john@example.com", article: "Best AI Tools in 2026", content: "Great article! Very helpful for finding the right AI tools.", date: "2026-05-23", status: "approved" },
  { id: 2, author: "Jane Smith", email: "jane@example.com", article: "ChatGPT Complete Guide", content: "This guide helped me learn prompt engineering. Thanks!", date: "2026-05-22", status: "pending" },
  { id: 3, author: "Mike Wilson", email: "mike@example.com", article: "Claude vs ChatGPT", content: "I prefer Claude for coding tasks. Good comparison though.", date: "2026-05-21", status: "approved" },
  { id: 4, author: "Sarah Lee", email: "sarah@example.com", article: "Best VPN for Windows", content: "Using NordVPN based on your recommendation. Works great!", date: "2026-05-20", status: "pending" },
];

export default function CommentsPage() {
  const [filter, setFilter] = useState("all");

  const filteredComments = sampleComments.filter(
    (c) => filter === "all" || c.status === filter
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">Comments</h1>
          <p className="text-sm text-secondary-500 mt-0.5">{sampleComments.length} total comments</p>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-secondary-200 rounded-lg px-3 py-2 pr-8 text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="all">All Comments</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl border border-secondary-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-500">{comment.author[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-900">{comment.author}</div>
                  <div className="text-xs text-secondary-400">{comment.email}</div>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                comment.status === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {comment.status === "approved" ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="text-sm text-secondary-600 mb-2">{comment.content}</p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-secondary-400">
                On: <span className="text-secondary-600">{comment.article}</span> · {comment.date}
              </div>
              <div className="flex items-center gap-1">
                {comment.status === "pending" && (
                  <button className="p-1.5 text-secondary-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
