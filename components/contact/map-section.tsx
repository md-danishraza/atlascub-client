"use client";

import { motion } from "framer-motion";
import { contactInfo } from "@/lib/constants/contact";

export function MapSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-border"
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191861.6582363018!2d77.18331783788084!3d28.409318181063092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdc15f5a424b1%3A0xe4f50576c850e0f2!2sFaridabad%2C%20Haryana!5e0!3m2!1sen!2sin!4v1780327751689!5m2!1sen!2sin"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Atlascub Studio Location"
        className="w-full"
      />
      <div className="bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          {contactInfo.address.studio} — {contactInfo.address.street}
        </p>
      </div>
    </motion.div>
  );
}