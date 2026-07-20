import type { Metadata } from "next";
import { affiliateProducts, siteConfig } from "@/lib/data";
import AffiliateCard from "@/components/AffiliateCard";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Best AI Tools & Software | ${siteConfig.name}`,
  description: `Discover the best AI tools, software, and services reviewed by experts at ${siteConfig.name}. Find the perfect tools for your needs.`,
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "AI Tools" },
      ]} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Best AI Tools & Software</h1>
        <p className="text-secondary-500">
          We test and review the best AI tools, software, and services to help you make informed decisions. Every product is independently reviewed by our experts.
        </p>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {affiliateProducts.map((product) => (
          <AffiliateCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
}
