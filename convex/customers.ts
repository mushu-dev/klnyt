import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update customer
export const upsertCustomer = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    trafficSource: v.union(v.literal("instagram"), v.literal("direct"), v.literal("referral")),
  },
  handler: async (ctx, args) => {
    // Check if customer exists
    const existingCustomer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existingCustomer) {
      // Update existing customer
      await ctx.db.patch(existingCustomer._id, {
        name: args.name,
        phone: args.phone,
        address: args.address,
        // Keep original traffic source
      });
      return existingCustomer._id;
    } else {
      // Create new customer
      const customerId = `CUST-${Date.now()}`;
      const newCustomer = await ctx.db.insert("customers", {
        customerId,
        ...args,
        orderHistory: [],
        createdAt: Date.now(),
        preferences: {
          notifications: true,
          whatsappUpdates: true,
          emailUpdates: true,
        },
      });
      return newCustomer;
    }
  },
});

// Get customer by email
export const getCustomerByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return customer;
  },
});

// Get customer by phone
export const getCustomerByPhone = query({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_phone", (q) => q.eq("phone", args.phone))
      .first();
    return customer;
  },
});

// Get customer by ID
export const getCustomer = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
      .first();
    return customer;
  },
});

// Add order to customer history
export const addOrderToCustomer = mutation({
  args: {
    customerId: v.string(),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
      .first();
    
    if (!customer) {
      throw new Error("Customer not found");
    }
    
    await ctx.db.patch(customer._id, {
      orderHistory: [...customer.orderHistory, args.orderId],
    });
    
    return { success: true };
  },
});

// Update customer preferences
export const updateCustomerPreferences = mutation({
  args: {
    customerId: v.string(),
    preferences: v.object({
      notifications: v.boolean(),
      whatsappUpdates: v.boolean(),
      emailUpdates: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("customers")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
      .first();
    
    if (!customer) {
      throw new Error("Customer not found");
    }
    
    await ctx.db.patch(customer._id, {
      preferences: args.preferences,
    });
    
    return { success: true };
  },
});