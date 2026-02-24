// convex/messages.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Send a message
export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      content: args.content,
      createdAt: Date.now(),
    });

    // Update conversation's lastMessageAt
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    // Update unread counts for other participants
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      for (const participantId of conversation.participants) {
        if (participantId !== args.senderId) {
          const unreadData = await ctx.db
            .query("unreadMessages")
            .withIndex("by_conversation_and_user", (q) =>
              q.eq("conversationId", args.conversationId).eq("userId", participantId)
            )
            .first();

          if (unreadData) {
            await ctx.db.patch(unreadData._id, {
              count: unreadData.count + 1,
            });
          }
        }
      }
    }

    // Clear typing status for sender
    const typingStatus = await ctx.db
      .query("typingStatus")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), args.senderId))
      .first();

    if (typingStatus) {
      await ctx.db.delete(typingStatus._id);
    }

    return messageId;
  },
});

// Get messages for a conversation
export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    // Get sender info for each message
    const messagesWithSender = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender,
        };
      })
    );

    return messagesWithSender;
  },
});

// Delete a message (soft delete)
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    
    // Only allow deleting own messages
    if (message && message.senderId === args.userId) {
      await ctx.db.patch(args.messageId, {
        isDeleted: true,
      });
    }
  },
});
