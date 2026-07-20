import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, categories, siteConfig } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/ArticleParts";
import { Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper,
};

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} - Articles & Guides | ${siteConfig.name}`,
    description: category.description,
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description: category.description,
      url: `${siteConfig.url}/category/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryArticles = articles.filter((a) => a.categorySlug === slug);
  const Icon = iconMap[category.icon] || Brain;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: category.name },
      ]} />

      {/* Category Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${category.color}15` }}>
            <Icon className="w-7 h-7" style={{ color: category.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{category.name}</h1>
            <p className="text-secondary-500 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary-400">
          <span>{categoryArticles.length} articles</span>
          <span>·</span>
          <span>Updated regularly</span>
        </div>
      </div>

      {/* Articles Grid */}
      {categoryArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-secondary-500">No articles found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
