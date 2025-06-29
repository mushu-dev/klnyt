import type { Order } from '../types';

const WHATSAPP_BUSINESS_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18682775433';
const WHATSAPP_ORDER_NUMBER = '18684750965'; // Orders go to this number

export const generateWhatsAppLink = (order: Order, isRefund: boolean = false): string => {
  const message = generateOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  // Orders go to the order number, refunds/support go to the business number
  const phoneNumber = isRefund ? WHATSAPP_BUSINESS_NUMBER : WHATSAPP_ORDER_NUMBER;
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateOrderMessage = (order: Order): string => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTotal = order.items.reduce((sum, item) => 
    sum + (item.estimatedPrice || 0) * item.quantity, 0
  );
  
  return `New Order - Order #${order.orderId}
Customer: ${order.customerInfo.name}
Items: ${itemCount} items
Total Est: $${estimatedTotal.toFixed(2)} USD
Address: ${order.customerInfo.address}

Ready to provide quotation!`;
};

export const generateStatusUpdateMessage = (order: Order, newStatus: string): string => {
  const statusMessages: Record<string, string> = {
    confirmed: `Order #${order.orderId} has been confirmed! We're reviewing your items.`,
    quotation_sent: `Your quotation for Order #${order.orderId} is ready! Please review and approve.`,
    payment_received: `Payment received for Order #${order.orderId}! We're now processing your order.`,
    purchased: `Great news! We've purchased your items for Order #${order.orderId}.`,
    in_transit_international: `Your Order #${order.orderId} is on its way to Trinidad!`,
    arrived_local: `Your Order #${order.orderId} has arrived in Trinidad!`,
    out_for_delivery: `Your Order #${order.orderId} is out for delivery today!`,
    delivered: `Your Order #${order.orderId} has been delivered! Thank you for choosing Klynt!`,
  };
  
  return statusMessages[newStatus] || `Order #${order.orderId} status updated to: ${newStatus}`;
};