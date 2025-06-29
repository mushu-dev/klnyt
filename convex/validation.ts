import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Cache validation result
export const cacheValidationResult = mutation({
  args: {
    url: v.string(),
    domain: v.string(),
    validationResult: v.object({
      isValid: v.boolean(),
      isSupported: v.boolean(),
      riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("restricted")),
      validationMethod: v.union(v.literal("auto"), v.literal("manual"), v.literal("override")),
      requiresManualReview: v.boolean(),
      stockStatus: v.optional(v.string()),
      productInfo: v.optional(v.object({
        title: v.string(),
        price: v.number(),
        currency: v.string(),
        availability: v.string(),
      })),
      errorMessage: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Check if validation already exists
    const existing = await ctx.db
      .query("linkValidationCache")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
    
    if (existing) {
      // Update existing validation
      await ctx.db.patch(existing._id, {
        validationResult: args.validationResult,
        lastChecked: Date.now(),
      });
      return existing._id;
    } else {
      // Create new validation cache entry
      const newEntry = await ctx.db.insert("linkValidationCache", {
        url: args.url,
        domain: args.domain,
        validationResult: args.validationResult,
        lastChecked: Date.now(),
      });
      return newEntry;
    }
  },
});

// Get cached validation result
export const getCachedValidation = query({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("linkValidationCache")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
    
    if (!cached) return null;
    
    // Check if cache is still valid (24 hours)
    const cacheAge = Date.now() - cached.lastChecked;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > maxAge) {
      return null; // Cache expired
    }
    
    return cached;
  },
});

// Get validations by domain
export const getValidationsByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const validations = await ctx.db
      .query("linkValidationCache")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .collect();
    return validations;
  },
});

// Add admin override
export const addAdminOverride = mutation({
  args: {
    url: v.string(),
    adminId: v.string(),
    action: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const validation = await ctx.db
      .query("linkValidationCache")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
    
    if (!validation) {
      throw new Error("Validation not found");
    }
    
    const override = {
      timestamp: Date.now(),
      adminId: args.adminId,
      action: args.action,
      notes: args.notes,
    };
    
    const adminOverrides = validation.adminOverrides || [];
    
    await ctx.db.patch(validation._id, {
      adminOverrides: [...adminOverrides, override],
      validationResult: {
        ...validation.validationResult,
        validationMethod: "override" as const,
      },
    });
    
    return { success: true };
  },
});

// Clear expired cache entries
export const clearExpiredCache = mutation({
  args: {},
  handler: async (ctx) => {
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const cutoffTime = Date.now() - maxAge;
    
    const expiredEntries = await ctx.db
      .query("linkValidationCache")
      .filter((q) => q.lt(q.field("lastChecked"), cutoffTime))
      .collect();
    
    for (const entry of expiredEntries) {
      await ctx.db.delete(entry._id);
    }
    
    return { deleted: expiredEntries.length };
  },
});