"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
  const [isUserStored, setIsUserStored] = useState(false);

  const storeUser = useMutation(api.users.store);
  const updateOnlineStatus = useMutation(api.users.updateOnlineStatus);

  // Store user FIRST
  useEffect(() => {
    if (!user) return;

    const store = async () => {
      await storeUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
      });
      setIsUserStored(true);
    };

    store();
  }, [user, storeUser]);

  // Only run query AFTER user is stored
  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id && isUserStored ? { clerkId: user.id } : "skip"
  );

  // Online status
  useEffect(() => {
    if (!currentUser) return;

    updateOnlineStatus({ userId: currentUser!._id, isOnline: true });

    return () => {
      updateOnlineStatus({ userId: currentUser!._id, isOnline: false });
    };
  }, [currentUser, updateOnlineStatus]);

  if (!isLoaded) return null;

  if (!isUserStored || currentUser === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ConversationSidebar currentUserId={currentUser!._id} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}