import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            At {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website {siteConfig.url} and use our services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We may collect information that you provide directly to us, such as when you subscribe to our newsletter, fill out a contact form, or interact with our content. This information may include your name, email address, and any other information you choose to provide.
          </p>
          <p>
            We also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, pages viewed, links clicked, and other browsing data. This information is collected through cookies and similar tracking technologies.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including to provide and maintain our website, to send you newsletters and marketing communications (with your consent), to respond to your inquiries and comments, to analyze website usage and improve our content and services, to detect and prevent fraud or unauthorized access, and to comply with legal obligations.
          </p>

          <h2>3. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device. You can control cookies through your browser settings, though disabling cookies may affect certain functionality of the website. We use both session cookies and persistent cookies to maintain your preferences and analyze traffic patterns.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            We may use third-party services such as Google Analytics, advertising networks, and email service providers. These third parties have their own privacy policies governing how they use information. We encourage you to review the privacy policies of these third-party services. We may also use affiliate links, which may result in third parties collecting information about your browsing habits.
          </p>

          <h2>5. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information to third parties. We may share your information with service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property, or safety.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data. To exercise any of these rights, please contact us at {siteConfig.email}. We will respond to your request within a reasonable timeframe.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the website after any modifications constitutes your acceptance of the updated policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
