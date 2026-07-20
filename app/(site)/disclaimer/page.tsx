import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Disclaimer | ${siteConfig.name}`,
  description: `Disclaimer for ${siteConfig.name}. Important information about the content and services on our website.`,
};

export default function DisclaimerPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Disclaimer" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Disclaimer</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            The information provided by {siteConfig.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) on {siteConfig.url} is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
          </p>

          <h2>External Links Disclaimer</h2>
          <p>
            {siteConfig.url} may contain links to external websites that are not provided or maintained by or in any way affiliated with {siteConfig.name}. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>

          <h2>Affiliate Disclaimer</h2>
          <p>
            This site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates include but are not limited to various software companies, hosting providers, and AI tool developers. These affiliate relationships do not influence our editorial content or the products we choose to review.
          </p>
          <p>
            When we recommend products through affiliate links, we disclose this clearly within the content. Our recommendations are based on our independent research, testing, and genuine belief in the value of these products. We maintain editorial independence from all advertisers and affiliate partners.
          </p>

          <h2>Professional Disclaimer</h2>
          <p>
            The site cannot and does not contain professional technical advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional advice.
          </p>

          <h2>Product Reviews Disclaimer</h2>
          <p>
            Product reviews on {siteConfig.name} are based on our independent testing and evaluation. While we strive to provide accurate and honest reviews, individual results may vary. Product features, pricing, and availability are subject to change by the respective companies. We recommend visiting the official product websites for the most current information.
          </p>

          <h2>Errors and Omissions Disclaimer</h2>
          <p>
            While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, {siteConfig.name} is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information in this site is provided &quot;as is,&quot; with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information.
          </p>

          <h2>Fair Use Disclaimer</h2>
          <p>
            This site may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We believe this constitutes a &quot;fair use&quot; of any such copyrighted material for the purposes of news reporting, criticism, comment, and education. If you wish to use copyrighted material from this site for purposes that go beyond fair use, you must obtain permission from the copyright owner.
          </p>

          <h2>Views Expressed Disclaimer</h2>
          <p>
            The views and opinions expressed in any articles or content on {siteConfig.name} are those of the individual authors and do not necessarily reflect the official policy or position of {siteConfig.name} as a whole. Any content provided by our authors is their personal opinion and is not intended to malign any religion, ethnic group, club, organization, company, or individual.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
