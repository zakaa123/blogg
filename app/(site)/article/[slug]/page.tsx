import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, siteConfig } from "@/lib/data";
import { Breadcrumbs, TableOfContents, FAQSection, AuthorBox } from "@/components/ArticleParts";
import { ArticleCard } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.seoTitle,
      description: article.metaDescription,
      url: `${siteConfig.url}/article/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.metaDescription,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedArticles = articles
    .filter((a) => a.categorySlug === article.categorySlug && a.id !== article.id)
    .slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `${siteConfig.url}${article.image}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/article/${article.slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: article.category, item: `${siteConfig.url}/category/${article.categorySlug}` },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  const faqSchema = article.faqs && article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: article.category, href: `/category/${article.categorySlug}` },
          { label: article.title },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-secondary-400">{article.publishedAt}</span>
                {article.rating && (
                  <span className="text-xs text-amber-500 font-medium">★ {article.rating}/5</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-lg text-secondary-500 mb-6">{article.excerpt}</p>

              {/* Author & Meta */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-secondary-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-500">{article.author.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-secondary-900">{article.author.name}</div>
                    <div className="text-xs text-secondary-400">{article.readTime} min read · {article.views.toLocaleString()} views</div>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary-400 mr-1">Share:</span>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteConfig.url}/article/${article.slug}`)}&text=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-secondary-400 hover:text-[#1DA1F2] hover:bg-secondary-50 rounded-lg transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.url}/article/${article.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-secondary-400 hover:text-[#1877F2] hover:bg-secondary-50 rounded-lg transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${siteConfig.url}/article/${article.slug}`)}&title=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-secondary-400 hover:text-[#0A66C2] hover:bg-secondary-50 rounded-lg transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </header>

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-secondary-900 prose-p:text-secondary-600 prose-a:text-primary-500 prose-strong:text-secondary-900 prose-li:text-secondary-600 mb-10"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-secondary-100">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-secondary-50 text-secondary-600 text-xs font-medium rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Pros & Cons */}
            {(article.pros || article.cons) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {article.pros && article.pros.length > 0 && (
                  <div className="bg-accent-50 rounded-xl p-6 border border-accent-100">
                    <h3 className="text-sm font-bold text-accent-700 uppercase tracking-wider mb-3">Pros</h3>
                    <ul className="space-y-2">
                      {article.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm text-secondary-700">
                          <svg className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {article.cons && article.cons.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3">Cons</h3>
                    <ul className="space-y-2">
                      {article.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm text-secondary-700">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* FAQ */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Frequently Asked Questions</h2>
                <FAQSection faqs={article.faqs} />
              </div>
            )}

            {/* Author Box */}
            <div className="mb-10">
              <AuthorBox author={article.author} />
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            <Newsletter />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {article.tableOfContents.length > 0 && (
              <TableOfContents items={article.tableOfContents} />
            )}

            {/* Affiliate CTA */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">Top AI Tools</h3>
              <p className="text-sm text-white/80 mb-4">Explore our curated list of the best AI tools reviewed by experts.</p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
              >
                View All Tools →
              </Link>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-xl border border-secondary-100 p-5">
              <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {articles.slice(0, 5).map((a) => (
                  <Link key={a.id} href={`/article/${a.slug}`} className="block group">
                    <h4 className="text-sm font-medium text-secondary-700 group-hover:text-primary-500 transition-colors line-clamp-2">{a.title}</h4>
                    <span className="text-xs text-secondary-400">{a.readTime} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
