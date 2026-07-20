import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { articles, siteConfig } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Search | ${siteConfig.name}`,
  description: `Search articles, tutorials, and guides on ${siteConfig.name}.`,
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query } = await searchParams;
  const searchQuery = query?.trim() || "";

  const results = searchQuery
    ? articles.filter((a) => {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Search" },
      ]} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Search Articles</h1>
        <form action="/search" method="get" className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search articles, tools, tutorials..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-200 rounded-2xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
          />
        </form>
      </div>

      {searchQuery ? (
        <>
          <p className="text-sm text-secondary-500 mb-6">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{searchQuery}&rdquo;
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-secondary-400" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">No results found</h2>
              <p className="text-sm text-secondary-500">Try different keywords or browse our categories.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-2">Start searching</h2>
          <p className="text-sm text-secondary-500">Enter a query above to find articles, tutorials, and guides.</p>
        </div>
      )}
    </div>
  );
}
