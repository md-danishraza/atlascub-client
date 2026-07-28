"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Here you would call your actual API endpoint
    // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })

    setIsSubmitted(true);
    setIsLoading(false);
    setEmail("");

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-4xl bg-card border border-border rounded-2xl px-6 py-10 md:py-14 md:px-10 lg:px-12 text-center overflow-hidden shadow-sm"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none -ml-16 -mb-16" />
          
          {/* Subtle Border Gradient */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5 md:space-y-6">
            {/* Icon */}
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <Mail className="h-5 w-5" />
            </div>

            {/* Title */}
            <h2 className="heading-lg md:heading-xl font-primary font-semibold text-foreground tracking-tight">
              Join the Atlascub Circle
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              We write quarterly circular letters detailing custom raw textile harvests, new season campaign lookbooks, and select private archival sale drops. No spam.
            </p>

            {/* Form with Animation */}
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 pt-3 md:pt-4"
                >
                  <div className="relative flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your personal email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 md:h-12 border-border bg-muted/30 px-4 placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary rounded-md outline-none text-sm font-body transition-all duration-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium tracking-wide text-xs uppercase rounded-md shadow-sm transition-all duration-300 shrink-0 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Synchronizing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center gap-3 p-5 md:p-6 border border-border bg-muted/50 rounded-xl"
                >
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-primary font-semibold text-base text-foreground">You are on the list</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We have queued a verification welcome email to your inbox.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Complimentary shipping is attached to your first order</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}