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
  const { user, isLoaded } = useUser();

  const storeUser = useMutation(api.users.store);
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);

  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Store user in Convex
  useEffect(() => {
    if (!user) return;

    storeUser({
      clerkId: user.id,
      name: user.fullName || user.firstName || "User",
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl,
    });
  }, [user, storeUser]);

  // Online status
  useEffect(() => {
    if (!currentUser) return;

    updateOnlineStatus({ userId: currentUser._id, isOnline: true });

    return () => {
      updateOnlineStatus({ userId: currentUser._id, isOnline: false });
    };
  }, [currentUser, updateOnlineStatus]);

  // Tab visibility
  useEffect(() => {
    if (!currentUser) return;

    const handleVisibilityChange = () => {
      updateOnlineStatus({
        userId: currentUser._id,
        isOnline: !document.hidden,
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser, updateOnlineStatus]);

  // 🔥 FIXED LOADING LOGIC

  // Clerk still loading
  if (!isLoaded) {
    return null;
  }

  // Convex query still loading
  if (currentUser === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // User not yet stored → wait
  if (currentUser === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        Setting up user...
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