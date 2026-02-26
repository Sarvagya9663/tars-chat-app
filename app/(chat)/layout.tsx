"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { Header } from "@/components/Header";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const storeUser = useMutation(api.users.store);
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);
  
  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Store/update user in Convex when they sign in
  useEffect(() => {
    if (user) {
      storeUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
      });
    }
  }, [user, storeUser]);

  // Update online status
  useEffect(() => {
    if (!currentUser) return;

    updateOnlineStatus({ userId: currentUser._id, isOnline: true });

    return () => {
      updateOnlineStatus({ userId: currentUser._id, isOnline: false });
    };
  }, [currentUser, updateOnlineStatus]);

  // Handle page visibility
  useEffect(() => {
    if (!currentUser) return;

    const handleVisibilityChange = () => {
      updateOnlineStatus({ 
        userId: currentUser._id, 
        isOnline: !document.hidden 
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser, updateOnlineStatus]);

  // Show loading until we have current user
  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-4 text-sm text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar currentUserId={currentUser._id} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}