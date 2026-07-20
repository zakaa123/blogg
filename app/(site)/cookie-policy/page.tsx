import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Cookie Policy | ${siteConfig.name}`,
  description: `Cookie Policy for ${siteConfig.name}. Learn about the cookies we use and how to manage your preferences.`,
};

export default function CookiePolicyPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Cookie Policy" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            This Cookie Policy explains how {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar technologies when you visit our website at {siteConfig.url}. By using our website, you consent to the use of cookies as described in this policy.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies help us understand how you use our site and allow us to improve your browsing experience.
          </p>

          <h2>Types of Cookies We Use</h2>
          <p><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic features like page navigation, access to secure areas, and form submissions. The website cannot function properly without these cookies.</p>
          <p><strong>Analytics Cookies:</strong> We use analytics cookies, such as those provided by Google Analytics, to understand how visitors interact with our website. These cookies collect information about the number of visitors, traffic sources, pages visited, and other metrics that help us improve our site.</p>
          <p><strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third-party providers whose services we have added to our pages.</p>
          <p><strong>Advertising Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and device.</p>

          <h2>Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the site. These third-party cookies include Google Analytics for website analytics and various advertising networks for relevant content delivery.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can typically find these settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser. You can set your browser to:
          </p>
          <ul>
            <li>Accept all cookies</li>
            <li>Notify you when a cookie is set</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
          <p>
            Please note that disabling cookies may affect the functionality of this and many other websites you visit. Blocking all cookies may result in reduced functionality of our website and other sites.
          </p>

          <h2>Impact of Disabling Cookies</h2>
          <p>
            If you choose to disable cookies, certain features of our website may not function properly. For example, you may not be able to access certain areas of the site, use the search functionality, or access personalized content. We encourage you to keep cookies enabled for the best browsing experience.
          </p>

          <h2>Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. Any changes will be posted on this page with an updated revision date. We encourage you to review this Cookie Policy periodically.
          </p>

          <h2>More Information</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
