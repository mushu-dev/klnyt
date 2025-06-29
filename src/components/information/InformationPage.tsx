import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Shield, ExternalLink } from 'lucide-react';

export function InformationPage() {
  const [expandedSection, setExpandedSection] = useState<'terms' | 'verification' | null>('terms');

  const toggleSection = (section: 'terms' | 'verification') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Information Center</h1>
        <p className="text-gray-600 mb-6">
          Everything you need to know about using Klynt Shipment services safely and effectively.
          <br />
          <strong className="text-caribbean-blue">Very fast and easy process!!</strong>
        </p>
        
        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => scrollToSection('terms')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>
          <button
            onClick={() => scrollToSection('verification')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Verification Process</span>
          </button>
        </div>
      </div>

      {/* Terms & Conditions Section */}
      <div id="terms" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('terms')}
          className="w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Terms & Conditions</h2>
            </div>
            {expandedSection === 'terms' ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </button>
        
        {expandedSection === 'terms' && (
          <div className="p-6 space-y-6 animate-slide-down">
            
            {/* Section 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">1. How It Works</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Klynt Shipment helps you order from international stores</strong> by allowing you to submit product links through our website. Once confirmed, we handle the purchase and shipping process on your behalf, ensuring a smooth and hassle-free experience.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">2. Payment Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>All orders must be paid in full before processing</strong> unless otherwise agreed upon in writing. <strong>Final prices may vary</strong> based on exchange rates, supplier changes, or applicable taxes and duties.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">3. Shipping & Delivery</h3>
              <p className="text-gray-700 leading-relaxed">
                While we strive to deliver within the estimated time frame, <strong>delays may occur</strong> due to customs processing, international shipping carriers, or third-party sellers. These delays are outside of our control.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">4. Refund & Return Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Refunds are only issued under specific circumstances.</strong> To request a refund, please fill out our WhatsApp refund form, including your name, email, and reason for the request. Each case will be reviewed individually.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">5. Item Restrictions</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>We do not ship prohibited goods, hazardous materials, or fragile items</strong> that require special handling. For a full list of restricted items, please refer to the official Customs and Excise Division of Trinidad and Tobago:
              </p>
              <a 
                href="http://www.customs.gov.tt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-caribbean-blue hover:text-cyan-700 font-medium"
              >
                <span>👉 http://www.customs.gov.tt</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">6. Disclaimer of Responsibility</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Klynt Shipment is an ordering and forwarding service.</strong> We are not responsible for the quality, authenticity, or condition of products sold by the original vendor, nor for any delays caused by customs, sellers, or shipping providers.
              </p>
            </div>

            {/* Section 7 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">7. Your Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Please ensure that all details</strong>—such as item size, color, order quantity, and product type—<strong>are correct before submitting your order.</strong> Klynt Shipment is not liable for mistakes made due to incorrect submissions.
              </p>
            </div>

            {/* Section 8 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">8. Privacy</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Your privacy matters to us.</strong> We only collect the information needed to process your order: name, phone number, email address, and delivery address. <strong>We will never request your passwords</strong> or share your data with third parties.
              </p>
            </div>

            {/* Section 9 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">9. Updates</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Our terms may be updated periodically.</strong> Please revisit this page to stay informed of any changes.
              </p>
            </div>

            {/* Closing */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium text-center">
                Thank you for choosing Klynt Shipment — simple, secure, and reliable.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Verification Process Section */}
      <div id="verification" className="bg-white shadow-sm rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('verification')}
          className="w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Verification Process</h2>
            </div>
            {expandedSection === 'verification' ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </button>
        
        {expandedSection === 'verification' && (
          <div className="p-6 space-y-6 animate-slide-down">
            
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                At Klynt Shipment, <strong>we are committed to providing the most secure and authentic international shopping experience.</strong> Our verification system is designed to help protect you from ordering fraudulent or inauthentic items.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">We do our utmost to:</h4>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Ensure every submitted order</strong> is processed with care and legitimacy.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Source products only from trustworthy websites</strong> and global vendors.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span><strong>Prevent scams, malware, and low-trust sellers</strong> from affecting your order.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">How the Verification Process Works</h3>
              <p className="text-gray-700">
                <strong>Every order you submit goes through the following steps:</strong>
              </p>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Order Received</h4>
                    <p className="text-gray-600 text-sm">
                      Once you submit your product link(s), our system receives your request and begins initial processing.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Link Analysis Begins</h4>
                    <p className="text-gray-600 text-sm">
                      The system scans and analyzes each link to determine the legitimacy of the website and product.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Site Trust Evaluation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Based on the website and seller, the order is categorized with a colored badge:</strong>
                    </p>
                    
                    <div className="space-y-3">
                      {/* Green Badge */}
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-700">Green (Verified & Safe):</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm ml-6">
                        The item comes from a trusted and verified source. <strong>Your order can be processed normally.</strong>
                      </p>
                      
                      {/* Amber Badge */}
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-yellow-700">Amber (Verified but Risky):</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm ml-6">
                        The item is from a real website, but there's a <strong>moderate risk</strong> due to factors like:
                      </p>
                      <ul className="text-gray-600 text-sm ml-10 space-y-1">
                        <li className="flex items-start space-x-1">
                          <span>•</span>
                          <span>Poor seller ratings</span>
                        </li>
                        <li className="flex items-start space-x-1">
                          <span>•</span>
                          <span>History of delayed shipping</span>
                        </li>
                        <li className="flex items-start space-x-1">
                          <span>•</span>
                          <span>Malware threats or low trust signals</span>
                        </li>
                      </ul>
                      <p className="text-gray-600 text-sm ml-6">
                        <strong>You may still proceed with the order,</strong> but we will notify you of the risk.
                      </p>
                      
                      {/* Red Badge */}
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-red-700">Red (Unverified or Unsafe):</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm ml-6">
                        <strong>The website is not trusted or contains serious risks.</strong> The order will be blocked and will not be processed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-caribbean-blue text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Final Confirmation & Manual Review</h4>
                    <p className="text-gray-600 text-sm">
                      <strong>Orders flagged for amber risk or special concerns</strong> may receive a manual review before final approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 leading-relaxed">
                <strong>This process is in place to safeguard both your money and your items.</strong> We appreciate your understanding and cooperation as we work to make international ordering safe, smooth, and reliable.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}