"use client";

import { motion } from "framer-motion";
import { aboutData } from "@/lib/constants/about";

export function JourneyTimeline() {
  const { journey } = aboutData;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-mono uppercase tracking-wider text-primary">
            Our Evolution
          </span>
          <h2 className="heading-lg font-primary mt-2">The Journey So Far</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Milestones that shaped our story
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

          {journey.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-6 md:left-1/2 top-2 h-3 w-3 rounded-full bg-primary -translate-x-1/2 hidden md:block" />
              <div className="md:hidden absolute left-6 top-2 h-3 w-3 rounded-full bg-primary" />

              {/* Content */}
              <div
                className={`w-full md:w-[calc(50%-2rem)] pl-12 md:pl-0 ${
                  index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                }`}
              >
                <div className="p-6 rounded-xl bg-card border border-border">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-mono text-primary mb-1">{item.year}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}