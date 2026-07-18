"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-900 p-8 md:p-12">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-primary-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Subscribe to AI Weekly Digest
        </h2>
        <p className="text-secondary-300 mb-8">
          Get the latest AI news, tutorials, and expert insights delivered to your inbox every week. Join 78,000+ subscribers.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-accent-400 animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Thanks for subscribing! Check your inbox.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-xs text-secondary-500 mt-4">No spam. Unsubscribe anytime. We respect your privacy.</p>
      </div>
    </section>
  );
}
