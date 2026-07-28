"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, RefreshCw, HelpCircle, Ruler } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { quickSupportLinks } from "@/lib/constants/contact";


const iconMap = {
  Package,
  RefreshCw,
  HelpCircle,
  Ruler,
};

export function QuickSupportGrid() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="heading-md font-primary">Quick Solutions</h2>
          <p className="mt-2 text-muted-foreground">
            Find what you need — instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickSupportLinks.map((link, index) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link href={link.href}>
                  <Card className="h-full transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{link.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {link.description}
                      </p>
                      <span className="mt-3 inline-block text-sm font-medium text-primary">
                        {link.action}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}