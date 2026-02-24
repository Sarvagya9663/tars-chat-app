"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

export function ChatArea({
  conversationId,
  currentUserId,
}: {
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
}) {
  const conversation = useQuery(api.conversations.getConversation, {
    conversationId,
  });
  const messages = useQuery(api.messages.list, { conversationId });
  const markAsRead = useMutation(api.conversations.markAsRead);
  const router = useRouter();

  // Get the other user
  const otherUserId = conversation?.participants.find(
    (id) => id !== currentUserId
  );
  const otherUser = useQuery(
    api.users.getUser,
    otherUserId ? { userId: otherUserId } : "skip"
  );

  // Mark conversation as read when opened
  useEffect(() => {
    markAsRead({ conversationId, userId: currentUserId });
  }, [conversationId, currentUserId, markAsRead]);

  if (!conversation || !otherUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="md:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative">
            {otherUser.imageUrl ? (
              <Image
                src={otherUser.imageUrl}
                alt={otherUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                {otherUser.name[0]}
              </div>
            )}
            {otherUser.isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          <div className="flex-1">
            <p className="font-medium">{otherUser.name}</p>
            <p className="text-xs text-gray-500">
              {otherUser.isOnline ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages || []}
        currentUserId={currentUserId}
        conversationId={conversationId}
      />

      {/* Input */}
      <MessageInput conversationId={conversationId} currentUserId={currentUserId} />
    </div>
  );
}
