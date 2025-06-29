import { useState } from 'react';
import { X, Save, MessageSquare, RefreshCw } from 'lucide-react';
import type { OrderStatus } from '../../types';
import { saveToLocalBackup } from '../../utils/backup';
import { generateStatusUpdateMessage } from '../../utils/whatsapp';
import { RefundManager } from './RefundManager';

interface StatusManagerProps {
  order: any;
  onClose: () => void;
  onUpdate: () => void;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; description: string }[] = [
  { value: 'submitted', label: 'Submitted', description: 'Order received and awaiting review' },
  { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being processed' },
  { value: 'quotation_pending', label: 'Quotation Pending', description: 'Calculating shipping costs' },
  { value: 'quotation_sent', label: 'Quotation Sent', description: 'Quote sent to customer' },
  { value: 'awaiting_approval', label: 'Awaiting Approval', description: 'Waiting for customer approval' },
  { value: 'quote_approved', label: 'Quote Approved', description: 'Customer approved the quote' },
  { value: 'payment_pending', label: 'Payment Pending', description: 'Waiting for payment' },
  { value: 'payment_received', label: 'Payment Received', description: 'Payment confirmed' },
  { value: 'processing', label: 'Processing', description: 'Purchasing items from retailer' },
  { value: 'purchased', label: 'Purchased', description: 'Items successfully purchased' },
  { value: 'in_transit_international', label: 'In Transit (International)', description: 'Shipping to Trinidad' },
  { value: 'arrived_local', label: 'Arrived Local', description: 'Arrived in Trinidad' },
  { value: 'out_for_delivery', label: 'Out for Delivery', description: 'Being delivered to customer' },
  { value: 'delivered', label: 'Delivered', description: 'Successfully delivered' },
  { value: 'quote_rejected', label: 'Quote Rejected', description: 'Customer declined quote' },
  { value: 'issue_refund', label: 'Issue/Refund', description: 'Issue requiring resolution' },
];

export function StatusManager({ order, onClose, onUpdate }: StatusManagerProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState('');
  const [quotation, setQuotation] = useState(order.quotation || {
    itemCost: 0,
    shippingFee: 0,
    serviceFee: 0,
    customsDuty: 0,
    totalAmount: 0,
    currency: 'USD',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRefundManager, setShowRefundManager] = useState(false);

  const calculateTotal = () => {
    const total = quotation.itemCost + quotation.shippingFee + quotation.serviceFee + quotation.customsDuty;
    setQuotation((prev: any) => ({ ...prev, totalAmount: total }));
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const updatedOrder = {
        ...order,
        status: newStatus,
        quotation: newStatus === 'quotation_sent' ? {
          ...quotation,
          quoteSentAt: Date.now(),
        } : order.quotation,
        statusHistory: [
          ...order.statusHistory,
          {
            status: newStatus,
            timestamp: Date.now(),
            updatedBy: 'admin',
            updateMethod: 'manual',
            notes: notes || undefined,
          }
        ],
        updatedAt: Date.now(),
      };

      await saveToLocalBackup('order', order.orderId, updatedOrder);
      
      // Generate WhatsApp message for customer communication
      if (newStatus !== order.status) {
        const message = generateStatusUpdateMessage(updatedOrder, newStatus);
        console.log('WhatsApp message:', message);
      }

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const message = generateStatusUpdateMessage(order, newStatus);
    const whatsappUrl = `https://wa.me/${order.customerInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Order {order.orderId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {order.customerInfo.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {order.customerInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {order.customerInfo.phone}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Address:</span> {order.customerInfo.address}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                <div className="space-y-2 text-sm">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate">{item.productLink}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quotation Section */}
              {(newStatus === 'quotation_sent' || order.quotation) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Quotation Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Cost ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={quotation.itemCost}
                        onChange={(e) => setQuotation((prev: any) => ({ ...prev, itemCost: parseFloat(e.target.value) || 0 }))}
                        onBlur={calculateTotal}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={quotation.shippingFee}
                        onChange={(e) => setQuotation((prev: any) => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                        onBlur={calculateTotal}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Fee ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={quotation.serviceFee}
                        onChange={(e) => setQuotation((prev: any) => ({ ...prev, serviceFee: parseFloat(e.target.value) || 0 }))}
                        onBlur={calculateTotal}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customs Duty ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={quotation.customsDuty}
                        onChange={(e) => setQuotation((prev: any) => ({ ...prev, customsDuty: parseFloat(e.target.value) || 0 }))}
                        onBlur={calculateTotal}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <div className="font-semibold text-lg">
                      Total: ${quotation.totalAmount.toFixed(2)} USD
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Update Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                  placeholder="Add any notes about this status update..."
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={generateWhatsAppMessage}
                className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp Customer
              </button>
              <button
                onClick={() => setShowRefundManager(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Manage Refund
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-caribbean-blue rounded-md hover:bg-cyan-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Refund Manager Modal */}
      {showRefundManager && (
        <RefundManager
          order={order}
          onClose={() => setShowRefundManager(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}