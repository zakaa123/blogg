import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { articles as hardcodedArticles, categories as hardcodedCategories } from "@/lib/data";

export async function seedFirestore(): Promise<{ articles: number; categories: number }> {
  let articlesSeeded = 0;
  let categoriesSeeded = 0;

  const existingArticles = await getDocs(collection(db, "articles"));
  if (existingArticles.empty) {
    for (const article of hardcodedArticles) {
      const docRef = doc(db, "articles", article.id);
      await setDoc(docRef, {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        categorySlug: article.categorySlug,
        tags: article.tags,
        author: article.author.name,
        status: "published",
        views: article.views,
        featured: article.featured,
        thumbnail: article.image,
        imageAlt: article.imageAlt,
        metaTitle: article.seoTitle,
        metaDescription: article.metaDescription,
        focusKeyword: article.keywords[0] || "",
        readTime: article.readTime,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      articlesSeeded++;
    }
  }

  const existingCategories = await getDocs(collection(db, "categories"));
  if (existingCategories.empty) {
    for (const category of hardcodedCategories) {
      const docRef = doc(db, "categories", category.slug);
      await setDoc(docRef, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        createdAt: serverTimestamp(),
      });
      categoriesSeeded++;
    }
  } else {
    const articlesSnap = await getDocs(collection(db, "articles"));
    const counts: Record<string, number> = {};
    articlesSnap.docs.forEach((d) => {
      const data = d.data();
      const slug = data.categorySlug || "";
      if (slug) counts[slug] = (counts[slug] || 0) + 1;
    });

    for (const catDoc of existingCategories.docs) {
      const catData = catDoc.data();
      const correctCount = counts[catData.slug] || 0;
      if (catData.articleCount !== correctCount) {
        await updateDoc(doc(db, "categories", catDoc.id), { articleCount: correctCount });
        categoriesSeeded++;
      }
    }
  }

  return { articles: articlesSeeded, categories: categoriesSeeded };
}
