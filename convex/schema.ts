import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { s } from "motion/react-client";

export default defineSchema({
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  sections: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  }),

  items: defineTable({
    sectionId: v.id("sections"),
    affiliateLink: v.string(),
    price: v.optional(v.string()),
    platform: v.string(), // "amazon", "flipkart", "nykaa", "meesho", "other"
    itemTitle: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_section", ["sectionId"]),

  catCounter: defineTable({
    count: v.number(),
  }),

  instagramConfig: defineTable({
    accessToken: v.string(),
    instagramAccountId: v.string(),
    lastTokenRefresh: v.number(),
    tokenExpiresAt: v.number(),
    rateLimitCallCount: v.number(),
    rateLimitResetTime: v.number(),
    lastApiCallTime: v.number(),
  }),

  reelMappings: defineTable({
    reelId: v.string(),
    reelUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    sectionId: v.id("sections"),
    keyword: v.string(),
    active: v.boolean(),
    maxItemsInDM: v.number(), // default: 10
    includeWebsiteLink: v.boolean(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_reel", ["reelId"])
    .index("by_active", ["active"]),

  dmJobs: defineTable({
    instagramUserId: v.string(),
    username: v.string(),
    sectionId: v.id("sections"),
    reelId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("duplicate") // commented twice
    ),
    createdAt: v.number(),
    scheduledFor: v.optional(v.number()), // worker attempt time
    attemptCount: v.number(),
    lastAttemptAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    triggerType: v.union(v.literal("comment"), v.literal("dm")),
    triggerId: v.string(), // commentId or messageId
    messageText: v.optional(v.string()),
    error: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_user_reel", ["instagramUserId", "reelId"]) // detect duplicates
    .index("by_scheduled", ["scheduledFor"]), // worker query

  commentLogs: defineTable({
    commentId: v.string(),
    reelId: v.string(),
    instagramUserId: v.string(),
    username: v.string(),
    commentText: v.string(),
    keyword: v.string(),
    sectionId: v.optional(v.id("sections")),
    dmSent: v.boolean(),
    dmError: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_comment", ["commentId"]),

  dmLogs: defineTable({
    instagramUserId: v.string(),
    username: v.string(),
    sectionId: v.id("sections"),
    messageText: v.string(),
    success: v.boolean(),
    error: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_user", ["instagramUserId"]),
});
