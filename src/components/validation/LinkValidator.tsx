import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { ValidationResult } from '../../types';

interface LinkValidatorProps {
  result: ValidationResult;
}

export function LinkValidator({ result }: LinkValidatorProps) {
  if (!result.isValid) {
    return (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">Invalid Link</p>
            <p className="text-sm text-red-700 mt-1">
              {result.errorMessage || 'Please enter a valid product URL'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result.isSupported) {
    return (
      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium text-yellow-800">Retailer Not Supported</p>
            <p className="text-sm text-yellow-700 mt-1">
              This retailer requires manual review. Our team will verify availability.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getRiskBadge = () => {
    switch (result.riskLevel) {
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Info className="h-3 w-3 mr-1" />
            Medium Risk
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High Risk - May have delays
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Restricted - Manual approval required
          </span>
        );
    }
  };

  const getStockStatus = () => {
    if (!result.stockStatus) return null;

    const statusMap: Record<string, { color: string; icon: any; text: string }> = {
      in_stock: { color: 'green', icon: CheckCircle, text: 'In Stock' },
      limited_stock: { color: 'yellow', icon: Info, text: 'Limited Stock' },
      low_stock: { color: 'orange', icon: AlertTriangle, text: 'Low Stock' },
      out_of_stock: { color: 'red', icon: AlertCircle, text: 'Out of Stock' },
    };

    const status = statusMap[result.stockStatus];
    if (!status) return null;

    const Icon = status.icon;
    return (
      <div className={`flex items-center text-sm text-${status.color}-700`}>
        <Icon className={`h-4 w-4 mr-1 text-${status.color}-500`} />
        {status.text}
      </div>
    );
  };

  return (
    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">Valid Product Link</p>
            {getStockStatus()}
          </div>
        </div>
        {getRiskBadge()}
      </div>
      
      {result.requiresManualReview && (
        <p className="mt-2 text-xs text-gray-600 ml-8">
          This item will be manually reviewed by our team
        </p>
      )}
    </div>
  );
}