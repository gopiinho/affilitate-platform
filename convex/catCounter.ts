import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const counter = await ctx.db.query("catCounter").first();
    return counter?.count ?? 0;
  },
});

export const increment = mutation({
  handler: async (ctx) => {
    const counter = await ctx.db.query("catCounter").first();

    if (counter) {
      await ctx.db.patch(counter._id, {
        count: counter.count + 1,
      });
      return counter.count + 1;
    } else {
      await ctx.db.insert("catCounter", { count: 1 });
      return 1;
    }
  },
});
