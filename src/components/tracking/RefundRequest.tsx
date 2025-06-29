import { useState } from 'react';
import { AlertCircle, Send, FileText, MessageCircle } from 'lucide-react';
import { saveToLocalBackup } from '../../utils/backup';
import { WhatsAppRefundButton } from '../whatsapp/WhatsAppRefundButton';
import { sendRefundNotification } from '../../utils/email';
import type { Order } from '../../types';

interface RefundRequestProps {
  order: Order;
  onUpdate: () => void;
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

const REFUND_STATUS_LABELS = {
  'pending_review': 'Pending Review',
  'approved': 'Approved',
  'processing': 'Processing',
  'completed': 'Completed',
  'rejected': 'Rejected'
};

export function RefundRequest({ order, onUpdate }: RefundRequestProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState(order.quotation?.totalAmount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      alert('Please select a reason for the refund request');
      return;
    }

    setIsSubmitting(true);
    try {
      const refundRequest = {
        requested: true,
        reason,
        status: 'pending_review' as const,
        requestedAmount,
        approvedAmount: 0,
        customerNotes: description,
        adminNotes: '',
        requestedAt: Date.now(),
      };

      const updatedOrder = {
        ...order,
        refundRequest,
        statusHistory: [
          ...order.statusHistory,
          {
            status: order.status,
            timestamp: Date.now(),
            updatedBy: 'customer',
            updateMethod: 'manual',
            notes: `Refund requested: ${reason}`,
          }
        ],
        updatedAt: Date.now(),
      };

      await saveToLocalBackup('order', order.orderId, updatedOrder);
      
      // Send email notification
      await sendRefundNotification({
        orderId: order.orderId,
        customerName: order.customerInfo.name,
        customerEmail: order.customerInfo.email,
        customerPhone: order.customerInfo.phone,
        refundAmount: requestedAmount,
        refundReason: `${reason}${description ? `: ${description}` : ''}`,
        status: 'pending_review'
      });
      
      onUpdate();
      alert('Refund request submitted successfully. Our team will review it shortly.');
    } catch (error) {
      console.error('Error submitting refund request:', error);
      alert('Failed to submit refund request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show if refund already requested
  if (order.refundRequest?.requested) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Refund Request Status</h4>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Status:</span>
                <span className="font-semibold text-sm text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                  {REFUND_STATUS_LABELS[order.refundRequest.status as keyof typeof REFUND_STATUS_LABELS]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Requested:</span>
                <span className="text-sm text-yellow-700 font-medium">
                  {new Date(order.refundRequest.requestedAt).toLocaleDateString()}
                </span>
              </div>
              {order.refundRequest.requestedAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700">Amount:</span>
                  <span className="text-sm text-yellow-700 font-medium">
                    ${order.refundRequest.requestedAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {order.refundRequest.reason && (
                <div className="mt-2">
                  <span className="text-sm text-yellow-700 font-medium">Reason:</span>
                  <p className="text-sm text-yellow-700 mt-1">{order.refundRequest.reason}</p>
                </div>
              )}
              {order.refundRequest.adminNotes && (
                <div className="mt-2 pt-2 border-t border-yellow-300">
                  <span className="text-sm text-yellow-700 font-medium">Admin Notes:</span>
                  <p className="text-sm text-yellow-700 mt-1">{order.refundRequest.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show for completed, delivered, or issue orders
  if (!['delivered', 'payment_received', 'purchased', 'processing'].includes(order.status)) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Request Refund</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Refund
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
            required
          >
            <option value="">Select a reason...</option>
            {REFUND_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
            placeholder="Please provide additional details about your refund request..."
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
          />
          <p className="text-xs text-gray-500 mt-1">
            Original order total: ${order.quotation?.totalAmount?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Refund Policy</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Refund requests are reviewed within 1-2 business days</li>
            <li>• Refunds are processed back to your original payment method</li>
            <li>• Processing time: 3-5 business days after approval</li>
            <li>• Contact us via WhatsApp for urgent refund matters</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900 text-center">Choose how to submit your refund request:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Traditional system submission */}
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit to System
                </>
              )}
            </button>

            {/* Direct WhatsApp submission */}
            <WhatsAppRefundButton
              refund={{
                name: order.customerInfo.name,
                email: order.customerInfo.email,
                orderId: order.orderId,
                reason: reason || 'Not specified',
              }}
              className="w-full text-sm px-4 py-2"
            >
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Submit via WhatsApp
              </>
            </WhatsAppRefundButton>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-600">
              <strong>Submit to System:</strong> Saves to our system and notifies admin
            </p>
            <p className="text-xs text-gray-600">
              <strong>Submit via WhatsApp:</strong> Opens WhatsApp with your refund request
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}