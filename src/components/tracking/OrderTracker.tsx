import { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { StatusDisplay } from './StatusDisplay';
import { RefundRequest } from './RefundRequest';
import { isValidTTPhone, verifyPhoneForTracking } from '../../utils/validation';
import { getFromLocalBackup } from '../../utils/backup';

interface OrderTrackerProps {}

export function OrderTracker({}: OrderTrackerProps) {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshOrder = async () => {
    if (orderId) {
      const orderData = await getFromLocalBackup('order', orderId);
      if (orderData) {
        setOrder(orderData);
      }
    }
  };

  const handleSearch = async () => {
    // Validate order ID format
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }


    // Validate phone number
    if (!phone.trim()) {
      setError('Please enter your phone number for verification');
      return;
    }

    if (!isValidTTPhone(phone)) {
      setError('Please enter a valid Trinidad & Tobago phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // In production, this would query Convex
      // For now, check local backup
      const orderData = await getFromLocalBackup('order', orderId.trim());
      
      if (!orderData) {
        setError('Order not found. Please check your order ID and try again.');
        setOrder(null);
        return;
      }

      // Enhanced phone verification using dedicated function
      if (!verifyPhoneForTracking(phone, orderData.customerInfo.phone)) {
        setError('Phone number verification failed. Please ensure you entered the correct phone number associated with this order.');
        setOrder(null);
        return;
      }

      setOrder(orderData);
    } catch (err) {
      console.error('Error searching order:', err);
      setError('Failed to search for order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue font-mono"
              placeholder="Enter your order ID"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (for verification)
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
              placeholder="868-123-4567"
            />
          </div>

          {/* Phone Verification Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
              <div className="text-sm text-blue-700">
                <p>Your phone number is used to verify ownership of the order.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {order && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <p className="text-sm text-green-700">Order found and verified successfully!</p>
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-caribbean-blue hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-blue disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Track Order
              </>
            )}
          </button>
        </div>
      </div>

      {order && (
        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Order ID:</span>
                <span className="ml-2 font-mono">{order.orderId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 capitalize">{order.status.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Customer:</span>
                <span className="ml-2">{order.customerInfo.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Items:</span>
                <span className="ml-2">{order.items.length} item(s)</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2">{order.customerInfo.address}</span>
              </div>
            </div>
          </div>

          <StatusDisplay 
            currentStatus={order.status} 
            statusHistory={order.statusHistory}
          />

          {order.quotation && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Item Cost:</span>
                  <span>${order.quotation.itemCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>${order.quotation.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>${order.quotation.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customs Duty:</span>
                  <span>${order.quotation.customsDuty.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${order.quotation.totalAmount.toFixed(2)} {order.quotation.currency}</span>
                </div>
              </div>
            </div>
          )}

          <RefundRequest order={order} onUpdate={refreshOrder} />
        </div>
      )}
    </div>
  );
}