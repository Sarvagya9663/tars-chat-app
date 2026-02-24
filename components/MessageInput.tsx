"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send } from "lucide-react";

export function MessageInput({
  conversationId,
  currentUserId,
}: {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useMutation(api.messages.send);
  const updateTyping = useMutation(api.typingStatus.updateTyping);
  const clearTyping = useMutation(api.typingStatus.clearTyping);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle typing indicator
  const handleTyping = () => {
    // Update typing status
    updateTyping({ conversationId, userId: currentUserId });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to clear typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      clearTyping({ conversationId, userId: currentUserId });
    }, 2000);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Clear typing on unmount
  useEffect(() => {
    return () => {
      clearTyping({ conversationId, userId: currentUserId });
    };
  }, [conversationId, currentUserId, clearTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;

    setIsSending(true);
    const messageToSend = message;
    setMessage("");

    try {
      await sendMessage({
        conversationId,
        senderId: currentUserId,
        content: messageToSend,
      });
      
      // Clear typing status
      await clearTyping({ conversationId, userId: currentUserId });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore message on error
      setMessage(messageToSend);
    } finally {
      setIsSending(false);
    }

    // Focus back on textarea
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
}
