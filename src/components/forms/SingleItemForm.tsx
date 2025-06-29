import { useState, useEffect } from 'react';
import { Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { OrderItem } from '../../types';
import { validateLink } from '../../utils/validation';
import { LinkValidator } from '../validation/LinkValidator';
import { detectBrandFromUrl, getRiskLevelStyling } from '../../utils/brandDetection';

interface SingleItemFormProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

export function SingleItemForm({ items, onItemsChange }: SingleItemFormProps) {
  const [productLink, setProductLink] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [detectedBrand, setDetectedBrand] = useState<any>(null);

  useEffect(() => {
    // If there's already an item, populate the form
    if (items.length > 0) {
      setProductLink(items[0].productLink);
      setQuantity(items[0].quantity);
    }
  }, [items]);

  const handleLinkChange = async (link: string) => {
    setProductLink(link);
    
    // Detect brand immediately when URL is entered
    const brandInfo = detectBrandFromUrl(link);
    setDetectedBrand(brandInfo);
    
    if (link.length > 10) {
      setIsValidating(true);
      try {
        const result = await validateLink(link);
        setValidationResult(result);
        
        // Update the items array
        const newItem: OrderItem = {
          productLink: link,
          quantity,
          validationStatus: result.isValid ? 'valid' : 'invalid',
          validationMethod: result.validationMethod,
          stockStatus: result.stockStatus || 'unknown',
          riskLevel: result.riskLevel,
          adminOverride: false,
        };
        
        onItemsChange([newItem]);
      } catch (error) {
        console.error('Validation error:', error);
        setValidationResult(null);
      } finally {
        setIsValidating(false);
      }
    } else {
      setValidationResult(null);
      setDetectedBrand(null);
      onItemsChange([]);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    
    if (items.length > 0) {
      const updatedItem = { ...items[0], quantity: newQuantity };
      onItemsChange([updatedItem]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="productLink" className="block text-sm font-medium text-gray-700 mb-1">
          Product Link
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={productLink}
            onChange={(e) => handleLinkChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
            placeholder="https://www.amazon.com/product..."
            required
          />
          {isValidating && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
          {!isValidating && validationResult && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {validationResult.isValid && validationResult.isSupported ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        
        {/* Brand Detection Display */}
        {detectedBrand && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-white rounded border border-gray-200 p-1">
                <img 
                  src={detectedBrand.logo} 
                  alt={`${detectedBrand.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{detectedBrand.name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{detectedBrand.category}</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getRiskLevelStyling(detectedBrand.riskLevel).bg,
                      color: getRiskLevelStyling(detectedBrand.riskLevel).color
                    }}
                  >
                    {getRiskLevelStyling(detectedBrand.riskLevel).text}
                  </div>
                  <span className="text-xs text-gray-500">
                    {detectedBrand.processingTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {validationResult && (
          <LinkValidator result={validationResult} />
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantity
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
          min="0"
          max="99"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
          required
        />
      </div>

      {validationResult?.productInfo && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Product Information</h4>
          <p className="text-sm text-gray-600">{validationResult.productInfo.title}</p>
          {validationResult.productInfo.price > 0 && (
            <p className="text-sm font-semibold text-gray-900 mt-1">
              Estimated Price: ${validationResult.productInfo.price} {validationResult.productInfo.currency}
            </p>
          )}
        </div>
      )}
    </div>
  );
}