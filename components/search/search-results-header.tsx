"use client";

import { Loader2, Sparkles, Cpu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchResultsHeaderProps {
  isLoading: boolean;
  resultCount: number;
  urlQuery: string;
}

export function SearchResultsHeader({ isLoading, resultCount, urlQuery }: SearchResultsHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        <span className="font-semibold text-foreground">{resultCount}</span> Results
        
        {urlQuery && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground ml-1">
                  <Cpu className="h-4 w-4 text-primary animate-pulse" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="p-3 bg-popover text-popover-foreground max-w-xs">
                <p className="font-bold text-xs">AI Hybrid Search Active</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                  We combined keyword token matching with 768-D pgvector semantic drapes context matching.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}