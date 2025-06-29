import { Check, Clock, Package, Truck, MapPin } from 'lucide-react';
import type { OrderStatus } from '../../types';

interface StatusDisplayProps {
  currentStatus: OrderStatus;
  statusHistory?: Array<{
    status: string;
    timestamp: number;
    notes?: string;
  }>;
}

const STATUS_STEPS = [
  { key: 'submitted', label: 'Order Submitted', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'quotation_sent', label: 'Quote Sent', icon: Clock },
  { key: 'quote_approved', label: 'Quote Approved', icon: Check },
  { key: 'payment_received', label: 'Payment Received', icon: Check },
  { key: 'purchased', label: 'Items Purchased', icon: Package },
  { key: 'in_transit_international', label: 'International Transit', icon: Truck },
  { key: 'arrived_local', label: 'Arrived in Trinidad', icon: MapPin },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Check },
];

export function StatusDisplay({ currentStatus, statusHistory }: StatusDisplayProps) {
  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === currentStatus);
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-caribbean-green text-white';
      case 'current':
        return 'bg-caribbean-blue text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
      
      <div className="space-y-4">
        {STATUS_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${getStepColor(status)}
              `}>
                {status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <p className={`text-sm font-medium ${
                  status === 'current' ? 'text-caribbean-blue' : 
                  status === 'completed' ? 'text-caribbean-green' : 
                  'text-gray-500'
                }`}>
                  {step.label}
                </p>
                
                {status === 'current' && (
                  <p className="text-xs text-gray-600 mt-1">
                    Currently processing...
                  </p>
                )}
              </div>
              
              {index < STATUS_STEPS.length - 1 && (
                <div className={`
                  absolute left-4 mt-8 w-0.5 h-6
                  ${status === 'completed' ? 'bg-caribbean-green' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
      
      {statusHistory && statusHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Status History</h4>
          <div className="space-y-2">
            {statusHistory.slice(-3).map((entry, index) => (
              <div key={index} className="text-xs text-gray-600">
                <span className="font-medium">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
                {' - '}{entry.status.replace('_', ' ')}
                {entry.notes && (
                  <span className="block text-gray-500 mt-1">{entry.notes}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}