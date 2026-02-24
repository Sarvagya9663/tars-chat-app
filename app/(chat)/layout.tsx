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

    // Set online on mount
    updateOnlineStatus({ userId: currentUser._id, isOnline: true });

    // Set offline on unmount
    return () => {
      updateOnlineStatus({ userId: currentUser._id, isOnline: false });
    };
  }, [currentUser, updateOnlineStatus]);

  // Handle page visibility (tab switching)
  useEffect(() => {
    if (!currentUser) return;

    const handleVisibilityChange = () => {
      const isOnline = !document.hidden;
      updateOnlineStatus({ userId: currentUser._id, isOnline });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser, updateOnlineStatus]);

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
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
