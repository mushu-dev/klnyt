import type { Order, RefundStatus } from '../types';

interface EmailConfig {
  supportEmail: string;
  orderPhone: string;
}

const EMAIL_CONFIG: EmailConfig = {
  supportEmail: 'klyntshipment@gmail.com',
  orderPhone: '+18684750965'
};

interface RefundEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  refundAmount: number;
  refundReason: string;
  status: RefundStatus;
}

interface SupportEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  message: string;
}

export function generateRefundEmailSubject(orderId: string, status: RefundStatus): string {
  const statusText = status.replace('_', ' ').toUpperCase();
  return `[REFUND ${statusText}] Order ${orderId}`;
}

export function generateRefundEmailBody(data: RefundEmailData): string {
  const statusText = data.status.replace('_', ' ').toUpperCase();
  
  return `
REFUND REQUEST - ${statusText}

Order Details:
- Order ID: ${data.orderId}
- Customer Name: ${data.customerName}
- Customer Email: ${data.customerEmail}
- Customer Phone: ${data.customerPhone}

Refund Information:
- Requested Amount: $${data.refundAmount.toFixed(2)}
- Reason: ${data.refundReason}
- Current Status: ${statusText}

Timestamp: ${new Date().toLocaleString('en-TT', { timeZone: 'America/Port_of_Spain' })}

---
This is an automated email from Klynt Shipment System
`.trim();
}

export function generateSupportEmailBody(data: SupportEmailData): string {
  return `
CUSTOMER SUPPORT REQUEST

Customer Information:
- Name: ${data.customerName}
- Email: ${data.customerEmail}
- Phone: ${data.customerPhone}

Subject: ${data.subject}

Message:
${data.message}

Timestamp: ${new Date().toLocaleString('en-TT', { timeZone: 'America/Port_of_Spain' })}

---
This is an automated email from Klynt Shipment System
`.trim();
}

export function generateOrderNotificationBody(order: Order): string {
  const itemsList = order.items.map((item, index) => 
    `${index + 1}. Product Link: ${item.productLink} - Qty: ${item.quantity} (Est: $${item.estimatedPrice?.toFixed(2) || 'TBD'})`
  ).join('\n');

  const totalEstimated = order.items.reduce((sum, item) => sum + ((item.estimatedPrice || 0) * item.quantity), 0);

  return `
NEW ORDER RECEIVED - ${order.orderId}

Customer Information:
- Name: ${order.customerInfo.name}
- Email: ${order.customerInfo.email}
- Phone: ${order.customerInfo.phone}
- Delivery Address: ${order.customerInfo.address}

Order Details:
${itemsList}

Estimated Total: $${totalEstimated.toFixed(2)}

Special Instructions: ${order.customerInfo.specialInstructions || 'None'}

Order Type: ${order.items.length > 1 ? 'Multi-item' : 'Single item'}
Traffic Source: ${order.customerInfo.trafficSource || 'Direct'}
Timestamp: ${new Date().toLocaleString('en-TT', { timeZone: 'America/Port_of_Spain' })}

---
This order should be processed via WhatsApp: ${EMAIL_CONFIG.orderPhone}
`.trim();
}

export async function sendEmailNotification(
  to: string,
  subject: string,
  body: string,
  type: 'refund' | 'support' | 'order'
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, this would use an email service like SendGrid, AWS SES, etc.
    // For now, we'll store the email in localStorage for the email queue system
    const emailQueue = JSON.parse(localStorage.getItem('emailQueue') || '[]');
    emailQueue.push({
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      type,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem('emailQueue', JSON.stringify(emailQueue));
    
    // In production, this would trigger an actual email send
    console.log(`Email queued for ${type}:`, { to, subject });
    
    return { success: true };
  } catch (error) {
    console.error('Error queuing email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to queue email' 
    };
  }
}

export function sendRefundNotification(data: RefundEmailData): Promise<{ success: boolean; error?: string }> {
  const subject = generateRefundEmailSubject(data.orderId, data.status);
  const body = generateRefundEmailBody(data);
  return sendEmailNotification(EMAIL_CONFIG.supportEmail, subject, body, 'refund');
}

export function sendSupportNotification(data: SupportEmailData): Promise<{ success: boolean; error?: string }> {
  const subject = `[SUPPORT] ${data.subject}`;
  const body = generateSupportEmailBody(data);
  return sendEmailNotification(EMAIL_CONFIG.supportEmail, subject, body, 'support');
}

export function getEmailQueue(): any[] {
  return JSON.parse(localStorage.getItem('emailQueue') || '[]');
}

export function clearEmailQueue(): void {
  localStorage.setItem('emailQueue', '[]');
}

export function processEmailQueue(): { processed: number; failed: number } {
  const queue = getEmailQueue();
  let processed = 0;
  let failed = 0;
  
  const updatedQueue = queue.map(email => {
    if (email.status === 'pending') {
      // In production, this would actually send the email
      // For now, we'll just mark it as sent
      processed++;
      return { ...email, status: 'sent', sentAt: new Date().toISOString() };
    }
    return email;
  });
  
  localStorage.setItem('emailQueue', JSON.stringify(updatedQueue));
  
  return { processed, failed };
}