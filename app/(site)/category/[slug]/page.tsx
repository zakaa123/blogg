import type { Metadata } from "next";
import CategoryContent from "@/components/CategoryContent";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `Category | ${siteConfig.name}`,
  description: "Browse articles by category",
};

export default function CategoryPage() {
  return <CategoryContent />;
}
