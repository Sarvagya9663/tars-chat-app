"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/utils";
import { ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Message = {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
  content: string;
  createdAt: number;
  isDeleted?: boolean;
  sender: any;
};

export function MessageList({
  messages,
  currentUserId,
  conversationId,
}: {
  messages: Message[];
  currentUserId: Id<"users">;
  conversationId: Id<"conversations">;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const prevMessageCountRef = useRef(messages.length);

  // Get typing users
  const typingUsers = useQuery(api.typingStatus.getTypingUsers, {
    conversationId,
    currentUserId,
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is near bottom
  const checkIfNearBottom = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 100;
    
    setIsNearBottom(isNear);
    setShowScrollButton(!isNear && messages.length > 0);
  };

  // Auto-scroll on new messages if near bottom
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && isNearBottom) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, isNearBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [conversationId]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkIfNearBottom);
    return () => container.removeEventListener("scroll", checkIfNearBottom);
  }, [messages.length]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Loader2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-sm text-gray-500">No messages yet</p>
          <p className="text-xs text-gray-400">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto px-4 py-6"
      >
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;
            const showAvatar =
              index === 0 ||
              messages[index - 1].senderId !== message.senderId;

            return (
              <div
                key={message._id}
                className={cn(
                  "flex gap-2",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                {!isOwnMessage && showAvatar && (
                  <div className="flex-shrink-0">
                    {message.sender?.imageUrl ? (
                      <Image
                        src={message.sender.imageUrl}
                        alt={message.sender.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                        {message.sender?.name?.[0]}
                      </div>
                    )}
                  </div>
                )}

                {!isOwnMessage && !showAvatar && <div className="w-8" />}

                <div
                  className={cn(
                    "max-w-xs rounded-2xl px-4 py-2 lg:max-w-md",
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                  )}
                >
                  {message.isDeleted ? (
                    <p className="italic text-gray-400">Message deleted</p>
                  ) : (
                    <p className="break-words">{message.content}</p>
                  )}
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUsers && typingUsers.length > 0 && (
            <div className="flex gap-2">
              <div className="flex-shrink-0">
                {typingUsers[0]?.imageUrl ? (
                  <Image
                    src={typingUsers[0].imageUrl}
                    alt={typingUsers[0].name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    {typingUsers[0]?.name?.[0]}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
