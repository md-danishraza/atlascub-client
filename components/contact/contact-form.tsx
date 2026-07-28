"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import apiClient from "@/lib/store/apis/axios-client";


interface FormData {
  name: string;
  email: string;
  orderNumber: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields explicitly
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast.error("Please fill out all required fields marked with an asterisk (*).");
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error("Your message must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        orderNumber: formData.orderNumber.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim(),
      };

      await apiClient.post("/communication/contact", payload);

      setIsSuccess(true);
      toast.success("Support ticket compiled. A receipt has been sent to your email!");
      
      // Clear form inputs
      setFormData({
        name: "",
        email: "",
        orderNumber: "",
        subject: "",
        message: "",
      });

      // Clear the visual success checkbox state after a brief delay
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error("Failed to submit support inquiry:", error);
      const errorMsg = error.response?.data?.message || "Failed to deliver message. Please check your internet connection.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-border bg-card p-6 md:p-8 self-start shadow-sm"
    >
      <div className="mb-6">
        <h2 className="heading-sm font-primary">Send a Message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number (Optional)</Label>
            <Input
              id="orderNumber"
              placeholder="ATC12345678"
              value={formData.orderNumber}
              onChange={(e) =>
                setFormData({ ...formData, orderNumber: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order Inquiry</SelectItem>
                <SelectItem value="product">Product Question</SelectItem>
                <SelectItem value="return">Return/Exchange</SelectItem>
                <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            placeholder="How can we help you?"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            disabled={isSubmitting}
          />
        </div>

        {}
        <Button
          type="submit"
          disabled={isSubmitting || isSuccess}
          className="w-full gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Message Sent!
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </motion.div>
  );
}