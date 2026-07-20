import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `Editorial Policy | ${siteConfig.name}`,
  description: `Our editorial standards and policies at ${siteConfig.name}. Learn how we create, review, and publish content.`,
};

export default function EditorialPolicyPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Editorial Policy" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Editorial Policy</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            At {siteConfig.name}, editorial integrity is the foundation of everything we do. This Editorial Policy outlines the standards, processes, and principles that guide how we create, review, and publish content on our website. Our goal is to provide our readers with accurate, unbiased, and valuable information they can trust.
          </p>

          <h2>Editorial Independence</h2>
          <p>
            We maintain strict editorial independence from all advertisers, sponsors, and affiliate partners. No external entity has the right to influence, alter, or veto our editorial content. While we do participate in affiliate programs and may receive commissions from product referrals, these relationships never determine what we review, how we review it, or what conclusions we draw.
          </p>
          <p>
            Our editorial team operates independently from our business and advertising teams. The decision to publish, update, or remove content is made solely by our editors based on journalistic merit and reader value.
          </p>

          <h2>Content Standards</h2>
          <p>
            All content published on {siteConfig.name} must meet the following standards:
          </p>
          <ul>
            <li><strong>Accuracy:</strong> All facts, statistics, and claims must be verified through primary sources or reliable third-party data. We correct errors promptly and transparently.</li>
            <li><strong>Fairness:</strong> We present multiple perspectives on topics and give subjects of reviews a fair opportunity to respond to our findings.</li>
            <li><strong>Transparency:</strong> We clearly disclose any potential conflicts of interest, including affiliate relationships, sponsored content, and partnerships.</li>
            <li><strong>Independence:</strong> Our opinions and recommendations are based solely on our research, testing, and expertise — never on financial incentives.</li>
          </ul>

          <h2>Review Process</h2>
          <p>
            Every product review on {siteConfig.name} follows a rigorous evaluation process. Our reviewers personally use and test each product for a minimum period before writing a review. We evaluate products across multiple criteria including features, performance, pricing, ease of use, customer support, and value for money.
          </p>
          <p>
            Reviews are reviewed by at least one additional editor before publication to ensure accuracy, fairness, and adherence to our editorial standards. We update reviews periodically to reflect product changes, new features, and updated pricing.
          </p>

          <h2>AI-Generated Content</h2>
          <p>
            {siteConfig.name} may use AI tools to assist with research, drafting, or editing. However, all AI-generated content is thoroughly reviewed, fact-checked, and edited by human editors before publication. We do not publish unreviewed AI-generated content. Any content substantially assisted by AI tools will be clearly disclosed.
          </p>

          <h2>Corrections and Retractions</h2>
          <p>
            We are committed to correcting errors promptly and transparently. If you find an error in any of our content, please contact us at {siteConfig.email}. We will review the claim and make corrections as appropriate. For significant errors, we will add a correction notice at the top of the article. In rare cases where content is fundamentally flawed, we may issue a retraction.
          </p>

          <h2>Sponsored Content</h2>
          <p>
            Any sponsored content on {siteConfig.name} will be clearly labeled as such. Sponsored content does not reflect the views or opinions of {siteConfig.name} and is created in collaboration with the sponsoring entity. We retain editorial control over all sponsored content to ensure it meets our quality standards and is clearly distinguishable from editorial content.
          </p>

          <h2>Editorial Team</h2>
          <p>
            Our editorial team consists of experienced technology journalists, developers, and AI researchers. Each team member has deep expertise in their coverage areas. All editorial decisions are made by our senior editors, who collectively ensure consistency and quality across all content.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about our editorial policies or want to report a concern about the accuracy or fairness of our content, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
