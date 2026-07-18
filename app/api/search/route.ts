import { NextResponse } from "next/server";
import { articles } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ results: articles.slice(0, 10) });
  }

  const results = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.tags.some((t) => t.toLowerCase().includes(query))
  );

  return NextResponse.json({ results, total: results.length });
}
