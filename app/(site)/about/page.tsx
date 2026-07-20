import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";
import { Users, Target, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name} - the team behind the #1 AI and technology resource for developers, students, and businesses.`,
};

const values = [
  { icon: Target, title: "Our Mission", description: "To provide accurate, in-depth, and unbiased reviews of AI tools and technology products, helping our readers make informed decisions." },
  { icon: Users, title: "Our Team", description: "A passionate team of developers, AI researchers, and tech writers with decades of combined experience in the technology industry." },
  { icon: Award, title: "Our Standards", description: "Every product we review is thoroughly tested by our team. We never accept payment for positive reviews, maintaining complete editorial independence." },
  { icon: Heart, title: "Our Community", description: "Over 200,000 monthly readers trust AI TechHub for honest, expert-backed technology insights and recommendations." },
];

const team = [
  { name: "Saikat Al Hasan", role: "Founder & Editor-in-Chief", bio: "Senior tech writer with 8+ years covering AI and software. Passionate about making technology accessible to everyone." },
  { name: "Sarah Johnson", role: "AI & ML Specialist", bio: "AI researcher and tech writer specializing in machine learning, generative AI, and emerging technologies." },
  { name: "Noman Ali", role: "Software Reviews Editor", bio: "Full-stack developer and software reviewer with expertise in web technologies, cloud services, and developer tools." },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "About Us" },
      ]} />

      {/* Hero */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">About {siteConfig.name}</h1>
        <p className="text-lg text-secondary-500 leading-relaxed">
          {siteConfig.name} is the ultimate resource for developers, students, and businesses looking to navigate the rapidly evolving world of artificial intelligence and technology. We provide expert reviews, in-depth tutorials, and actionable guides to help you make the most of modern tools and software.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">{v.title}</h3>
              <p className="text-sm text-secondary-500 leading-relaxed">{v.description}</p>
            </div>
          );
        })}
      </div>

      {/* Story */}
      <div className="bg-secondary-50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">Our Story</h2>
        <div className="space-y-4 text-secondary-600 leading-relaxed">
          <p>
            {siteConfig.name} was founded in 2022 with a simple goal: to help people understand and leverage the power of artificial intelligence. As AI tools began proliferating across every industry, we saw a need for honest, comprehensive reviews that go beyond marketing claims.
          </p>
          <p>
            Our team of developers, researchers, and writers personally tests every product we review. We spend hundreds of hours evaluating features, performance, pricing, and real-world usability before publishing our recommendations.
          </p>
          <p>
            Today, {siteConfig.name} serves over 200,000 monthly readers and has become one of the most trusted sources for AI tool reviews, programming tutorials, and technology guides. Our commitment to accuracy, transparency, and reader-first content has earned us a loyal community of developers, students, and business professionals.
          </p>
          <p>
            We believe that everyone should have access to clear, unbiased information about the technology tools that shape our world. That mission drives everything we do, from our detailed product reviews to our beginner-friendly tutorials.
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-secondary-900 mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl border border-secondary-100 p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary-500">{member.name[0]}</span>
              </div>
              <h3 className="text-lg font-bold text-secondary-900">{member.name}</h3>
              <p className="text-sm text-primary-500 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-secondary-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
