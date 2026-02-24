"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatArea } from "@/components/ChatArea";
import { UserList } from "@/components/UserList";
import { useUser } from "@clerk/nextjs";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation") as Id<"conversations"> | null;
  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // If no conversation selected, show user list
  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8">
          {currentUser && <UserList currentUserId={currentUser._id} />}
        </div>
      </div>
    );
  }

  // Show chat area
  return currentUser ? (
    <ChatArea conversationId={conversationId} currentUserId={currentUser._id} />
  ) : null;
}
