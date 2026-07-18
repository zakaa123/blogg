import Link from "next/link";
import { Brain, Mail, ArrowRight } from "lucide-react";
import { categories, siteConfig } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                AI <span className="text-primary-400">TechHub</span>
              </span>
            </Link>
            <p className="text-secondary-400 text-sm leading-relaxed mb-6">
              The ultimate AI & technology resource for developers, students & businesses. Discover tools, tutorials, and expert guides.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-secondary-400" />
              <span className="text-sm text-secondary-400">{siteConfig.email}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-300 mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-secondary-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-300 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-secondary-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-secondary-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/tools" className="text-sm text-secondary-400 hover:text-white transition-colors">AI Tools</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-secondary-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-secondary-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/editorial-policy" className="text-sm text-secondary-400 hover:text-white transition-colors">Editorial Policy</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-secondary-400 hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-300 mb-4">Newsletter</h3>
            <p className="text-sm text-secondary-400 mb-4">
              Get the latest AI news and updates delivered to your inbox every week.
            </p>
            <form className="space-y-3" action="/api/newsletter" method="post">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-lg text-sm text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-secondary-500 mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-500">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-secondary-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-secondary-500 hover:text-white transition-colors">Terms</Link>
              <Link href="/cookie-policy" className="text-xs text-secondary-500 hover:text-white transition-colors">Cookies</Link>
              <Link href="/dmca" className="text-xs text-secondary-500 hover:text-white transition-colors">DMCA</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
