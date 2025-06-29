import type { ValidationResult, RiskLevel } from '../types';

// Supported domains whitelist
export const SUPPORTED_DOMAINS = [
  // Major E-commerce
  'amazon.com', 'amazon.ca', 'amazon.co.uk', 'amazon.de', 'amazon.fr',
  'ebay.com', 'aliexpress.com', 'temu.com', 'shein.com',
  
  // Fashion & Clothing
  'zara.com', 'hm.com', 'forever21.com', 'asos.com',
  'nike.com', 'adidas.com', 'uniqlo.com',
  'urbanoutfitters.com', 'ae.com', 'hollisterco.com',
  'abercrombie.com', 'victoriassecret.com',
  'calvinklein.com', 'tommy.com', 'ralphlauren.com',
  
  // Electronics & Tech
  'bestbuy.com', 'newegg.com', 'bhphotovideo.com',
  'apple.com', 'samsung.com', 'dell.com', 'hp.com',
  
  // Department Stores
  'walmart.com', 'target.com', 'macys.com', 'nordstrom.com',
  'sephora.com', 'ulta.com',
  
  // Specialty Retailers
  'bathandbodyworks.com', 'lululemon.com', 'gymshark.com',
  'prettylittlething.com', 'boohoo.com', 'missguidedus.com',
];

// Generate order ID in KS-25-###### format
export const generateOrderId = (): string => {
  // Get current counter from localStorage or start at 1
  const currentCounter = parseInt(localStorage.getItem('klynx_order_counter') || '0', 10);
  const nextCounter = currentCounter + 1;
  
  // Save updated counter
  localStorage.setItem('klynx_order_counter', nextCounter.toString());
  
  // Format as KS-25-XXXXXX (6 digits with leading zeros)
  return `KS-25-${nextCounter.toString().padStart(6, '0')}`;
};

// Validate order ID format
export const isValidOrderId = (orderId: string): boolean => {
  const orderIdRegex = /^KS-25-\d{6}$/;
  return orderIdRegex.test(orderId);
};

// Verify phone number for tracking (checks if phones match)
export const verifyPhoneForTracking = (inputPhone: string, storedPhone: string): boolean => {
  // Clean both phone numbers
  const inputClean = inputPhone.replace(/\D/g, '');
  const storedClean = storedPhone.replace(/\D/g, '');
  
  // Compare last 7 digits (local number) for Trinidad & Tobago
  return inputClean.slice(-7) === storedClean.slice(-7);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
};

// Check if domain is supported
export const isDomainSupported = (domain: string): boolean => {
  return SUPPORTED_DOMAINS.some(supportedDomain => 
    domain.includes(supportedDomain) || supportedDomain.includes(domain)
  );
};

// Assess risk level based on domain and other factors
export const assessRiskLevel = (domain: string, productType?: string): RiskLevel => {
  // High risk domains
  const highRiskDomains = ['aliexpress.com', 'temu.com'];
  if (highRiskDomains.some(d => domain.includes(d))) {
    return 'high';
  }
  
  // Medium risk based on product type
  if (productType && ['electronics', 'jewelry', 'perfume'].includes(productType.toLowerCase())) {
    return 'medium';
  }
  
  // Low risk for established retailers
  const lowRiskDomains = ['amazon.com', 'walmart.com', 'target.com', 'bestbuy.com'];
  if (lowRiskDomains.some(d => domain.includes(d))) {
    return 'low';
  }
  
  return 'medium';
};

// Validate link with timeout
export const validateLink = async (url: string, _timeout = 5000): Promise<ValidationResult> => {
  // Basic URL validation
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      isSupported: false,
      riskLevel: 'restricted',
      validationMethod: 'auto',
      requiresManualReview: false,
      errorMessage: 'Invalid URL format',
    };
  }
  
  const domain = extractDomain(url);
  
  // Check if domain is supported
  if (!isDomainSupported(domain)) {
    return {
      isValid: true,
      isSupported: false,
      riskLevel: 'restricted',
      validationMethod: 'auto',
      requiresManualReview: true,
      errorMessage: 'This retailer is not currently supported',
    };
  }
  
  // Assess risk level
  const riskLevel = assessRiskLevel(domain);
  
  // For MVP, we'll return a successful validation
  // In production, this would make actual HTTP requests
  return {
    isValid: true,
    isSupported: true,
    riskLevel,
    validationMethod: 'auto',
    requiresManualReview: riskLevel === 'high',
    stockStatus: 'in_stock',
    productInfo: {
      title: 'Product from ' + domain,
      price: 0,
      currency: 'USD',
      availability: 'Available',
    },
  };
};

// Format phone number for Trinidad & Tobago
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Trinidad & Tobago format: +1 868 XXX XXXX
  if (digits.startsWith('1868')) {
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  } else if (digits.startsWith('868')) {
    return `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else if (digits.length === 7) {
    return `+1 868 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  
  return phone;
};

// Validate Trinidad & Tobago phone number
export const isValidTTPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return (
    digits.length === 7 || 
    (digits.length === 10 && digits.startsWith('868')) ||
    (digits.length === 11 && digits.startsWith('1868'))
  );
};