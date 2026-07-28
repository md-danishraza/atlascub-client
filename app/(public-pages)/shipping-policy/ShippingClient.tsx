"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, HelpCircle, AlertCircle, Coins, Clock, Globe } from "lucide-react";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

// Define shipping info inline or import from lib
const shippingInfo = {
  freeShippingThreshold: 5000,
  shippingCost: 200,
  codFee: 100,
  logisticsPartner: "Delhivery",
  metroCitiesTime: "2-3 business days",
  domesticShippingTime: "3-5 business days",
  regionalHaryanaTime: "1-2 business days",
  internationalShipping: false,
  internationalShippingTime: "7-14 business days",
};

const companyInfo = {
  email: "support@atlascub.in",
};

export default function ShippingPolicyPage() {
  const steps = [
    {
      icon: Clock,
      title: "1. Careful Processing & Dispatch",
      description: `Once your transaction completes, our studio carefully reviews, irons, wraps, and packs your garments. Processing is completed within 24 business hours.`,
    },
    {
      icon: ShieldCheck,
      title: "2. Real-Time Tracking Integration",
      description: `As soon as the package is handed over to our shipping partner (${shippingInfo.logisticsPartner}), a unique tracking code is attached to your account profile and emailed directly to your inbox.`,
    },
    {
      icon: Truck,
      title: "3. Direct Delivery To Your Door",
      description: `Metro locations typically receive their drapes in ${shippingInfo.metroCitiesTime}, while other domestic regions are completed securely in ${shippingInfo.domesticShippingTime}.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <SlugBreadcrumb />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-4 mt-8"
      >
        <div className="max-w-4xl">
          <h1 className="heading-xl font-primary">Shipping & Logistics Policy</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            We focus on delivering your garments with care. Explore our shipping windows, courier charges, and tracking guidelines.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
        {/* Shipping Rates Summary Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <CardWrapper title="Prepaid Logistics">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Standard prepaid orders over{" "}
              <strong className="text-foreground">
                ₹{shippingInfo.freeShippingThreshold.toLocaleString("en-IN")}
              </strong>{" "}
              ship completely free of cost. Orders below this threshold carry a flat fee of{" "}
              <strong className="text-foreground">
                ₹{shippingInfo.shippingCost.toLocaleString("en-IN")}
              </strong>{" "}
              applied automatically during checkout.
            </p>
          </CardWrapper>

          <CardWrapper title="Cash on Delivery (COD) Surcharge" icon={Coins}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To offset the high administrative costs and collection processes associated with COD shipments, a flat surcharge of{" "}
              <strong className="text-foreground">
                ₹{shippingInfo.codFee.toLocaleString("en-IN")}
              </strong>{" "}
              is applied. This fee is non-refundable.
            </p>
          </CardWrapper>
        </div>

        {/* Dynamic Timeline Steps */}
        <div className="space-y-8 mb-16">
          <h2 className="heading-sm font-primary mb-6">Our Delivery Pipeline</h2>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 md:gap-6 p-6 rounded-2xl border border-border/60 bg-card"
              >
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Geography Limitations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <CardWrapper title="Regional Delivery Speed" icon={Clock}>
            <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <li className="flex justify-between border-b pb-1.5 border-border/40">
                <span>Faridabad & Haryana:</span>
                <strong className="text-foreground">{shippingInfo.regionalHaryanaTime}</strong>
              </li>
              <li className="flex justify-between border-b pb-1.5 border-border/40">
                <span>Metro Cities:</span>
                <strong className="text-foreground">{shippingInfo.metroCitiesTime}</strong>
              </li>
              <li className="flex justify-between">
                <span>Rest of India:</span>
                <strong className="text-foreground">{shippingInfo.domesticShippingTime}</strong>
              </li>
            </ul>
          </CardWrapper>

          <CardWrapper title="International Shipping Restrictions" icon={Globe}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {shippingInfo.internationalShipping ? (
                `Yes, we support global shipping across select networks. Standard international transits average ${shippingInfo.internationalShippingTime}.`
              ) : (
                "Currently, our logistics network is strictly configured for domestic deliveries within India. We do not accept or process international shipping coordinates in our current phase."
              )}
            </p>
          </CardWrapper>
        </div>

        {/* Action Warning Box */}
        <div className="rounded-xl border border-border bg-muted/40 p-5 md:p-6 mb-16">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm space-y-1.5 text-muted-foreground">
              <p className="font-semibold text-foreground">Delivery Attempts Guidelines:</p>
              <p>
                Our courier partner makes up to 3 distinct delivery attempts before returning the package to our warehouse as a failed delivery. In the event of a failed delivery due to absolute customer unavailability or incorrect contact coordinates, return charges may apply before a subsequent redelivery can be processed.
              </p>
            </div>
          </div>
        </div>

        {/* Contact/Support Section */}
        <div className="text-center pt-8 border-t border-border/60">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-primary font-bold mb-2">Have shipping questions?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Our client services desk is always available to assist with logistics inquiries, delivery redirects, or delays.
          </p>
          <a
            href={`mailto:${companyInfo.email}`}
            className="inline-flex items-center justify-center bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            Email Support Desk
          </a>
        </div>
      </div>
    </div>
  );
}

// Simple internal wrapper card component
function CardWrapper({
  title,
  icon: Icon = Truck,
  children,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}