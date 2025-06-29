import { useState } from 'react';
import { Plus, Trash2, Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { OrderItem } from '../../types';
import { validateLink } from '../../utils/validation';
import { LinkValidator } from '../validation/LinkValidator';

interface MultiItemFormProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

interface ItemFormData {
  id: string;
  productLink: string;
  quantity: number;
  isValidating: boolean;
  validationResult: any;
}

export function MultiItemForm({ items, onItemsChange }: MultiItemFormProps) {
  const [formItems, setFormItems] = useState<ItemFormData[]>(() => {
    if (items.length > 0) {
      return items.map((item, index) => ({
        id: `item-${index}`,
        productLink: item.productLink,
        quantity: item.quantity,
        isValidating: false,
        validationResult: null,
      }));
    }
    return [{
      id: 'item-0',
      productLink: '',
      quantity: 0,
      isValidating: false,
      validationResult: null,
    }];
  });

  const handleLinkChange = async (id: string, link: string) => {
    const updatedFormItems = formItems.map(item => 
      item.id === id ? { ...item, productLink: link } : item
    );
    setFormItems(updatedFormItems);

    if (link.length > 10) {
      // Start validation
      const validatingItems = updatedFormItems.map(item =>
        item.id === id ? { ...item, isValidating: true } : item
      );
      setFormItems(validatingItems);

      try {
        const result = await validateLink(link);
        
        const withResult = validatingItems.map(item =>
          item.id === id 
            ? { ...item, isValidating: false, validationResult: result }
            : item
        );
        setFormItems(withResult);

        // Update parent with validated items
        updateParentItems(withResult);
      } catch (error) {
        console.error('Validation error:', error);
        const withError = validatingItems.map(item =>
          item.id === id ? { ...item, isValidating: false } : item
        );
        setFormItems(withError);
      }
    } else {
      updateParentItems(updatedFormItems);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedFormItems = formItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setFormItems(updatedFormItems);
    updateParentItems(updatedFormItems);
  };

  const updateParentItems = (formItems: ItemFormData[]) => {
    const validItems: OrderItem[] = formItems
      .filter(item => item.productLink.length > 10)
      .map(item => ({
        productLink: item.productLink,
        quantity: item.quantity,
        validationStatus: item.validationResult?.isValid ? 'valid' : 'pending',
        validationMethod: item.validationResult?.validationMethod || 'auto',
        stockStatus: item.validationResult?.stockStatus || 'unknown',
        riskLevel: item.validationResult?.riskLevel || 'medium',
        adminOverride: false,
        estimatedPrice: item.validationResult?.productInfo?.price,
      }));
    
    onItemsChange(validItems);
  };

  const addItem = () => {
    const newItem: ItemFormData = {
      id: `item-${Date.now()}`,
      productLink: '',
      quantity: 0,
      isValidating: false,
      validationResult: null,
    };
    setFormItems([...formItems, newItem]);
  };

  const removeItem = (id: string) => {
    const updatedItems = formItems.filter(item => item.id !== id);
    setFormItems(updatedItems);
    updateParentItems(updatedItems);
  };

  return (
    <div className="space-y-4">
      {formItems.map((item, index) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-gray-900">Item #{index + 1}</h4>
            {formItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={item.productLink}
                onChange={(e) => handleLinkChange(item.id, e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
                placeholder="https://www.amazon.com/product..."
                required
              />
              {item.isValidating && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                </div>
              )}
              {!item.isValidating && item.validationResult && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {item.validationResult.isValid && item.validationResult.isSupported ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {item.validationResult && (
              <LinkValidator result={item.validationResult} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
              min="0"
              max="99"
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-caribbean-blue focus:border-caribbean-blue"
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-blue"
      >
        <Plus className="h-5 w-5 mx-auto" />
        Add Another Item
      </button>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm font-medium text-caribbean-blue">
          Total Items: {formItems.reduce((sum, item) => sum + item.quantity, 0)}
        </p>
      </div>
    </div>
  );
}