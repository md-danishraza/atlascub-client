import React from "react";
import { Metadata } from "next";
import {  ShieldAlert, Mail, Phone, Shield } from "lucide-react";

// 🛡️ Single Source of Truth Imports
import { companyInfo, shippingInfo, businessPolicies } from "@/lib/constants/legal";
import { LegalSidebar } from "@/components/legal/legal-sidebar";

export const metadata: Metadata = {
  title: "Privacy Policy | Atlascub",
  description: "Learn how Atlascub collects, uses, and protects your personal information. Your privacy is important to us.",
  robots: {
    index: false,
    follow: true,
  },
};

const privacyToc = [
  { id: "information-collect", title: "1. Information We Collect" },
  { id: "how-we-use", title: "2. How We Use Your Information" },
  { id: "ai-chatbot-data", title: "3. AI Chatbot & Styling Memory" },
  { id: "cookies", title: "4. Cookies & Tracking" },
  { id: "sharing", title: "5. Information Sharing" },
  { id: "data-security", title: "6. Data Security" },
  { id: "user-rights", title: "7. Your Rights" },
  { id: "third-party", title: "8. Third-Party Links" },
  { id: "children-privacy", title: "9. Children's Privacy" },
  { id: "policy-changes", title: "10. Changes to This Policy" },
  { id: "contact-us", title: "11. Contact Us" },
];

const policyDates = {
  effectiveFrom: "June 27, 2026",
};

// ============================================================================
// 🎨 INLINED SHARED LAYOUT COMPONENTS (Ensures 100% build-safety)
// ============================================================================

function SlugBreadcrumb() {
  return (
    <nav className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2 py-2">
      <span className="hover:text-primary transition-colors cursor-pointer">Home</span>
      <span>/</span>
      <span className="hover:text-primary transition-colors cursor-pointer">Legal</span>
      <span>/</span>
      <span className="text-foreground font-semibold">Privacy Policy</span>
    </nav>
  );
}

interface LegalHeroProps {
  title: string;
  description: string;
  icon: string;
}

function LegalHero({ title, description }: LegalHeroProps) {
  return (
    <div className="bg-muted/40 border-b border-border/40 py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-primary font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border/40 pb-8 last:border-0 last:pb-0">
      <h2 className="text-xl md:text-2xl font-primary font-bold text-foreground mb-4">
        {title}
      </h2>
      <div className="text-sm md:text-base text-muted-foreground leading-relaxed font-light font-body space-y-4">
        {children}
      </div>
    </section>
  );
}

function LegalContactCard() {
  return (
    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 mt-12">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-primary font-bold text-foreground">
              Grievance & Privacy Officer
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              In accordance with Information Technology Act 2000 and rules made thereunder, the contact coordinates of our Grievance Officer are:
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
            <div className="space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">Officer Name:</p>
              <p>Md Danish Raza</p>
              <p className="text-xs">Client Relations & Compliance Director</p>
            </div>
            
            <div className="space-y-1 text-muted-foreground">
              <p className="font-semibold text-foreground">Contact coordinates:</p>
              <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> {companyInfo.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {companyInfo.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const websiteUrl = "https://atlascub.in";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6 max-w-7xl">
        <SlugBreadcrumb />
      </div>

      <LegalHero
        title="Privacy Policy"
        description="Your privacy is important to us. This policy details how we collect, process, and protect your personal information."
        icon="shield"
      />

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Sidebar - Table of Contents */}
          <aside className="lg:w-72 lg:shrink-0">
            <LegalSidebar items={privacyToc} />
          </aside>

          {/* Main Content Workspace */}
          <div className="flex-1 space-y-8 select-none">
            {/* Last Updated Note */}
            <div className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground border border-border/40">
              <span className="font-semibold text-foreground">Effective Date:</span>{" "}
              {policyDates.effectiveFrom}
            </div>

            {/* Section 1 */}
            <LegalSection id="information-collect" title="1. Information We Collect">
              <p className="leading-relaxed">
                We collect information you provide directly to us when you create an account, purchase garments, or contact our support desks. This data includes:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm pl-2">
                <li>Name, email address, phone number, and physical shipping addresses.</li>
                <li>Transactional payment records (processed securely via {businessPolicies.paymentGateway}).</li>
                <li>Order history, styling preferences, selected sizes, and color palettes.</li>
                <li>Messages, form submissions, and logs exchanged with our client services desk.</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We also automatically gather basic analytical parameters about your device, including your IP address, browser type, and navigation flow histories to optimize platform loading speeds.
              </p>
            </LegalSection>

            {}
            <LegalSection id="how-we-use" title="2. How We Use Your Information">
              <p className="leading-relaxed">We utilize your personal parameters to coordinate services including:</p>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm pl-2">
                <li>Processing payments and shipping packages securely to your destination address.</li>
                <li>Dispatching order confirmations and automated Shiprocket tracking updates.</li>
                <li>Personalizing product catalog views and sizes recommendations.</li>
                <li>Improving our tailoring, drapes structures, and sizing guidelines.</li>
                <li>Detecting, preventing, and addressing payment fraud or security incidents.</li>
              </ul>
            </LegalSection>

            {/* Section 3 (AI Chatbot Specific Compliance) */}
            <LegalSection id="ai-chatbot-data" title="3. AI Chatbot & Styling Memory">
              <p className="leading-relaxed">
                Our platform features an **AI-Powered Personal Stylist and Wardrobe Assistant**. To deliver real-time personalized styling instructions and garment recommendations matching your vibe, our system processes conversational data as follows:
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Interaction Memory:</strong> When you converse with our stylist, your inputs are matched against our catalog embeddings database (processed locally in PostgreSQL via the `pgvector` HNSW index). The assistant references your past 5 chat messages to maintain context during a session.
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Data Deletion & Privacy:</strong> Conversations are bound securely to your validated Clerk user profile. We do not sell or share your styling queries. You have absolute control over this data: you can completely delete your styling chat history at any moment by clicking the "Clear Memory" trash toggle in the chatbot header.
              </p>
            </LegalSection>

            {}
            <LegalSection id="cookies" title="4. Cookies & Tracking Technologies">
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
              <p className="mt-3 leading-relaxed">
                Types of cookies we use include:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm pl-2">
                <li><strong>Essential Cookies:</strong> Required to maintain login status and cart persistence.</li>
                <li><strong>Analytics Cookies:</strong> Help us study traffic and navigation speeds.</li>
                <li><strong>Functional Cookies:</strong> Remember your selected gender or sizing preferences.</li>
              </ul>
            </LegalSection>

            {/* Section 5 */}
            <LegalSection id="sharing" title="5. Information Sharing">
              <p className="leading-relaxed">
                We respect your personal space. We do not sell, rent, or lease your private parameters to third parties. We only share specific data necessary to coordinate fulfillment operations with:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm pl-2">
                <li>Logistics providers (such as {shippingInfo.logisticsPartner}) to ship your orders.</li>
                <li>Payment processors (specifically {businessPolicies.paymentGateway}) to authorize transactions.</li>
                <li>Cloud database hosts (such as Supabase and AWS) to secure your user records.</li>
                <li>Law enforcement or regulatory authorities when strictly required by applicable statutes.</li>
              </ul>
            </LegalSection>

            {}
            <LegalSection id="data-security" title="6. Data Security">
              <p className="leading-relaxed">
                We implement industry-standard security measures, including SSL encryption, token validation, and secure firewalls, to protect your personal information.
              </p>
              <p className="mt-3 leading-relaxed">
                All financial transactions are handled securely by **{businessPolicies.paymentGateway}**. We never store, process, or view your full credit card credentials on our servers.
              </p>
            </LegalSection>

            {/* Section 7 */}
            <LegalSection id="user-rights" title="7. Your Rights">
              <p className="leading-relaxed">Under applicable personal data protection laws, you retain the following rights:</p>
              <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm pl-2">
                <li>The right to inspect and access the personal data we store.</li>
                <li>The right to modify, correct, or update inaccurate details in your profile.</li>
                <li>The right to request the complete deletion of your user account and addresses.</li>
                <li>The right to opt-out of marketing circulars or emails at any moment.</li>
                <li>The right to wipe chatbot dialog histories and semantic cookies.</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                To exercise any of these rights, please reach out to us at <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline">{companyInfo.email}</a>.
              </p>
            </LegalSection>

            {}
            <LegalSection id="third-party" title="8. Third-Party Links">
              <p className="leading-relaxed">
                Our site may occasionally contain links to external third-party pages (such as Shiprocket tracking links). We do not control and are not responsible for the privacy practices of those external entities. We encourage you to read their policies.
              </p>
            </LegalSection>

            {/* Section 9 */}
            <LegalSection id="children-privacy" title="9. Children's Privacy">
              <p className="leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal details from children. If we identify that a minor has provided information, we will immediately take steps to wipe those records from our servers.
              </p>
            </LegalSection>

            {}
            <LegalSection id="policy-changes" title="10. Changes to This Policy">
              <p className="leading-relaxed">
                We may modify this Privacy Policy from time to time to align with new legal requirements or chatbot integrations. We will notify you of any material changes by posting the updated guidelines on this page and revising the effective date above.
              </p>
            </LegalSection>

            {/* Section 11 */}
            <LegalSection id="contact-us" title="11. Contact Us">
              <p className="leading-relaxed">For any questions or concerns regarding these privacy guidelines, contact us at:</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">{companyInfo.legalName}</strong></p>
                <p>{companyInfo.address} - {companyInfo.pincode}</p>
                <p>Email: <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline">{companyInfo.email}</a></p>
              </div>
            </LegalSection>

            {/* Grievance & Privacy Officer Contact */}
            <LegalContactCard />
          </div>

        </div>
      </div>
    </div>
  );
}