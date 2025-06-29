import { useMemo } from 'react';
import { TrendingUp, DollarSign, Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { OrderStatistics } from '../../types';

interface OrderStatisticsProps {
  orders: any[];
}

export function OrderStatistics({ orders }: OrderStatisticsProps) {
  const statistics = useMemo((): OrderStatistics => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let totalRevenue = 0;
    let pendingRefunds = 0;
    let recentOrders = 0;
    let completedOrders = 0;
    
    const statusBreakdown: Record<string, number> = {};
    
    for (const order of orders) {
      // Status breakdown
      statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;
      
      // Revenue calculation (exclude cancelled and refunded orders)
      if (order.quotation && !['quote_rejected', 'issue_refund'].includes(order.status)) {
        totalRevenue += order.quotation.totalAmount || 0;
      }
      
      // Pending refunds
      if (order.refundRequest?.requested && order.refundRequest.status !== 'completed') {
        pendingRefunds += order.refundRequest.requestedAmount || 0;
      }
      
      // Recent orders (last 7 days)
      const orderDate = new Date(order.createdAt);
      if (orderDate >= sevenDaysAgo) {
        recentOrders++;
      }
      
      // Completed orders
      if (order.status === 'delivered') {
        completedOrders++;
      }
    }
    
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const completionRate = orders.length > 0 ? (completedOrders / orders.length) * 100 : 0;
    
    return {
      totalOrders: orders.length,
      statusBreakdown,
      totalRevenue,
      pendingRefunds,
      recentOrders,
      averageOrderValue,
      completionRate
    };
  }, [orders]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      quotation_pending: 'bg-yellow-100 text-yellow-800',
      quotation_sent: 'bg-purple-100 text-purple-800',
      payment_received: 'bg-emerald-100 text-emerald-800',
      delivered: 'bg-green-100 text-green-800',
      quote_rejected: 'bg-red-100 text-red-800',
      issue_refund: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-caribbean-blue" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${statistics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Orders</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.recentOrders}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 ml-2">Financial Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Order Value:</span>
              <span className="text-sm font-medium text-gray-900">${statistics.averageOrderValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending Refunds:</span>
              <span className="text-sm font-medium text-red-600">${statistics.pendingRefunds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Net Revenue:</span>
              <span className="text-sm font-medium text-green-600">
                ${(statistics.totalRevenue - statistics.pendingRefunds).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-caribbean-blue" />
            <h3 className="text-lg font-semibold text-gray-900 ml-2">Order Status Breakdown</h3>
          </div>
          <div className="space-y-2">
            {Object.entries(statistics.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                  {status.replace('_', ' ')}
                </span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {statistics.pendingRefunds > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-800">Pending Refunds Alert</h4>
              <p className="text-sm text-red-700 mt-1">
                There are ${statistics.pendingRefunds.toFixed(2)} in pending refunds that require attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {statistics.completionRate >= 80 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">High Performance</h4>
              <p className="text-sm text-green-700 mt-1">
                Excellent completion rate of {statistics.completionRate.toFixed(1)}%! Keep up the great work.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}