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
});
