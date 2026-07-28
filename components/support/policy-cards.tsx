"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, RefreshCw, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { policyCards } from "@/lib/constants/support";

const iconMap = {
  Truck,
  RefreshCw,
  Repeat,
};

export function PolicyCards() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="heading-md font-primary">Quick Policies</h2>
          <p className="mt-2 text-muted-foreground">
            Important information at a glance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {policyCards.map((card, index) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="h-full transition-all duration-300 hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{card.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {card.description}
                    </p>
                    <Link
                      href={card.link}
                      className="mt-3 inline-block text-sm font-medium text-primary transition-colors hover:underline"
                    >
                      Learn More →
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}