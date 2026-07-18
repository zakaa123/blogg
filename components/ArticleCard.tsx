import Link from "next/link";
import { Clock, Eye, User, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/data";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-secondary-100">
          <div className="relative h-64 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Featured
              </span>
            </div>
            <div className="absolute bottom-4 right-4">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-secondary-700 text-xs font-medium rounded-full">
                {article.readTime} min read
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 bg-primary-50 text-primary-600 text-xs font-medium rounded-md">
                {article.category}
              </span>
              <span className="text-xs text-secondary-400">{article.publishedAt}</span>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-secondary-500 mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary-200 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-secondary-500" />
                </div>
                <span className="text-xs text-secondary-500">{article.author.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-secondary-400">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{(article.views / 1000).toFixed(1)}K</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{article.readTime}m</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-secondary-100 h-full">
        <div className="relative h-44 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-secondary-700 text-xs font-medium rounded-full">
              {article.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-secondary-700 text-xs font-medium rounded-full">
              {article.readTime} min
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-bold text-secondary-900 mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-secondary-500 mb-3 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary-200 flex items-center justify-center">
                <User className="w-3 h-3 text-secondary-500" />
              </div>
              <span className="text-xs text-secondary-500">{article.author.name}</span>
            </div>
            <span className="text-xs text-secondary-400 flex items-center gap-1 group-hover:text-primary-500 transition-colors">
              Read <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ArticleCardHorizontal({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <article className="flex gap-4 p-4 bg-white rounded-xl border border-secondary-100 hover:shadow-md transition-all duration-300">
        <div className="w-28 h-20 flex-shrink-0 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-primary-500 font-medium">{article.category}</span>
          <h4 className="text-sm font-semibold text-secondary-900 mt-0.5 mb-1 group-hover:text-primary-500 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-secondary-400">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
