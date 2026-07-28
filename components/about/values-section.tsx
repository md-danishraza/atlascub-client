"use client";

import { motion } from "framer-motion";
import { aboutData } from "@/lib/constants/about";

export function ValuesSection() {
  const { values } = aboutData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-mono uppercase tracking-wider text-primary">
            What We Stand For
          </span>
          <h2 className="heading-lg font-primary mt-2">Our Core Values</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Principles that guide everything we create
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value) => (
            <motion.div
              key={value.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="mb-4 text-4xl">{value.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}