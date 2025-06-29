import { useState } from 'react';
import { AlertCircle, Send, FileText, MessageCircle, ArrowLeft } from 'lucide-react';
import { sendRefundNotification } from '../../utils/email';

interface RefundPageProps {
  onBack: () => void;
}

const REFUND_REASONS = [
  'Item not as described',
  'Item damaged during shipping',
  'Item not received',
  'Wrong item received',
  'Changed my mind',
  'Delivery issues',
  'Quality concerns',
  'Order cancelled',
  'Other',
];

export function RefundPage({ onBack }: RefundPageProps) {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId || !customerName || !customerEmail || !reason) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Send email notification to klyntshipment@gmail.com
      await sendRefundNotification({
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        refundAmount: requestedAmount,
        refundReason: `${reason}${description ? `: ${description}` : ''}`,
        status: 'pending_review'
      });
      
      alert('Refund request submitted successfully. We apologize for any inconvenience caused and our team will review your request shortly and contact you via email or phone.');
      
      // Reset form
      setOrderId('');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setReason('');
      setDescription('');
      setRequestedAmount(0);
      
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Failed to submit refund request. Please try again or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRefund = () => {
    const message = encodeURIComponent(
      `REFUND REQUEST\n\n` +
      `Order ID: ${orderId}\n` +
      `Name: ${customerName}\n` +
      `Email: ${customerEmail}\n` +
      `Phone: ${customerPhone}\n` +
      `Reason: ${reason}\n` +
      `Requested Amount: $${requestedAmount.toFixed(2)}\n` +
      `Description: ${description || 'N/A'}\n\n` +
      `Please process my refund request. Thank you!`
    );
    window.open(`https://wa.me/18684750965?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Refund</h1>
            <p className="text-gray-600">Submit a refund request for your order</p>
            
            {/* Sorry for inconvenience message */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                We're sorry for any inconvenience you may have experienced with your order. 
                We're here to help resolve this quickly and efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-gray-700 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Refund Request Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                placeholder="e.g., KS-2025-0001"
                required
              />
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                  placeholder="e.g., +1 (473) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Refund Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Refund *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                required
              >
                <option value="" className="text-gray-800">Select a reason...</option>
                {REFUND_REASONS.map(r => (
                  <option key={r} value={r} className="text-gray-800">{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Refund Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-caribbean-blue focus:border-caribbean-blue"
                placeholder="Please provide additional details about your refund request..."
              />
            </div>

            {/* Refund Policy */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Refund Policy</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Refund requests are reviewed within 1-2 business days</li>
                <li>• Refunds are processed back to your original payment method</li>
                <li>• Processing time: 3-5 business days after approval</li>
                <li>• Contact us via WhatsApp for urgent refund matters</li>
                <li>• All refund requests are sent to klyntshipment@gmail.com</li>
              </ul>
            </div>

            {/* Submit Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-800 text-center">Choose how to submit your refund request:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email submission */}
                <button
                  type="submit"
                  disabled={isSubmitting || !orderId || !customerName || !customerEmail || !reason}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit via Email
                    </>
                  )}
                </button>

                {/* WhatsApp submission */}
                <button
                  type="button"
                  onClick={handleWhatsAppRefund}
                  disabled={!orderId || !customerName || !reason}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Submit via WhatsApp
                </button>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-xs text-gray-600">
                  <strong>Submit via Email:</strong> Sends your request directly to our team
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Submit via WhatsApp:</strong> Opens WhatsApp with your refund request
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-gray-700 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
          </div>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>WhatsApp: +1 (868) 475-0965</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              <span>Email: klyntshipment@gmail.com</span>
            </div>
            <p className="text-sm mt-4">
              If you need immediate assistance or have questions about your refund, 
              please contact us via WhatsApp or email. Our team typically responds within 1-2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}