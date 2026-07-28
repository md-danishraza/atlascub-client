"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutData } from "@/lib/constants/about";

export function StorySection() {
  const { story } = aboutData;

  return (
    <section className="py-20 md:py-28 bg-background/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src={story.image}
                alt="Atlascub story"
                fill
                className="object-cover"
              />
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-secondary/20 blur-2xl -z-10" />
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="text-sm font-mono uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h2 className="heading-lg font-primary mt-2 mb-6">{story.title}</h2>
            <div className="space-y-4">
              {story.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Signature or quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <p className="font-primary text-lg italic text-foreground">
                "Clothing that carries the weight of history but sits light on the skin."
              </p>
             
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}