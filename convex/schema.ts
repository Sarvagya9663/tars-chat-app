// convex/schema.ts
// Database schema for the chat application

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced from Clerk
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    isOnline: v.boolean(),
    lastSeen: v.number(), // timestamp
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_is_online", ["isOnline"]),

  // Conversations table - represents a chat between users
  conversations: defineTable({
    // Array of user IDs participating in this conversation
    participants: v.array(v.id("users")),
    // Timestamp of last message for sorting
    lastMessageAt: v.number(),
    // For group chats (optional feature)
    isGroup: v.optional(v.boolean()),
    groupName: v.optional(v.string()),
  })
    .index("by_last_message", ["lastMessageAt"])
    .index("by_participants", ["participants"]),

  // Messages table
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    // For soft delete (optional feature #11)
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"]),

  // Typing status - for real-time typing indicators
  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    lastTypedAt: v.number(), // timestamp
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),

  // Unread messages tracking
  unreadMessages: defineTable({
    userId: v.id("users"), // who hasn't read
    conversationId: v.id("conversations"),
    count: v.number(),
    lastReadAt: v.number(), // timestamp of last read
  })
    .index("by_user", ["userId"])
    .index("by_conversation_and_user", ["conversationId", "userId"]),

  // Message reactions (optional feature #12)
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(), // "👍", "❤️", "😂", "😮", "😢"
  })
    .index("by_message", ["messageId"])
    .index("by_user_and_message", ["userId", "messageId"]),
});
