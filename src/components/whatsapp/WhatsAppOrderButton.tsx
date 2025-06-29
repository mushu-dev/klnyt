import { MessageCircle } from 'lucide-react';

interface OrderData {
  name: string;
  email: string;
  phone: string;
  address: string;
  product: string;
  link: string;
  quantity: number;
  notes?: string;
}

interface WhatsAppOrderButtonProps {
  order: OrderData;
  className?: string;
  children?: React.ReactNode;
}

const WHATSAPP_ORDER_NUMBER = '18684750965'; // All orders go to this number

export function WhatsAppOrderButton({ order, className = '', children }: WhatsAppOrderButtonProps) {
  const generateOrderMessage = (orderData: OrderData): string => {
    const message = `
🛒 *NEW ORDER SUBMISSION*

📋 *Customer Information:*
• Name: ${orderData.name}
• Email: ${orderData.email}
• Phone: ${orderData.phone}
• Address: ${orderData.address}

🎯 *Product Details:*
• Product: ${orderData.product}
• Link: ${orderData.link}
• Quantity: ${orderData.quantity}

${orderData.notes ? `📝 *Additional Notes:*\n${orderData.notes}\n` : ''}

---
Please review this order and provide a quotation.

Thank you for choosing Klynt Shipment! 🚢
    `.trim();

    return message;
  };

  const handleWhatsAppSubmission = () => {
    const message = generateOrderMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_NUMBER.replace(/\D/g, '')}?text=${encodedMessage}`;
    
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