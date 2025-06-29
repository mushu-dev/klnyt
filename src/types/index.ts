export type OrderStatus = 
  | 'submitted'
  | 'confirmed'
  | 'quotation_pending'
  | 'quotation_sent'
  | 'awaiting_approval'
  | 'quote_approved'
  | 'payment_pending'
  | 'payment_received'
  | 'processing'
  | 'purchased'
  | 'in_transit_international'
  | 'arrived_local'
  | 'out_for_delivery'
  | 'delivered'
  | 'quote_rejected'
  | 'issue_refund';

export type ValidationMethod = 'auto' | 'manual' | 'override';
export type UpdateMethod = 'auto' | 'manual';
export type RiskLevel = 'low' | 'medium' | 'high' | 'restricted';
export type TrafficSource = 'instagram' | 'direct' | 'referral';

export interface OrderItem {
  productLink: string;
  quantity: number;
  validationStatus: string;
  validationMethod: ValidationMethod;
  stockStatus: string;
  estimatedPrice?: number;
  quotedPrice?: number;
  finalPrice?: number;
  riskLevel: RiskLevel;
  adminOverride: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  specialInstructions?: string;
  trafficSource: TrafficSource;
}

export interface Quotation {
  itemCost: number;
  shippingFee: number;
  serviceFee: number;
  customsDuty: number;
  totalAmount: number;
  currency: string;
  quoteSentAt?: number;
  approvedAt?: number;
  rejectedAt?: number;
  notes?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: number;
  updatedBy: string;
  updateMethod: UpdateMethod;
  notes?: string;
}

export type RefundStatus = 'pending_review' | 'approved' | 'processing' | 'completed' | 'rejected';

export interface RefundRequest {
  requested: boolean;
  reason: string;
  evidence?: string[];
  status: RefundStatus;
  requestedAmount: number;
  approvedAmount: number;
  customerNotes?: string;
  adminNotes?: string;
  requestedAt: number;
  processedAt?: number;
}

export interface OrderStatistics {
  totalOrders: number;
  statusBreakdown: Record<OrderStatus, number>;
  totalRevenue: number;
  pendingRefunds: number;
  recentOrders: number;
  averageOrderValue: number;
  completionRate: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  customerId: string;
  status: OrderStatus;
  automationEnabled: boolean;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  quotation?: Quotation;
  statusHistory: StatusHistoryEntry[];
  refundRequest?: RefundRequest;
  createdAt: number;
  updatedAt: number;
  whatsappThreadId?: string;
  paymentStatus?: string;
  estimatedDelivery?: number;
}

export interface Customer {
  _id?: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderHistory: string[];
  createdAt: number;
  preferences: {
    notifications: boolean;
    whatsappUpdates: boolean;
    emailUpdates: boolean;
  };
  trafficSource: TrafficSource;
}

export interface ValidationResult {
  isValid: boolean;
  isSupported: boolean;
  riskLevel: RiskLevel;
  validationMethod: ValidationMethod;
  requiresManualReview: boolean;
  stockStatus?: string;
  productInfo?: {
    title: string;
    price: number;
    currency: string;
    availability: string;
  };
  errorMessage?: string;
}

export interface LinkValidationCache {
  _id?: string;
  url: string;
  domain: string;
  validationResult: ValidationResult;
  productInfo?: {
    title: string;
    price: number;
    currency: string;
    availability: string;
  };
  adminOverrides?: {
    timestamp: number;
    adminId: string;
    action: string;
    notes: string;
  }[];
  lastChecked: number;
}