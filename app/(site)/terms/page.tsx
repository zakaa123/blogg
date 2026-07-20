import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: `Terms and Conditions governing the use of ${siteConfig.name} and its services.`,
};

export default function TermsPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Terms & Conditions" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Terms & Conditions</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            Welcome to {siteConfig.name}. By accessing or using our website at {siteConfig.url} and any related services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using {siteConfig.name}, you accept and agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access or use our website. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of any changes.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            All content on {siteConfig.name}, including but not limited to text, graphics, logos, images, articles, reviews, software, and other material, is the property of {siteConfig.name} or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from this website without prior written permission.
          </p>

          <h2>3. User Conduct</h2>
          <p>
            You agree to use {siteConfig.name} only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the website. You must not use our website to transmit any unsolicited or unauthorized advertising, spam, or any other form of solicitation. You must not attempt to gain unauthorized access to any part of the website or its systems.
          </p>

          <h2>4. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, {siteConfig.name} makes no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information, products, services, or related graphics contained on the website. Any reliance you place on such information is strictly at your own risk.
          </p>

          <h2>5. Affiliate Links and Commissions</h2>
          <p>
            {siteConfig.name} participates in affiliate marketing programs. This means we may earn commissions on purchases made through our links to retailer sites. This comes at no additional cost to you and helps support our content creation. Our editorial content is not influenced by affiliate partnerships, and we only recommend products we genuinely believe in.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall {siteConfig.name}, its owners, contributors, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website. This includes any loss of profits, data, or other intangible losses. Your use of the website and any content is at your sole risk.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services that are not owned or controlled by {siteConfig.name}. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites. We strongly advise you to read the terms and privacy policies of any third-party site you visit.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend access to our website immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions. All provisions of these terms shall survive termination, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which {siteConfig.name} operates, without regard to its conflict of law provisions. Any disputes arising from or relating to these terms shall be resolved through binding arbitration.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
