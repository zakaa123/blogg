import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Breadcrumbs } from "@/components/ArticleParts";

export const metadata: Metadata = {
  title: `DMCA Policy | ${siteConfig.name}`,
  description: `DMCA Policy and Copyright Infringement Notices for ${siteConfig.name}.`,
};

export default function DMCAPage() {
  const lastUpdated = "May 20, 2026";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "DMCA Policy" },
      ]} />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">DMCA Policy</h1>
        <p className="text-sm text-secondary-400 mb-8">Last updated: {lastUpdated}</p>

        <div className="prose prose-secondary max-w-none">
          <p>
            {siteConfig.name} respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (&quot;DMCA&quot;), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
          </p>

          <h2>Filing a DMCA Takedown Notice</h2>
          <p>
            If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please notify our copyright agent. For your complaint to be valid under the DMCA, you must provide the following information in writing:
          </p>
          <ul>
            <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity, and information reasonably sufficient to permit us to locate the material</li>
            <li>Contact information for the complaining party, including name, address, telephone number, and email address</li>
            <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
          </ul>

          <h2>Counter-Notification</h2>
          <p>
            If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have authorization from the copyright owner, the copyright owner&apos;s agent, or pursuant to law, to post and use the material, you may send a counter-notification containing the following information to our copyright agent:
          </p>
          <ul>
            <li>Your physical or electronic signature</li>
            <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content</li>
            <li>Your name, address, telephone number, and email address</li>
            <li>A statement that you consent to the jurisdiction of the federal court in which your address is located, and that you will accept service of process from the person who provided notification of the alleged infringement</li>
          </ul>

          <h2>Repeat Infringers</h2>
          <p>
            In accordance with the DMCA and other applicable law, we have adopted a policy of terminating, in appropriate circumstances, users who are deemed to be repeat infringers. We may also, at our sole discretion, limit access to the site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
          </p>

          <h2>Good Faith Belief</h2>
          <p>
            {siteConfig.name} operates in good faith. If you believe any content on our website infringes on your copyright, please contact us directly at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> before filing a formal DMCA notice. We will promptly investigate and take appropriate action, which may include removing or disabling access to the allegedly infringing material.
          </p>

          <h2>Modifications</h2>
          <p>
            We reserve the right to modify this DMCA Policy at any time. Changes will be posted on this page with an updated revision date. By continuing to use the site after any modifications, you accept the updated policy.
          </p>

          <h2>Contact Information</h2>
          <p>
            For DMCA notices and counter-notifications, please contact our designated copyright agent at: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
