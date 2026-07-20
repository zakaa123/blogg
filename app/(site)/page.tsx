import Link from "next/link";
import { Search, ArrowRight, Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper, Users, FileText, Layers, Wrench } from "lucide-react";
import { articles, categories, trendingTopics, affiliateProducts, siteConfig } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";
import AffiliateCard from "@/components/AffiliateCard";

const iconMap: Record<string, React.ElementType> = {
  Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper,
};

const stats = [
  { label: "Articles", value: "1000+", icon: FileText },
  { label: "Monthly Readers", value: "200K+", icon: Users },
  { label: "Categories", value: "50+", icon: Layers },
  { label: "AI Tools Reviewed", value: "150+", icon: Wrench },
];

export default function HomePage() {
  const featuredArticles = articles.filter((a) => a.featured);
  const latestArticles = articles.slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 mb-6">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              The #1 AI & Technology Resource
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Discover the Best{" "}
              <span className="bg-gradient-to-r from-accent-300 to-primary-300 bg-clip-text text-transparent">
                AI Tools
              </span>{" "}
              & Technology Guides
            </h1>
            <p className="text-lg text-secondary-300 mb-8 max-w-2xl mx-auto">
              Expert reviews, tutorials, and in-depth guides to help you navigate the world of AI, programming, and software. Stay ahead with AI TechHub.
            </p>

            {/* Search Bar */}
            <form action="/search" method="get" className="max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search articles, tools, tutorials..."
                  className="w-full pl-12 pr-32 py-4 bg-white/95 border border-white/20 rounded-2xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-1.5"
                >
                  Search <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trending Topics */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-secondary-400">Trending:</span>
              {trendingTopics.slice(0, 6).map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs text-white/80 hover:text-white transition-all"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary-900">{stat.value}</div>
                    <div className="text-xs text-secondary-500">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Featured Articles</h2>
            <p className="text-sm text-secondary-500 mt-1">Hand-picked top articles from our editors</p>
          </div>
          <Link href="/category/artificial-intelligence" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} featured />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-secondary-50 border-y border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-secondary-900">Explore Categories</h2>
            <p className="text-sm text-secondary-500 mt-1">Browse articles by topic</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Brain;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group bg-white rounded-xl p-5 border border-secondary-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${cat.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-secondary-900 group-hover:text-primary-500 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-secondary-500 mt-1">{cat.articleCount}+ articles</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900">Latest Articles</h2>
            <p className="text-sm text-secondary-500 mt-1">Fresh content published daily</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Affiliate Products */}
      <section className="bg-secondary-50 border-y border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-secondary-900">Recommended Tools</h2>
            <p className="text-sm text-secondary-500 mt-1">Hand-picked products we trust and use</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {affiliateProducts.map((product) => (
              <AffiliateCard key={product.name} product={product} />
            ))}
          </div>
          <p className="text-center text-xs text-secondary-400 mt-6">* Some links are affiliate links. We may earn a commission at no extra cost to you.</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Newsletter />
      </section>
    </>
  );
}
