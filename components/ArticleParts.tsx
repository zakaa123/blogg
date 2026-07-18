"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TOCItem, FAQ } from "@/lib/data";

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-secondary-100 p-5 sticky top-24">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wider">Table of Contents</h3>
        {isOpen ? <ChevronUp className="w-4 h-4 text-secondary-400" /> : <ChevronDown className="w-4 h-4 text-secondary-400" />}
      </button>
      {isOpen && (
        <nav className="mt-4 space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm text-secondary-500 hover:text-primary-500 transition-colors py-1 border-l-2 border-transparent hover:border-primary-500 ${
                item.level === 3 ? "pl-4" : "pl-0"
              }`}
            >
              {item.title}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="text-sm font-medium text-secondary-900 pr-4">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-4 h-4 text-secondary-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-5 pb-5 text-sm text-secondary-600 leading-relaxed animate-fade-in">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-secondary-400 mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-secondary-300">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-500 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-secondary-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function AuthorBox({ author }: { author: { name: string; bio: string; social?: { twitter?: string; linkedin?: string; github?: string } } }) {
  return (
    <div className="bg-white rounded-xl border border-secondary-100 p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary-500">{author.name[0]}</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-secondary-900">{author.name}</h4>
          <p className="text-sm text-secondary-500 mt-1">{author.bio}</p>
          {author.social && (
            <div className="flex items-center gap-3 mt-3">
              {author.social.twitter && (
                <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-400 hover:text-primary-500 transition-colors">Twitter</a>
              )}
              {author.social.linkedin && (
                <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-400 hover:text-primary-500 transition-colors">LinkedIn</a>
              )}
              {author.social.github && (
                <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary-400 hover:text-primary-500 transition-colors">GitHub</a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
