"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { aboutData } from "@/lib/constants/about";

export function TeamSection() {
  const { team } = aboutData;

  if (team.length === 0) return null;

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
            Meet The Team
          </span>
          <h2 className="heading-lg font-primary mt-2">Behind the Brand</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            The creative minds shaping Atlascub
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group text-center"
            >
              <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full bg-muted mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
              <p className="text-sm text-primary mt-1">{member.role}</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}