import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("items")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sectionId: v.id("sections"),
    affiliateLink: v.string(),
    price: v.optional(v.string()),
    platform: v.string(),
    itemTitle: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", {
      ...args,
      order: Date.now(),
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    affiliateLink: v.string(),
    price: v.optional(v.string()),
    platform: v.string(),
    itemTitle: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
