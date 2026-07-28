'use client';

import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  // Accept both raw component types (e.g., Package) AND instantiated elements (e.g., <Package className="..." />)
  icon?: React.ElementType | React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ title, description, icon = Package, action }: EmptyStateProps) {
  // Determine if the passed icon is already a JSX element
  const isReactElement = React.isValidElement(icon);
  // If it's not an element, treat it as a component reference
  const IconComponent = !isReactElement ? (icon as React.ElementType) : null;

  return (
    <div className="flex min-h-[480px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-2xs transition-all duration-300 hover:shadow-xs">
      {/* Dynamic Animated Graphic Circle */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/40 text-secondary-foreground animate-pulse duration-4000">
        {isReactElement ? (
          icon // Render custom JSX directly
        ) : (
          IconComponent && <IconComponent className="h-10 w-10 text-primary animate-bounce duration-3000" />
        )}
      </div>
      
      {/* Brand Elegant Heading */}
      <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h3>
      
      {/* Detail Copywriting */}
      <p className="mt-2.5 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Primary Action Trigger */}
      {action && (
        <div className="mt-8 animate-fade-in duration-500">
          <Button asChild size="lg" className="rounded-md px-8 py-6 font-medium tracking-wide shadow-sm hover:shadow-md transition-all">
            {action.onClick ? (
              <button onClick={action.onClick}>{action.label}</button>
            ) : (
              <Link href={action.href || "#"}>{action.label}</Link>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}