import { Metadata } from "next";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalSidebar } from "@/components/legal/legal-sidebar";
import { LegalSection } from "@/components/legal/legal-section";
import { LegalContactCard } from "@/components/legal/legal-contact-card";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

// 🛡️ Single Source of Truth Imports
import { companyInfo, shippingInfo, businessPolicies } from "@/lib/constants/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Atlascub",
  description: "Read Atlascub's terms and conditions governing the use of our website, purchases, and services.",
  robots: {
    index: false,
    follow: true,
  },
};

// ============================================================================
// 📑 LOCAL STRUCTS (Saves cross-file compilation conflicts)
// ============================================================================

const termsToc = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "account", title: "2. Account Registration" },
  { id: "orders", title: "3. Orders & Pricing" },
  { id: "payments", title: "4. Payments" },
  { id: "shipping", title: "5. Shipping & Delivery" },
  { id: "returns", title: "6. Returns & Refunds" },
  { id: "intellectual-property", title: "7. Intellectual Property" },
  { id: "user-content", title: "8. User Content" },
  { id: "prohibited-use", title: "9. Prohibited Use" },
  { id: "limitation-liability", title: "10. Limitation of Liability" },
  { id: "indemnification", title: "11. Indemnification" },
  { id: "governing-law", title: "12. Governing Law" },
  { id: "contact", title: "13. Contact Information" },
];

const policyDates = {
  effectiveFrom: "June 27, 2026",
};

const paymentMethods = [
  "Secure Prepaid Card Gateway (Visa, MasterCard, RuPay, Maestro)",
  "Unified Payments Interface (UPI - GPay, PhonePe, Paytm, etc.)",
  "Net Banking (All major Indian banks)",
  `Cash on Delivery (COD) - subject to regional eligibility and a flat ₹${shippingInfo.codFee} handling surcharge`
];

const legalInfo = {
  governingLaw: "Faridabad, Haryana, India"
};

// ============================================================================
// 🧠 MAIN COMPONENT WORKSPACE
// ============================================================================

export default function TermsOfServicePage() {
  const websiteUrl = "https://atlascub.in";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <SlugBreadcrumb />
      </div>

      <LegalHero
        title="Terms of Service"
        description="By accessing or using Atlascub, you agree to be bound by these terms and conditions."
        icon="file"
      />

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row">
          
          {/* Sidebar */}
          <aside className="lg:w-72 lg:shrink-0">
            <LegalSidebar items={termsToc} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8 select-none">
            {/* Effective Date */}
            <div className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground border border-border/40">
              <span className="font-semibold text-foreground">Effective Date:</span>{" "}
              {policyDates.effectiveFrom}
            </div>

            {/* Section 1 */}
            <LegalSection id="acceptance" title="1. Acceptance of Terms">
              <p className="leading-relaxed">
                By accessing or using the website{" "}
                <strong className="text-foreground">{websiteUrl}</strong> (the "Site"), you agree to be bound
                by these Terms of Service ("Terms"). If you do not agree to these Terms,
                please do not use the Site.
              </p>
              <p className="mt-3 leading-relaxed">
                We reserve the right to update or modify these Terms at any time without
                prior notice. Your continued use of the Site constitutes acceptance of any
                such changes.
              </p>
            </LegalSection>

            {/* Section 2 */}
            <LegalSection id="account" title="2. Account Registration">
              <p className="leading-relaxed">
                To place orders, you may need to complete authentication. You are responsible for
                maintaining the confidentiality of your session tokens and credentials, and for all
                activities that occur under your account profile.
              </p>
              <p className="mt-3 leading-relaxed">
                You agree to provide accurate, current, and complete shipping address and contact
                information, and to update it as necessary. We reserve the right to refuse
                service, terminate accounts, or cancel orders at our sole discretion.
              </p>
            </LegalSection>

            {/* Section 3 */}
            <LegalSection id="orders" title="3. Orders & Pricing">
              <p className="leading-relaxed">
                All orders are subject to acceptance and availability. We reserve the right
                to refuse or cancel any order for reasons including but not limited to:
                product availability, errors in pricing, or suspected payment fraud.
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Pricing:</strong> All prices are listed in Indian Rupees (INR) and are
                inclusive of applicable taxes unless otherwise stated. Prices may change
                without notice, but such changes will not affect already confirmed orders.
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Cancellation:</strong> You may cancel your order within{" "}
                <strong className="text-foreground">{businessPolicies.cancellationWindow}</strong> of purchase by contacting our
                client services support team. Orders that have already transitioned to active dispatch status cannot be cancelled.
              </p>
            </LegalSection>

            {/* Section 4 */}
            <LegalSection id="payments" title="4. Payments">
              <p className="leading-relaxed">We accept the following payment methods:</p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground">
                {paymentMethods.map((method, index) => (
                  <li key={index} className="text-sm font-medium">{method}</li>
                ))}
              </ul>
              <p className="mt-4 leading-relaxed">
                All prepaid card transactions and wallet procedures are processed securely through{" "}
                <strong className="text-foreground">{businessPolicies.paymentGateway}</strong>. We
                never store, view, or process your full payment credentials on our servers.
              </p>
            </LegalSection>

            {/* Section 5 */}
            <LegalSection id="shipping" title="5. Shipping & Delivery">
              <p className="leading-relaxed">
                <strong>Domestic Shipping:</strong> Orders are typically processed within 24 hours and delivered within{" "}
                <strong className="text-foreground">{shippingInfo.domesticShippingTime}</strong>. Metro locations may
                receive delivery sooner, averaging <strong className="text-foreground">{shippingInfo.metroCitiesTime}</strong>.
              </p>
              {shippingInfo.internationalShipping && (
                <p className="mt-3 leading-relaxed">
                  <strong>International Shipping:</strong> International orders typically
                  take <strong className="text-foreground">{shippingInfo.internationalShippingTime}</strong>.
                  Customs duties and import taxes are the responsibility of the customer.
                </p>
              )}
              <p className="mt-3 leading-relaxed">
                <strong>Complimentary Delivery:</strong> Orders of{" "}
                <strong className="text-foreground">₹{shippingInfo.freeShippingThreshold.toLocaleString('en-IN')}</strong> or more qualify for
                free standard delivery. Otherwise, a flat shipping fee of <strong className="text-foreground">₹{shippingInfo.shippingCost}</strong> applies.
              </p>
            </LegalSection>

            {/* Section 6 */}
            <LegalSection id="returns" title="6. Returns & Refunds">
              <p className="leading-relaxed">
                We offer standard returns and replacements within{" "}
                <strong className="text-foreground">{businessPolicies.returnWindow}</strong> from the date of delivery.
                To be eligible for a return, the garment must be{" "}
                <strong className="text-foreground">{businessPolicies.returnConditions}</strong>.
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Returns Process:</strong> Initiate returns through your customer account
                dashboard. After warehouse audit and approval, refunds will be processed within{" "}
                <strong className="text-foreground">{businessPolicies.refundTime}</strong> to the original payment
                method.
              </p>
              <p className="mt-3 leading-relaxed">
                <strong>Exchanges:</strong> {businessPolicies.exchangePolicy}
              </p>
            </LegalSection>

            {/* Section 7 */}
            <LegalSection id="intellectual-property" title="7. Intellectual Property">
              <p className="leading-relaxed">
                All content on this Site, including text, editorial campaign imagery, graphics, logos, and custom drapes designs, is
                the sole property of <strong className="text-foreground">{companyInfo.legalName}</strong> and is protected
                by Indian and international copyright and trademark laws.
              </p>
              <p className="mt-3 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works from any
                content without our express written permission.
              </p>
            </LegalSection>

            {/* Section 8 */}
            <LegalSection id="user-content" title="8. User Content">
              <p className="leading-relaxed">
                By submitting reviews, photos, or other content, you grant us a
                non-exclusive, royalty-free, perpetual license to use, modify, publish, and display such
                content for marketing and social media purposes.
              </p>
              <p className="mt-3 leading-relaxed">
                You represent that you own or have permission to submit the content and
                that it does not violate any third-party rights or privacy guidelines.
              </p>
            </LegalSection>

            {/* Section 9 */}
            <LegalSection id="prohibited-use" title="9. Prohibited Use">
              <p className="leading-relaxed">You agree not to use the Site for any unlawful purpose or to:</p>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground text-sm">
                <li>Violate any applicable local, state, or federal laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Transmit malware, viruses, or harmful malicious code</li>
                <li>Interfere with or compromise the security of the Site</li>
                <li>Attempt to gain unauthorized access to our database structures</li>
              </ul>
            </LegalSection>

            {/* Section 10 */}
            <LegalSection id="limitation-liability" title="10. Limitation of Liability">
              <p className="leading-relaxed">
                To the maximum extent permitted by law, <strong className="text-foreground">{companyInfo.legalName}</strong>{" "}
                shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of the Site or purchase of products.
              </p>
              <p className="mt-3 leading-relaxed">
                Our total liability shall not exceed the amount you paid for the product
                giving rise to the claim.
              </p>
            </LegalSection>

            {/* Section 11 */}
            <LegalSection id="indemnification" title="11. Indemnification">
              <p className="leading-relaxed">
                You agree to indemnify and hold harmless{" "}
                <strong className="text-foreground">{companyInfo.legalName}</strong> from any claims, damages, liabilities, or
                expenses arising from your violation of these Terms or infringement of any
                third-party rights.
              </p>
            </LegalSection>

            {/* Section 12 */}
            <LegalSection id="governing-law" title="12. Governing Law">
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws
                of India. Any disputes arising under these Terms shall be subject to the
                exclusive jurisdiction of the courts in{" "}
                <strong className="text-foreground">{legalInfo.governingLaw}</strong>.
              </p>
            </LegalSection>

            {/* Section 13 */}
            <LegalSection id="contact" title="13. Contact Information">
              <p className="leading-relaxed">For questions about these Terms, please contact us at:</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">{companyInfo.legalName}</strong>
                </p>
                <p>{companyInfo.address} - {companyInfo.pincode}</p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${companyInfo.email}`} className="text-primary hover:underline">
                    {companyInfo.email}
                  </a>
                </p>
              </div>
            </LegalSection>

            {/* Grievance Officer Contact */}
            <LegalContactCard />
          </div>

        </div>
      </div>
    </div>
  );
}