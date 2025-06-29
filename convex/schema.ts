import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    orderId: v.string(),
    customerId: v.string(),
    status: v.union(
      v.literal("submitted"),
      v.literal("confirmed"),
      v.literal("quotation_pending"),
      v.literal("quotation_sent"),
      v.literal("awaiting_approval"),
      v.literal("quote_approved"),
      v.literal("payment_pending"),
      v.literal("payment_received"),
      v.literal("processing"),
      v.literal("purchased"),
      v.literal("in_transit_international"),
      v.literal("arrived_local"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("quote_rejected"),
      v.literal("issue_refund")
    ),
    automationEnabled: v.boolean(),
    items: v.array(
      v.object({
        productLink: v.string(),
        quantity: v.number(),
        validationStatus: v.string(),
        validationMethod: v.union(v.literal("auto"), v.literal("manual"), v.literal("override")),
        stockStatus: v.string(),
        estimatedPrice: v.optional(v.number()),
        quotedPrice: v.optional(v.number()),
        finalPrice: v.optional(v.number()),
        riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("restricted")),
        adminOverride: v.boolean(),
      })
    ),
    customerInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      specialInstructions: v.optional(v.string()),
      trafficSource: v.union(v.literal("instagram"), v.literal("direct"), v.literal("referral")),
    }),
    quotation: v.optional(
      v.object({
        itemCost: v.number(),
        shippingFee: v.number(),
        serviceFee: v.number(),
        customsDuty: v.number(),
        totalAmount: v.number(),
        currency: v.string(),
        quoteSentAt: v.optional(v.number()),
        approvedAt: v.optional(v.number()),
        rejectedAt: v.optional(v.number()),
        notes: v.optional(v.string()),
      })
    ),
    statusHistory: v.array(
      v.object({
        status: v.string(),
        timestamp: v.number(),
        updatedBy: v.string(),
        updateMethod: v.union(v.literal("auto"), v.literal("manual")),
        notes: v.optional(v.string()),
      })
    ),
    refundRequest: v.optional(
      v.object({
        requested: v.boolean(),
        reason: v.string(),
        evidence: v.optional(v.array(v.string())),
        status: v.string(),
        processedAt: v.optional(v.number()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    whatsappThreadId: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
  })
    .index("by_orderId", ["orderId"])
    .index("by_customerId", ["customerId"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  customers: defineTable({
    customerId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    orderHistory: v.array(v.string()),
    createdAt: v.number(),
    preferences: v.object({
      notifications: v.boolean(),
      whatsappUpdates: v.boolean(),
      emailUpdates: v.boolean(),
    }),
    trafficSource: v.union(v.literal("instagram"), v.literal("direct"), v.literal("referral")),
  })
    .index("by_customerId", ["customerId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"]),

  linkValidationCache: defineTable({
    url: v.string(),
    domain: v.string(),
    validationResult: v.object({
      isValid: v.boolean(),
      isSupported: v.boolean(),
      riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("restricted")),
      validationMethod: v.union(v.literal("auto"), v.literal("manual"), v.literal("override")),
      requiresManualReview: v.boolean(),
      stockStatus: v.optional(v.string()),
      productInfo: v.optional(
        v.object({
          title: v.string(),
          price: v.number(),
          currency: v.string(),
          availability: v.string(),
        })
      ),
      errorMessage: v.optional(v.string()),
    }),
    adminOverrides: v.optional(
      v.array(
        v.object({
          timestamp: v.number(),
          adminId: v.string(),
          action: v.string(),
          notes: v.string(),
        })
      )
    ),
    lastChecked: v.number(),
  })
    .index("by_url", ["url"])
    .index("by_domain", ["domain"]),
});