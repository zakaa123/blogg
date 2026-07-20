import ArticleContent from "@/components/ArticleContent";
import { siteConfig } from "@/lib/data";

export const metadata = {
  title: `Article | ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function ArticlePage() {
  return <ArticleContent />;
}
