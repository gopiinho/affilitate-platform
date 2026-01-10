import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    failedLoginAttempts: v.number(),
    lastFailedLogin: v.optional(v.number()),
    accountLocked: v.boolean(),
    accountLockedUntil: v.optional(v.number()),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
    lastUsedAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

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
    maxItemsInDM: v.number(),
    includeWebsiteLink: v.boolean(),
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

  dmRateLimitState: defineTable({
    dmsSentInLastHour: v.array(v.number()), // timestamps of last 195 DMs
    lastDmSentAt: v.optional(v.number()), // 1-second spacing
    workerLastRun: v.optional(v.number()),
    workerActive: v.boolean(),
  }),

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
