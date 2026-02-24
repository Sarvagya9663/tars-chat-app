"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { formatMessageTime } from "@/lib/utils";
import { MessageSquare, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ConversationSidebar({
  currentUserId,
}: {
  currentUserId: Id<"users">;
}) {
  const conversations = useQuery(api.conversations.getUserConversations, {
    userId: currentUserId,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversation");

  return (
    <aside className="hidden w-80 border-r bg-white md:block">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Messages</h2>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg p-2 hover:bg-gray-100"
              title="New conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {!conversations || conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">No conversations yet</p>
              <p className="mt-1 text-xs text-gray-400">
                Click + to start a new chat
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation) => {
                const isSelected =
                  selectedConversationId === conversation._id;
                const otherUser = conversation.otherUser;

                if (!otherUser) return null;

                return (
                  <button
                    key={conversation._id}
                    onClick={() =>
                      router.push(`/?conversation=${conversation._id}`)
                    }
                    className={cn(
                      "flex w-full gap-3 p-4 text-left transition-colors hover:bg-gray-50",
                      isSelected && "bg-blue-50 hover:bg-blue-50"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      {otherUser.imageUrl ? (
                        <Image
                          src={otherUser.imageUrl}
                          alt={otherUser.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                          {otherUser.name[0]}
                        </div>
                      )}
                      {otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-medium">{otherUser.name}</p>
                        {conversation.lastMessage && (
                          <span className="flex-shrink-0 text-xs text-gray-500">
                            {formatMessageTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm text-gray-600">
                          {conversation.lastMessage?.isDeleted
                            ? "Message deleted"
                            : conversation.lastMessage?.content ||
                              "Start a conversation"}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
