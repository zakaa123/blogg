
import { Star, ExternalLink } from "lucide-react";
import type { AffiliateProduct } from "@/lib/data";

export default function AffiliateCard({ product }: { product: AffiliateProduct }) {
  return (
    <div className="bg-white rounded-xl border border-secondary-100 p-6 hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary-500">{product.name[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-secondary-700">{product.rating}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-md">
        {product.category}
      </span>
      <h3 className="text-lg font-bold text-secondary-900 mt-2 mb-1">{product.name}</h3>
      <p className="text-sm text-secondary-500 mb-4">{product.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.features.slice(0, 3).map((f) => (
          <span key={f} className="text-xs bg-secondary-50 text-secondary-600 px-2 py-0.5 rounded-md">{f}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-secondary-100 mt-auto gap-2">
        <span className="text-base font-bold text-secondary-900 truncate" title={product.price}>{product.price}</span>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center gap-1.5 bg-primary-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap flex-shrink-0"
        >
          View Details <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="text-[10px] text-secondary-400 mt-3">* Affiliate link. We may earn a commission.</p>
    </div>
  );
}
