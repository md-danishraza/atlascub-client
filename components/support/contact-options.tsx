"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { supportContacts } from "@/lib/constants/support";

const iconMap = {
  Mail,
  MessageCircle,
  Phone,
};

export function ContactOptions() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="heading-md font-primary">Still Need Help?</h2>
          <p className="mt-2 text-muted-foreground">
            Our support team is ready to assist you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supportContacts.map((contact, index) => {
            const Icon = iconMap[contact.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={contact.action}
                  target={contact.id === "email" ? "_self" : "_blank"}
                  className="block rounded-lg border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{contact.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                  <p className="mt-2 text-sm font-medium text-primary">
                    {contact.contact}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}