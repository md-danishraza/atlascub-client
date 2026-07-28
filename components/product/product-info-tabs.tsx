"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductInfoTabsProps {
  details: string;
  sizing: string;
  shipping: string;
}

export function ProductInfoTabs({ details, sizing, shipping }: ProductInfoTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-muted/50">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="sizing">Sizing</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed">{details}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="sizing" className="mt-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed">{sizing}</p>
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="mt-4">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed">{shipping}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}