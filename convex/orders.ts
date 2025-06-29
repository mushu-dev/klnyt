import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Create a new order
export const createOrder = mutation({
  args: {
    orderId: v.string(),
    customerId: v.string(),
    status: v.string(),
    automationEnabled: v.boolean(),
    items: v.array(v.object({
      productLink: v.string(),
      quantity: v.number(),
      validationStatus: v.string(),
      validationMethod: v.string(),
      stockStatus: v.string(),
      riskLevel: v.string(),
      adminOverride: v.boolean(),
      estimatedPrice: v.optional(v.number()),
    })),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      specialInstructions: v.optional(v.string()),
      trafficSource: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.insert("orders", {
      ...args,
      statusHistory: [{
        status: args.status,
        timestamp: Date.now(),
        updatedBy: "system",
        updateMethod: "auto",
      }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return order;
  },
});

// Get order by ID
export const getOrder = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first();
    return order;
  },
});

// Get orders by status
export const getOrdersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    return orders;
  },
});

// Get all orders (with pagination)
export const getAllOrders = query({
  args: {
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    let query = ctx.db.query("orders").withIndex("by_createdAt").order("desc");
    
    if (args.cursor) {
      // In production, implement proper cursor-based pagination
    }
    
    const orders = await query.take(limit);
    return orders;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.string(),
    newStatus: v.string(),
    updatedBy: v.string(),
    updateMethod: v.union(v.literal("auto"), v.literal("manual")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first();
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    const statusHistoryEntry = {
      status: args.newStatus,
      timestamp: Date.now(),
      updatedBy: args.updatedBy,
      updateMethod: args.updateMethod,
      notes: args.notes,
    };
    
    await ctx.db.patch(order._id, {
      status: args.newStatus as any,
      statusHistory: [...order.statusHistory, statusHistoryEntry],
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Update order quotation
export const updateQuotation = mutation({
  args: {
    orderId: v.string(),
    quotation: v.object({
      itemCost: v.number(),
      shippingFee: v.number(),
      serviceFee: v.number(),
      customsDuty: v.number(),
      totalAmount: v.number(),
      currency: v.string(),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .first();
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    await ctx.db.patch(order._id, {
      quotation: {
        ...args.quotation,
        quoteSentAt: Date.now(),
      },
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Search orders
export const searchOrders = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    // In production, implement proper search functionality
    // For now, search by orderId
    const byOrderId = await ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.searchTerm))
      .collect();
    
    // You could also search by customer email or phone
    // This would require additional indexes
    
    return byOrderId;
  },
});