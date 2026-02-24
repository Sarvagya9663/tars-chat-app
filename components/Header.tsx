"use client";

import { UserButton } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Tars Chat</h1>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
