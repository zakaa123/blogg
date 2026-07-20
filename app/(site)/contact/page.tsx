import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";
import { Mail, MessageSquare, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team. We'd love to hear from you.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]} />

      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Contact Us</h1>
        <p className="text-secondary-500">
          Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-sm font-bold text-secondary-900 mb-1">Email</h3>
            <p className="text-sm text-secondary-500">{siteConfig.email}</p>
          </div>
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-sm font-bold text-secondary-900 mb-1">Response Time</h3>
            <p className="text-sm text-secondary-500">We typically respond within 24-48 hours.</p>
          </div>
          <div className="bg-white rounded-xl border border-secondary-100 p-5">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-sm font-bold text-secondary-900 mb-1">Location</h3>
            <p className="text-sm text-secondary-500">Remote-first team worldwide</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form className="bg-white rounded-xl border border-secondary-100 p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1.5">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1.5">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1.5">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder="Write your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
