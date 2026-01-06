import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
