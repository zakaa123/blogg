"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ChevronDown, Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper } from "lucide-react";
import { categories, trendingTopics, siteConfig } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper,
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="bg-white/95 backdrop-blur-md border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">
                AI <span className="text-primary-500">TechHub</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50">
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50 flex items-center gap-1">
                  AI <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-secondary-200 p-2 animate-fade-in">
                    {categories.filter(c => ["artificial-intelligence", "programming", "software-reviews"].includes(c.slug)).map((cat) => {
                      const Icon = iconMap[cat.icon] || Brain;
                      return (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                            <Icon className="w-4 h-4" style={{ color: cat.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-secondary-900 group-hover:text-primary-500">{cat.name}</div>
                            <div className="text-xs text-secondary-500">{cat.articleCount}+ articles</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
              <Link href="/category/programming" className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50">
                Programming
              </Link>
              <Link href="/category/software-reviews" className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50">
                Reviews
              </Link>
              <Link href="/category/guides-tutorials" className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50">
                Guides
              </Link>
              <Link href="/tools" className="px-3 py-2 text-sm font-medium text-secondary-700 hover:text-primary-500 transition-colors rounded-lg hover:bg-primary-50">
                Tools
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-secondary-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/contact"
                className="hidden sm:flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Subscribe
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-secondary-500 hover:text-primary-500 rounded-lg"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-secondary-200 bg-white animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form action="/search" method="get" className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search articles, tools, tutorials..."
                  className="w-full pl-12 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-secondary-200 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Brain;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" style={{ color: cat.color }} />
                  <span className="text-sm font-medium text-secondary-700">{cat.name}</span>
                  <span className="text-xs text-secondary-400 ml-auto">{cat.articleCount}+</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
