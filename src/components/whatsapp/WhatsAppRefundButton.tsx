import { MessageCircle } from 'lucide-react';

interface RefundData {
  name: string;
  email: string;
  orderId: string;
  reason: string;
}

interface WhatsAppRefundButtonProps {
  refund: RefundData;
  className?: string;
  children?: React.ReactNode;
}

const WHATSAPP_BUSINESS_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18682775433';

export function WhatsAppRefundButton({ refund, className = '', children }: WhatsAppRefundButtonProps) {
  const generateRefundMessage = (refundData: RefundData): string => {
    const message = `
🔄 *REFUND REQUEST*

📋 *Customer Information:*
• Name: ${refundData.name}
• Email: ${refundData.email}
• Order ID: ${refundData.orderId}

💰 *Refund Details:*
• Reason: ${refundData.reason}

---
Please review this refund request and process accordingly.

Thank you for your assistance! 🚢
    `.trim();

    return message;
  };

  const handleWhatsAppSubmission = () => {
    const message = generateRefundMessage(refund);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab/window
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppSubmission}
      className={`flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors ${className}`}
    >
      {children || (
        <>
          <MessageCircle className="h-5 w-5 mr-2" />
          Submit via WhatsApp
        </>
      )}
    </button>
  );
}