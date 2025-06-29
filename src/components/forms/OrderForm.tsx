import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingCart, Loader2, MessageCircle } from 'lucide-react';
import { isValidTTPhone, formatPhoneNumber, generateOrderId } from '../../utils/validation';
import { SingleItemForm } from './SingleItemForm';
import { MultiItemForm } from './MultiItemForm';
import type { Order, OrderItem, TrafficSource } from '../../types';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import { createBackupSystem } from '../../utils/backup';
import { WhatsAppOrderButton } from '../whatsapp/WhatsAppOrderButton';
import { FormField } from '../common/FormField';

const customerInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().refine(isValidTTPhone, 'Invalid Trinidad & Tobago phone number'),
  address: z.string().min(10, 'Please provide a complete delivery address'),
  specialInstructions: z.string().optional(),
});

type CustomerInfoForm = z.infer<typeof customerInfoSchema>;

export function OrderForm() {
  const [isMultiItem, setIsMultiItem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState<CustomerInfoForm | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerInfoForm>({
    resolver: zodResolver(customerInfoSchema),
  });

  const getTrafficSource = (): TrafficSource => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    
    if (source === 'instagram') return 'instagram';
    if (document.referrer.includes('instagram.com')) return 'instagram';
    return 'direct';
  };

  const onSubmit = async (data: CustomerInfoForm) => {
    if (items.length === 0) {
      alert('Please add at least one item to your order');
      return;
    }

    // If this is the first submission, just store form data and show options
    if (!formData) {
      setFormData(data);
      return;
    }

    // This is the "Save & Submit" flow
    setIsSubmitting(true);

    try {
      const order: Order = {
        orderId: generateOrderId(),
        customerId: '', // Will be set by backend
        status: 'submitted',
        automationEnabled: true,
        items,
        customerInfo: {
          ...formData,
          phone: formatPhoneNumber(formData.phone),
          trafficSource: getTrafficSource(),
        },
        statusHistory: [{
          status: 'submitted',
          timestamp: Date.now(),
          updatedBy: 'system',
          updateMethod: 'auto',
        }],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save to backup
      const backup = createBackupSystem();
      await backup.saveOrder(order);

      // In production, this would save to Convex
      console.log('Order submitted:', order);

      // Generate WhatsApp link and redirect
      const whatsappLink = generateWhatsAppLink(order);
      window.location.href = whatsappLink;
      
      // Reset form
      reset();
      setItems([]);
      setFormData(null);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Your Order</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Single Item</span>
            <button
              type="button"
              onClick={() => setIsMultiItem(!isMultiItem)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isMultiItem ? 'bg-caribbean-blue' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMultiItem ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">Multiple Items</span>
          </div>
        </div>
        
        <p className="text-gray-600">
          Add products from your favorite international retailers and we'll handle the shipping to Trinidad & Tobago.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Items Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isMultiItem ? 'Your Items' : 'Product Details'}
          </h3>
          
          {isMultiItem ? (
            <MultiItemForm items={items} onItemsChange={setItems} />
          ) : (
            <SingleItemForm items={items} onItemsChange={setItems} />
          )}
        </div>

        {/* Customer Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" error={errors.name?.message} required>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="John Doe"
              />
            </FormField>

            <FormField label="Email Address" error={errors.email?.message} required>
              <input
                {...register('email')}
                type="email"
                className="input-field"
                placeholder="john@example.com"
              />
            </FormField>

            <FormField 
              label="Phone Number" 
              error={errors.phone?.message} 
              required
              helpText="Trinidad & Tobago format: 868-XXX-XXXX"
            >
              <input
                {...register('phone')}
                type="tel"
                className="input-field"
                placeholder="868-123-4567"
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField 
                label="Delivery Address" 
                error={errors.address?.message} 
                required
                helpText="Please provide your complete delivery address including city"
              >
                <textarea
                  {...register('address')}
                  rows={3}
                  className="input-field"
                  placeholder="123 Main Street, Port of Spain, Trinidad"
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Special Instructions" helpText="Any special delivery instructions or notes">
                <textarea
                  {...register('specialInstructions')}
                  rows={2}
                  className="input-field"
                  placeholder="Any special delivery instructions or product preferences"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Submit Options */}
        <div className="border-t pt-6">
          {formData && items.length > 0 ? (
            // Show WhatsApp options after form submission
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">Choose how to submit your order:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Traditional flow - saves to system first */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-caribbean-blue hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Save & Submit via WhatsApp
                    </>
                  )}
                </button>

                {/* Direct WhatsApp submission */}
                <WhatsAppOrderButton
                  order={{
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    product: `${items.length} item(s) from international retailers`,
                    link: items.map(item => item.productLink).join(', '),
                    quantity: items.reduce((total, item) => total + item.quantity, 0),
                    notes: formData.specialInstructions || '',
                  }}
                  className="w-full"
                >
                  <>
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Submit Directly via WhatsApp
                  </>
                </WhatsAppOrderButton>
              </div>
              
              <div className="text-center space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>Save & Submit:</strong> Saves to our system first, then opens WhatsApp
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Direct Submit:</strong> Opens WhatsApp immediately with your order details
                </p>
              </div>
            </div>
          ) : (
            // Initial submit button - validates form and shows options
            <div>
              <button
                type="submit"
                disabled={items.length === 0}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-caribbean-blue hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-caribbean-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Review Order & Choose Submission Method
              </button>
              
              <p className="mt-2 text-sm text-gray-600 text-center">
                Fill out the form to see submission options
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}