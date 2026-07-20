"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/ArticleParts";
import { Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { categories as fallbackCategories } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Brain, Code, Star, Globe, TrendingUp, Cloud, BookOpen, Newspaper,
};

interface FirestoreArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  categorySlug?: string;
  author?: string;
  status?: string;
  views?: number;
  featured?: boolean;
  thumbnail?: string;
  readTime?: number;
  createdAt?: { seconds: number; nanoseconds: number };
}

interface FirestoreCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  articleCount?: number;
}

export default function CategoryContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [articles, setArticles] = useState<FirestoreArticle[]>([]);
  const [category, setCategory] = useState<FirestoreCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesSnap, categoriesSnap] = await Promise.all([
          getDocs(query(collection(db, "articles"), where("categorySlug", "==", slug), orderBy("createdAt", "desc"))),
          getDocs(collection(db, "categories")),
        ]);

        const cats = categoriesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreCategory[];
        const foundCategory = cats.find((c) => c.slug === slug);

        if (!foundCategory) {
          const fallbackCat = fallbackCategories.find((c) => c.slug === slug);
          if (fallbackCat) {
            setCategory({ id: fallbackCat.slug, ...fallbackCat });
          } else {
            setNotFound(true);
            return;
          }
        } else {
          setCategory(foundCategory);
        }

        const arts = articlesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as FirestoreArticle[];
        setArticles(arts);
      } catch {
        const fallbackCat = fallbackCategories.find((c) => c.slug === slug);
        if (fallbackCat) {
          setCategory({ id: fallbackCat.slug, ...fallbackCat });
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (notFoundState) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">Category Not Found</h1>
        <p className="text-secondary-500 mb-6">The category you are looking for does not exist.</p>
        <Link href="/" className="text-primary-500 hover:text-primary-600 font-medium">Go Home →</Link>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-200 rounded w-48" />
          <div className="h-4 bg-secondary-100 rounded w-96" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-secondary-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (!category) return null;

  const Icon = iconMap[category.icon || ""] || Brain;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: category.name },
      ]} />

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${category.color || "#2563EB"}15` }}>
            <Icon className="w-7 h-7" style={{ color: category.color || "#2563EB" }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">{category.name}</h1>
            <p className="text-secondary-500 mt-1">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary-400">
          <span>{articles.length} articles</span>
          <span>·</span>
          <span>Updated regularly</span>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
