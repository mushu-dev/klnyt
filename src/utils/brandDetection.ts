// Brand detection utility for order forms
export interface BrandInfo {
  name: string;
  category: string;
  logo: string;
  riskLevel: 'low' | 'medium' | 'high';
  processingTime: string;
}

export const brandDatabase: Record<string, BrandInfo> = {
  'amazon.com': {
    name: 'Amazon',
    category: 'General Shopping',
    logo: '/src/assets/images/brands/amazon-logo.jpeg',
    riskLevel: 'low',
    processingTime: '3-5 business days'
  },
  'shein.com': {
    name: 'SHEIN',
    category: 'Fashion',
    logo: '/src/assets/images/brands/shein-logo.jpeg',
    riskLevel: 'low',
    processingTime: '7-14 business days'
  },
  'netflix.com': {
    name: 'Netflix',
    category: 'Streaming Services',
    logo: '/src/assets/images/brands/netflix-logo.jpeg',
    riskLevel: 'low',
    processingTime: '1-2 business days'
  },
  'playstation.com': {
    name: 'PlayStation',
    category: 'Gaming',
    logo: '/src/assets/images/brands/playstation-logo.jpeg',
    riskLevel: 'low',
    processingTime: '1-3 business days'
  },
  'samsung.com': {
    name: 'Samsung',
    category: 'Electronics',
    logo: '/src/assets/images/brands/samsung-logo.jpeg',
    riskLevel: 'medium',
    processingTime: '5-10 business days'
  },
  'roblox.com': {
    name: 'Roblox',
    category: 'Gaming',
    logo: '/src/assets/images/brands/roblox-logo.jpeg',
    riskLevel: 'low',
    processingTime: '1-2 business days'
  }
};

/**
 * Detects brand from a URL
 */
export function detectBrandFromUrl(url: string): BrandInfo | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Remove www. prefix
    const cleanHostname = hostname.replace(/^www\./, '');
    
    // Check exact match first
    if (brandDatabase[cleanHostname]) {
      return brandDatabase[cleanHostname];
    }
    
    // Check partial matches for subdomains
    for (const domain in brandDatabase) {
      if (cleanHostname.includes(domain) || domain.includes(cleanHostname)) {
        return brandDatabase[domain];
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Gets category information for display
 */
export function getCategoryInfo(category: string) {
  const categoryMap = {
    'Fashion': { icon: '👕', color: '#FF69B4' },
    'Electronics': { icon: '📱', color: '#1E3A8A' },
    'Gaming': { icon: '🎮', color: '#1E40AF' },
    'General Shopping': { icon: '🛒', color: '#FF8C00' },
    'Streaming Services': { icon: '📺', color: '#DC2626' }
  };
  
  return categoryMap[category as keyof typeof categoryMap] || { icon: '🏪', color: '#6B7280' };
}

/**
 * Validates if URL is from a supported retailer
 */
export function isSupportedRetailer(url: string): boolean {
  return detectBrandFromUrl(url) !== null;
}

/**
 * Gets risk level styling
 */
export function getRiskLevelStyling(riskLevel: 'low' | 'medium' | 'high') {
  switch (riskLevel) {
    case 'low':
      return { color: '#059669', bg: '#ECFDF5', text: 'Low Risk - Fast Processing' };
    case 'medium':
      return { color: '#D97706', bg: '#FFFBEB', text: 'Medium Risk - Standard Processing' };
    case 'high':
      return { color: '#DC2626', bg: '#FEF2F2', text: 'High Risk - Extended Processing' };
    default:
      return { color: '#6B7280', bg: '#F9FAFB', text: 'Unknown Risk' };
  }
}