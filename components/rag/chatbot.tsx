"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Minimize2, 
  Maximize2,
  ShoppingBag,
  
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Import RTK Query endpoints
import { 
  useGetChatHistoryQuery, 
  useChatStyleAdvisorMutation, 
  useClearChatHistoryMutation 
} from "@/lib/store/apis/rag-api";


import styles from "./Chatbot.module.css";
import { InlineProductCard } from "./inline-product-card-chatbot";



// ============================================================================
// 🧠 CHATBOT STATEFUL WORKSPACE CONTAINER
// ============================================================================

export function Chatbot() {
  const { isSignedIn } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. RTK query listeners
  const { 
    data: chatHistory = [], 
    isLoading: isHistoryLoading, 
    refetch: refetchHistory 
  } = useGetChatHistoryQuery(undefined, { skip: !isOpen });

  const [askStylist, { isLoading: isResponding }] = useChatStyleAdvisorMutation();
  const [clearHistory] = useClearChatHistoryMutation();

  // Scroll to bottom whenever history expands or agent is typing
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory, isResponding, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isResponding) return;

    setInputValue("");
    
    try {
      await askStylist({ message: text }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to parse styling recommendation. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleWipeHistory = async () => {
    try {
      await clearHistory().unwrap();
      toast.success("Stylist chat history cleared");
    } catch (err) {
      toast.error("Failed to clear chat memory");
    }
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setIsMinimized(false);
  };

  // Only render floating assets if the user is authenticated
  if (!isSignedIn) return null;

  return (
    <div className={styles.chatbotContainer}>
      
      {/* 🔮 FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button 
          onClick={toggleOpen} 
          className={cn(styles.floatingButton, "shadow-[#9b2c2c]/10")}
          aria-label="Open Atlascub Stylist Assistant"
        >
          <MessageCircle className={styles.floatingIcon} />
          <span className={styles.statusDot} />
        </button>
      )}

      {/* 💬 THE ACTIVE PANEL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={cn(
              styles.chatModal,
              isMinimized && styles.chatModalMinimized
            )}
          >
            {/* 1. Panel Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerLeft}>
                <Sparkles className={styles.headerIcon} />
                <div className="flex flex-col text-left">
                  <span className={styles.headerTitle}>Atlascub Stylist</span>
                  <span className="text-[9px] text-[#fdf2d6]/70 uppercase tracking-widest leading-none font-bold">RAG Powered</span>
                </div>
              </div>
              
              <div className={styles.headerActions}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={toggleMinimize} className={styles.headerButton}>
                        {isMinimized ? (
                          <Maximize2 className="h-4 w-4" />
                        ) : (
                          <Minimize2 className="h-4 w-4" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{isMinimized ? "Expand" : "Minimize"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={handleWipeHistory} className={styles.headerButton}>
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Clear memory</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <button onClick={toggleOpen} className={styles.headerButton}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 2. Messages Canvas */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollAreaRef}
                  className={styles.messagesArea}
                  data-lenis-prevent="true"
                >
                  {isHistoryLoading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Loading styling memory...</span>
                    </div>
                  ) : chatHistory.length === 0 ? (
                    
                    /* Empty Conversational State */
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIconWrapper}>
                        <Sparkles className={styles.emptyIcon} />
                      </div>
                      <h3 className={styles.emptyTitle}>Your Wardrobe Assistant</h3>
                      <p className={styles.emptyText}>
                        Greetings. I am your personal stylist. Ask me to pair resort wear, explore handlooms, or style drapes to coordinate your perfect silhouette.
                      </p>
                      
                      <div className="w-full space-y-2 mt-4">
                        <p className={styles.suggestionsTitle}>Suggested Inquiries:</p>
                        <div className={styles.suggestionsGrid}>
                          {[
                            "Recommend breathable shirts for summer",
                            "What should I style with linen pleated trousers?",
                            "Show me some traditional festive drapes"
                          ].map((q) => (
                            <button 
                              key={q} 
                              onClick={() => handleSuggestedQuestion(q)} 
                              className={styles.suggestionButton}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    
                    /* Active Conversational Ledger stream */
                    <div className="space-y-6">
                      {chatHistory.map((item) => (
                        <div key={item.id} className="space-y-4">
                          {/* User Message */}
                          <div className={cn(styles.messageWrapper, styles.messageUser)}>
                            <div className={cn(styles.messageBubble, styles.messageUserBubble)}>
                              <p className="text-sm font-medium leading-relaxed">{item.question}</p>
                            </div>
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarFallback className="bg-muted text-xs font-bold uppercase">You</AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Assistant Response */}
                          <div className={cn(styles.messageWrapper, styles.messageAssistant)}>
                            <Avatar className="h-8 w-8 shrink-0 border border-primary/20 bg-primary/10">
                              <AvatarFallback className="text-primary text-xs font-bold">AC</AvatarFallback>
                            </Avatar>
                            <div className={cn(styles.messageBubble, styles.messageAssistantBubble)}>
                              <div className="prose prose-sm dark:prose-invert leading-relaxed max-w-none text-left">
                                <ReactMarkdown>{item.answer}</ReactMarkdown>
                              </div>

                              {/* Inline Sourced Product Card Grid */}
                              {item.productIds && item.productIds.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-bold">
                                    <ShoppingBag className="h-3 w-3" /> Sourced Apparel:
                                  </p>
                                  <div className="grid grid-cols-1 gap-2 mt-2">
                                    {item.productIds.map((pId) => (
                                      <InlineProductCard key={pzpOrderFixId(pId)} productId={pId} />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Loading/Typing Indicator */}
                      {isResponding && (
                        <div className={cn(styles.messageWrapper, styles.messageAssistant)}>
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">AC</AvatarFallback>
                          </Avatar>
                          <div className={cn(styles.messageBubble, styles.messageAssistantBubble)}>
                            <div className={styles.typingIndicator}>
                              <span className={styles.typingDot} />
                              <span className={styles.typingDot} />
                              <span className={styles.typingDot} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Input Area */}
              <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask about materials, fits, drapes..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={styles.input}
                    disabled={isResponding}
                  />
                  <button 
                    onClick={handleSendMessage} 
                    disabled={isResponding || !inputValue.trim()} 
                    className={styles.sendButton}
                    title="Send Styling Query"
                  >
                    {isResponding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className={styles.inputFooter}>
                  AI Assistant. Powered by Google Gemini-2 & pgvector similarity scales.
                </p>
              </div>
            </>
          )}

          {/* Minimized Action Overlay */}
          {isMinimized && (
            <div className={styles.minimizedContent} onClick={toggleMinimize}>
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Personal Stylist is ready. <strong className="underline underline-offset-2">Click to expand</strong></span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
}

// Helper to sanitize any raw index parameters or composite key issues from API IDs
function pzpOrderFixId(id: string) {
  return id ? id.toString() : Math.random().toString();
}