// convex/conversations.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or get existing conversation between two users
export const createOrGet = mutation({
  args: {
    participants: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Sort participants for consistent lookup
    const sortedParticipants = args.participants.sort();

    // Check if conversation already exists
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => {
        return q.eq(q.field("participants"), sortedParticipants);
      })
      .first();

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      participants: sortedParticipants,
      lastMessageAt: Date.now(),
    });

    // Initialize unread counts for both participants
    for (const participantId of args.participants) {
      await ctx.db.insert("unreadMessages", {
        userId: participantId,
        conversationId,
        count: 0,
        lastReadAt: Date.now(),
      });
    }

    return conversationId;
  },
});

// Get all conversations for a user
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      //.filter((q) => q.contains(q.field("participants"), args.userId))
      .order("desc")
      .collect();
      const filteredConversations = conversations.filter((conversation) =>
      conversation.participants.includes(args.userId)
    );

    // Get details for each conversation
    const conversationsWithDetails = await Promise.all(
      filteredConversations.map(async (conversation) => {
        // Get the other participant
        const otherParticipantId = conversation.participants.find(
          (id) => id !== args.userId
        );

        const otherUser = otherParticipantId
          ? await ctx.db.get(otherParticipantId)
          : null;

        // Get last message
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();

        // Get unread count
        const unreadData = await ctx.db
          .query("unreadMessages")
          .withIndex("by_conversation_and_user", (q) =>
            q.eq("conversationId", conversation._id).eq("userId", args.userId)
          )
          .first();

        return {
          ...conversation,
          otherUser,
          lastMessage,
          unreadCount: unreadData?.count || 0,
        };
      })
    );

    // Sort by last message time
    return conversationsWithDetails.sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );
  },
});

// Get conversation by ID
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

// Mark conversation as read
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadData = await ctx.db
      .query("unreadMessages")
      .withIndex("by_conversation_and_user", (q) =>
        q.eq("conversationId", args.conversationId).eq("userId", args.userId)
      )
      .first();

    if (unreadData) {
      await ctx.db.patch(unreadData._id, {
        count: 0,
        lastReadAt: Date.now(),
      });
    }
  },
});
