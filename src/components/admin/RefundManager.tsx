import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, DollarSign, FileText, X } from 'lucide-react';
import { saveToLocalBackup } from '../../utils/backup';

interface RefundManagerProps {
  order: any;
  onClose: () => void;
  onUpdate: () => void;
}

const REFUND_REASONS = [
  'Item not as described',
  'Item damaged during shipping',
  'Item not received',
  'Wrong item received',
  'Customer changed mind',
  'Payment issue',
  'Other',
];

const REFUND_STATUSES = [
  'pending_review',
  'approved',
  'processing',
  'completed',
  'rejected',
];

export function RefundManager({ order, onClose, onUpdate }: RefundManagerProps) {
  const [refundData, setRefundData] = useState(order.refundRequest || {
    requested: false,
    reason: '',
    status: 'pending_review',
    evidence: [],
    requestedAmount: 0,
    approvedAmount: 0,
    adminNotes: '',
    customerNotes: '',
    requestedAt: Date.now(),
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefundUpdate = async () => {
    setIsProcessing(true);
    try {
      const updatedOrder = {
        ...order,
        refundRequest: {
          ...refundData,
          processedAt: Date.now(),
        },
        status: refundData.status === 'completed' ? 'issue_refund' : order.status,
        statusHistory: [
          ...order.statusHistory,
          {
            status: refundData.status === 'completed' ? 'issue_refund' : order.status,
            timestamp: Date.now(),
            updatedBy: 'admin',
            updateMethod: 'manual',
            notes: `Refund ${refundData.status}: ${refundData.adminNotes}`,
          }
        ],
        updatedAt: Date.now(),
      };

      await saveToLocalBackup('order', order.orderId, updatedOrder);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating refund:', error);
      alert('Failed to update refund. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
      case 'processing':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Refund Management - Order {order.orderId}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Customer:</span> {order.customerInfo.name}
                  </div>
                  <div>
                    <span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Order Total:</span> ${order.quotation?.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                  <div>
                    <span className="font-medium">Items:</span> {order.items.length} item(s)
                  </div>
                </div>
              </div>

              {/* Current Refund Status */}
              <div className="flex items-center space-x-3">
                {getStatusIcon(refundData.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(refundData.status)}`}>
                  {refundData.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Refund Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Reason
                  </label>
                  <select
                    value={refundData.reason}
                    onChange={(e) => setRefundData((prev: any) => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                  >
                    <option value="">Select reason...</option>
                    {REFUND_REASONS.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Status
                  </label>
                  <select
                    value={refundData.status}
                    onChange={(e) => setRefundData((prev: any) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                  >
                    {REFUND_STATUSES.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={refundData.requestedAmount}
                    onChange={(e) => setRefundData((prev: any) => ({ ...prev, requestedAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approved Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={refundData.approvedAmount}
                    onChange={(e) => setRefundData((prev: any) => ({ ...prev, approvedAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Customer Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Notes
                </label>
                <textarea
                  value={refundData.customerNotes}
                  onChange={(e) => setRefundData((prev: any) => ({ ...prev, customerNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                  placeholder="Customer's explanation for the refund request..."
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={refundData.adminNotes}
                  onChange={(e) => setRefundData((prev: any) => ({ ...prev, adminNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                  placeholder="Internal notes about this refund case..."
                />
              </div>

              {/* Refund Processing Timeline */}
              {refundData.requested && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Refund Timeline
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Requested:</span>
                      <span>{new Date(refundData.requestedAt).toLocaleString()}</span>
                    </div>
                    {refundData.processedAt && (
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{new Date(refundData.processedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setRefundData((prev: any) => ({ ...prev, status: 'approved', approvedAmount: prev.requestedAmount }))}
                  className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                >
                  Quick Approve
                </button>
                <button
                  onClick={() => setRefundData((prev: any) => ({ ...prev, status: 'rejected' }))}
                  className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                >
                  Quick Reject
                </button>
                <button
                  onClick={() => setRefundData((prev: any) => ({ ...prev, status: 'completed' }))}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                >
                  Mark Complete
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {refundData.approvedAmount > 0 && (
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Refund Amount: ${refundData.approvedAmount.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRefundUpdate}
                disabled={isProcessing}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-caribbean-blue rounded-md hover:bg-cyan-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Update Refund'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}