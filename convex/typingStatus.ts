// convex/typingStatus.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Update typing status
export const updateTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingStatus = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingStatus) {
      await ctx.db.patch(existingStatus._id, {
        lastTypedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("typingStatus", {
        conversationId: args.conversationId,
        userId: args.userId,
        lastTypedAt: Date.now(),
      });
    }
  },
});

// Get typing users for a conversation
export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    currentUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const twoSecondsAgo = now - 2000; // 2 seconds

    const typingStatuses = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => 
        q.and(
          q.neq(q.field("userId"), args.currentUserId),
          q.gt(q.field("lastTypedAt"), twoSecondsAgo)
        )
      )
      .collect();

    // Get user info
    const typingUsers = await Promise.all(
      typingStatuses.map(async (status) => {
        return await ctx.db.get(status.userId);
      })
    );

    return typingUsers.filter((user) => user !== null);
  },
});

// Clear typing status (called when user stops typing or sends message)
export const clearTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingStatus = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingStatus) {
      await ctx.db.delete(existingStatus._id);
    }
  },
});
