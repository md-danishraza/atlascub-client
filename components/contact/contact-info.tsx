"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

import { contactInfo } from "@/lib/constants/contact";
import { companyInfo } from "@/lib/constants/legal";

export function ContactInfo() {
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Email Section */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Email Us</h3>
        </div>
        <div className="mt-3 space-y-2 pl-13">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              General Inquiries
            </p>
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {contactInfo.email.support}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Support
            </p>
            <a
              href={`mailto:${contactInfo.email.support}`}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {contactInfo.email.support}
            </a>
          </div>
        
        </div>
      </div>

      {/* WhatsApp Section */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Message on WhatsApp</h3>
        </div>
        <div className="mt-3 pl-13">
          <a
            href={`https://wa.me/${contactInfo.phone.whatsapp.replace(/\s/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground transition-colors hover:text-primary"
          >
            {contactInfo.phone.whatsapp}
          </a>
          <p className="mt-1 text-xs text-muted-foreground">
            Typically replies within a few hours
          </p>
        </div>
      </div>

      {/* Hours Section */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Support Hours</h3>
        </div>
        <div className="mt-3 space-y-1 pl-13 text-sm">
          <p>
            <span className="text-muted-foreground">Weekdays:</span>{" "}
            {contactInfo.hours.weekdays}
          </p>
          <p>
            <span className="text-muted-foreground">Weekends:</span>{" "}
            {contactInfo.hours.weekend}
          </p>
        </div>
      </div>

      {/* Studio Address */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Visit Our Studio</h3>
        </div>
        <div className="mt-3 pl-13">
          <p className="text-sm text-foreground">{contactInfo.address.studio}</p>
          <p className="text-sm text-muted-foreground">{contactInfo.address.street}</p>
          <p className="text-sm text-muted-foreground">{contactInfo.address.city}</p>
          <p className="text-sm text-muted-foreground">{contactInfo.address.country}</p>
          <a
            href={contactInfo.address.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-primary transition-colors hover:underline"
          >
            Get Directions →
          </a>
        </div>
      </div>
    </motion.div>
  );
}