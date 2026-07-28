"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import {  companyInfo } from "@/lib/constants/legal";

export function LegalContactCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 rounded-lg border border-border bg-card p-6 md:p-8"
    >
      <h3 className="heading-sm font-primary mb-4">Grievance Officer</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        In accordance with the Consumer Protection Act, 2019 and Information Technology
        (Intermediary Guidelines) Rules, 2021, the following is the contact information
        of our Grievance Officer:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </p>
            <a
              href={`mailto:${companyInfo.email}`}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {companyInfo.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Phone
            </p>
            <a
              href={`tel:${companyInfo.phone}`}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {companyInfo.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Response Time
            </p>
            <p className="text-sm text-foreground">within 24 hrs</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Address
            </p>
            <p className="text-sm text-foreground">{companyInfo.address}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}