"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

// Animation variants for smooth transitions
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const ChatInterface = () => {
  // State management
  const { address: walletAddress } = useAccount();
  interface Message {
    role: string;
    message: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat history fetch effect
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `/api/chat/history?walletAddress=${walletAddress}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (walletAddress) {
      fetchChatHistory();
    }
  }, [walletAddress]);

  const handleSendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newMessage.trim() || !walletAddress) return;

    setIsLoading(true);
    const userMessage = newMessage.trim();
    setMessages((prev) => [...prev, { role: "user", message: userMessage }]);
    setNewMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, userMessage }),
      });

      const data = await response.json();
      if (response.ok && data.botResponse) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", message: data.botResponse },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            "Sorry, I encountered an error processing your message. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-900/20 to-gray-900/40"></div>
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob"></div>
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-indigo-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Chat Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        <Card className="w-full max-w-4xl mx-auto min-h-[600px] backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] shadow-xl">
          <CardContent className="flex flex-col h-full p-6">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                        : "bg-white/[0.05] border border-white/[0.05] text-blue-100"
                    }`}
                  >
                    <ReactMarkdown className="prose prose-invert">
                      {msg.message}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.05] border-white/[0.05] text-blue-100 placeholder-blue-200/50 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={isLoading || !newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
