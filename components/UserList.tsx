"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Search, User as UserIcon } from "lucide-react";
import Image from "next/image";

export function UserList({ currentUserId }: { currentUserId: Id<"users"> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const createOrGetConversation = useMutation(api.conversations.createOrGet);

  const users = useQuery(
    api.users.searchUsers,
    searchTerm
      ? { searchTerm, currentUserId }
      : { searchTerm: "", currentUserId }
  );

  const allUsers = useQuery(api.users.getAllUsers, { currentUserId });

  const displayUsers = searchTerm ? users : allUsers;

  const handleUserClick = async (userId: Id<"users">) => {
    const conversationId = await createOrGetConversation({
      participants: [currentUserId, userId],
    });
    router.push(`/?conversation=${conversationId}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Start a Conversation</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* User List */}
      <div className="space-y-2">
        {!displayUsers || displayUsers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm ? "No users found" : "No other users yet"}
            </p>
          </div>
        ) : (
          displayUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
            >
              <div className="relative">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    {user.name[0]}
                  </div>
                )}
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
