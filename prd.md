# Klynt Shipment MVP - Product Requirements Document
## Updated with Risk Mitigations

### 1. Executive Summary

#### 1.1 Product Overview
Klynt Shipment is a lean, local-facing MVP shipping service targeting Caribbean users (primarily Trinidad & Tobago). The platform enables users to submit international product orders via a streamlined web interface, with order processing and communication handled through WhatsApp integration.

#### 1.2 Core Value Proposition
- Simplified international shopping for Caribbean customers
- WhatsApp-based communication for familiar user experience
- Local payment methods only (no digital payments required)
- Real-time order tracking and status management
- Built-in fraud protection and customs compliance
- Automated processes to reduce dependency on manual operations

### 2. Technical Architecture

#### 2.1 Technology Stack
- **Frontend**: Built with Claude Code
- **Backend/Database**: Convex
- **Repository**: GitHub
- **Communication**: WhatsApp Business integration
- **Backup Storage**: Local file system with Convex sync
- **Automation**: Email queuing system and shared CRM board integration

#### 2.2 System Architecture
```
User Interface (Web App)
↓
Order Processing System (with automation)
↓
Convex Database + Local Backup
↓
WhatsApp Business API + Email Queue
↓
Order Fulfillment Workflow (with status automation)
```

### 3. Core Features & Specifications

#### 3.1 Order Management System

##### 3.1.1 Multi/Single Item Order Form
**Components:**
- Toggle switch: Single Item / Multiple Items mode
- Dynamic form fields based on selection
- Required fields validation
- Real-time link validation with fallback options
- Prominent form link integration for Instagram traffic

**Single Item Form Fields:**
- Product Link (required)
- Quantity (default: 1)
- Customer Name (required)
- Email Address (required)
- Phone Number (required)
- Delivery Address (required)
- Special Instructions (optional)

**Multiple Items Form Fields:**
- Add/Remove item functionality
- Individual product links per item
- Quantity per item
- Consolidated customer information
- Total items counter

##### 3.1.2 Enhanced Link Validation System
**Modular Validation Logic:**
- Primary automated validation
- Fallback to manual review queue
- Admin override capabilities
- Timeout protection (max 5 seconds per validation)

**Validation Checks:**
- URL format validation
- Domain whitelist verification
- Product page accessibility check
- Fraudulent site detection
- Regional restriction detection

**Supported Retailers (Dynamic Whitelist):**

**Major E-commerce Platforms:**
- Amazon (.com, .ca, .uk, .de, .fr)
- eBay (global)
- AliExpress
- Temu
- Shein

**Fashion & Clothing Brands:**
- Zara, H&M, Forever 21, ASOS
- Nike, Adidas, Uniqlo
- Urban Outfitters, American Eagle, Hollister
- Abercrombie & Fitch, Victoria's Secret
- Calvin Klein, Tommy Hilfiger, Ralph Lauren

**Electronics & Tech:**
- Best Buy, Newegg, B&H Photo
- Apple Store, Samsung, Dell, HP

**Department Stores:**
- Walmart, Target, Macy's, Nordstrom
- Sephora, Ulta Beauty

**Specialty Retailers:**
- Bath & Body Works, Lululemon, Gymshark
- PrettyLittleThing, Boohoo, Missguided

**Validation Response Types:**
- ✅ Valid & Supported
- ⚠ Valid but High Risk (with admin override option)
- ❌ Invalid/Unsupported
- 🔄 Checking...
- 🔧 Manual Review Required

##### 3.1.3 Stock Availability Verification
**Pre-Submission Checks:**
- Real-time stock status ping
- Price verification
- Availability confirmation modal
- Stock change notifications

**Stock Status Indicators:**
- 🟢 In Stock - Ready to Order
- 🟡 Limited Stock - Order Soon
- 🟠 Low Stock - May Become Unavailable
- 🔴 Out of Stock - Cannot Process
- ❓ Unable to Verify - Proceed with Caution

#### 3.2 Automated Order Status Management System

##### 3.2.1 Order Status Flow with Automation
**Status Progression:**
1. **Submitted** - Order received via form
2. **Confirmed** - WhatsApp conversation initiated (AUTO)
3. **Quotation Pending** - Calculating pricing and fees
4. **Quotation Sent** - Quote provided to customer (AUTO)
5. **Awaiting Approval** - Customer reviewing quotation
6. **Quote Approved** - Customer confirmed to proceed
7. **Payment Pending** - Awaiting customer payment
8. **Payment Received** - Payment confirmed
9. **Processing** - Purchasing from retailer
10. **Purchased** - Item bought successfully
11. **In Transit (International)** - Shipped to consolidation
12. **Arrived (Local)** - Reached Trinidad facility
13. **Out for Delivery** - Local delivery in progress
14. **Delivered** - Order completed
15. **Quote Rejected** - Customer declined quotation
16. **Issue/Refund** - Problem resolution needed

##### 3.2.2 Light Status Automation System
**Automated Triggers:**
- Email notifications for status changes
- Shared CRM board updates
- WhatsApp message templates
- Customer notification scheduling

**Manual Override Controls:**
- Admin can disable automation per order
- Emergency manual status updates
- Bulk automation controls
- Fallback to manual processes

##### 3.2.3 Admin Status Control Panel
**One-Click Status Updates:**
- Quick action buttons for each status
- Bulk status update capability
- Automated timestamp logging
- Customer notification triggers (auto/manual toggle)

##### 3.2.4 Customer Order Tracking
**Public Order Lookup:**
- Order ID input field
- Phone number verification
- Real-time status display
- Estimated delivery dates
- Contact support option

#### 3.3 Enhanced Refund System

##### 3.3.1 Automated Refund FAQ
**Embedded Refund Information:**
- Common refund scenarios
- Processing timeframes
- Required documentation
- Contact information
- Self-service options

##### 3.3.2 Refund Request Process
**Streamlined Workflow:**
1. Order ID verification
2. Issue category selection (dropdown)
3. Evidence submission (photos, receipts)
4. Automated acknowledgment
5. Review and approval workflow
6. Refund processing (local methods)

**Auto-Reply System:**
- Immediate confirmation messages
- Status update notifications
- Expected resolution timeframes
- Escalation procedures

#### 3.4 Shipping Risk Management

##### 3.4.1 Enhanced Risk Assessment
**Risk Factors Analysis:**
- Item category analysis
- Customs duty estimation
- Import restriction checks
- Brand authenticity verification
- Packaging requirements
- Documentation needs

**Risk Levels with Admin Override:**
- 🟢 Low Risk - Standard processing
- 🟡 Medium Risk - Additional documentation may be required
- 🟠 High Risk - Likely customs delays/duties
- 🔴 Restricted - Requires manual approval
- 🔧 Admin Override Available - For edge cases

##### 3.4.2 Shipping Risk Badge System
**Dynamic Risk Display:**
- Real-time risk assessment
- Customer-friendly explanations
- Admin override notifications
- Alternative suggestions for high-risk items

#### 3.5 Instagram Integration & Traffic Management

##### 3.5.1 Social Media Integration
**Instagram Story Integration:**
- Prominent form link placement
- Call-to-action buttons
- QR code generation for easy access
- Traffic source tracking

**Link Pinning Strategy:**
- Bio link optimization
- Story highlights for form access
- Regular story updates with form links
- Engagement tracking

##### 3.5.2 Traffic Flow Optimization
**Conversion Funnel:**
1. Instagram Story/Post → Form Link
2. Landing Page → Order Form
3. Form Submission → WhatsApp Redirect
4. WhatsApp Engagement → Order Processing

### 4. Backend Architecture & Data Management

#### 4.1 Convex Database Schema

##### 4.1.1 Core Tables

**Orders Table:**
```javascript
{
  _id: string,
  orderId: string, // KS-YYYY-XXXX format
  customerId: string,
  status: string,
  automationEnabled: boolean,
  items: [{
    productLink: string,
    quantity: number,
    validationStatus: string,
    validationMethod: string, // "auto" | "manual" | "override"
    stockStatus: string,
    estimatedPrice: number,
    quotedPrice: number,
    finalPrice: number,
    riskLevel: string,
    adminOverride: boolean
  }],
  customerInfo: {
    name: string,
    email: string,
    phone: string,
    address: string,
    specialInstructions: string,
    trafficSource: string // "instagram" | "direct" | "referral"
  },
  quotation: {
    itemCost: number,
    shippingFee: number,
    serviceFee: number,
    customsDuty: number,
    totalAmount: number,
    currency: string,
    quoteSentAt: number,
    approvedAt: number,
    rejectedAt: number,
    notes: string
  },
  statusHistory: [{
    status: string,
    timestamp: number,
    updatedBy: string,
    updateMethod: string, // "auto" | "manual"
    notes: string
  }],
  refundRequest: {
    requested: boolean,
    reason: string,
    evidence: [string], // file URLs
    status: string,
    processedAt: number
  },
  createdAt: number,
  updatedAt: number,
  whatsappThreadId: string,
  paymentStatus: string,
  estimatedDelivery: number
}
```

**Customers Table:**
```javascript
{
  _id: string,
  customerId: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  orderHistory: [string], // Order IDs
  createdAt: number,
  preferences: {
    notifications: boolean,
    whatsappUpdates: boolean,
    emailUpdates: boolean
  },
  trafficSource: string
}
```

**Link Validation Cache:**
```javascript
{
  _id: string,
  url: string,
  domain: string,
  validationResult: {
    isValid: boolean,
    isSupported: boolean,
    riskLevel: string,
    validationMethod: string,
    requiresManualReview: boolean,
    lastChecked: number,
    errorMessage: string
  },
  productInfo: {
    title: string,
    price: number,
    currency: string,
    availability: string
  },
  adminOverrides: [{
    timestamp: number,
    adminId: string,
    action: string,
    notes: string
  }]
}
```

#### 4.2 Automation & Backup Systems

##### 4.2.1 Email Queue System
**Queue Structure:**
- Order confirmations
- Status updates
- Refund notifications
- Admin alerts
- Customer communications

**Queue Processing:**
- Batch processing every 5 minutes
- Priority levels for urgent notifications
- Retry mechanisms for failed sends
- Delivery tracking and logging

##### 4.2.2 Shared CRM Board Integration
**Board Updates:**
- New order notifications
- Status change tracking
- Customer communication logs
- Refund request alerts
- Performance metrics

##### 4.2.3 Enhanced Backup Strategy
**Backup Triggers:**
- Every form submission
- Status updates
- Payment confirmations
- Refund requests
- Critical system changes

**Local Storage Structure:**
```
/backups
  /orders
    /2025-01
      order_KS-2025-001.json
      order_KS-2025-002.json
  /customers
    customer_data_2025-01.json
  /validation-cache
    link_cache_2025-01.json
  /automation-logs
    email_queue_2025-01.json
    status_updates_2025-01.json
  /system-logs
    error_log_2025-01.txt
    activity_log_2025-01.txt
```

### 5. User Experience Flow

#### 5.1 Enhanced Customer Journey
1. **Instagram Discovery** → Story/post with form link
2. **Landing Page** → Product information and social proof
3. **Order Form** → Single/Multi item selection with prominent CTA
4. **Link Validation** → Real-time verification with fallback options
5. **Stock Check** → Availability confirmation
6. **Form Submission** → Order creation with auto-confirmation
7. **WhatsApp Redirect** → Communication initiation
8. **Quotation Process** → Automated pricing breakdown
9. **Quote Approval** → Customer decision with refund FAQ
10. **Payment Processing** → Local payment with auto-updates
11. **Order Tracking** → Real-time status monitoring
12. **Delivery** → Completion with feedback request

#### 5.2 Streamlined Admin Workflow
1. **Order Notification** → Automated alerts via email + CRM
2. **WhatsApp Engagement** → Template-assisted communication
3. **Quotation Preparation** → Semi-automated pricing calculation
4. **Quote Delivery** → Automated sending with tracking
5. **Approval Monitoring** → Automated status updates
6. **Payment Processing** → Confirmation with auto-notifications
7. **Status Management** → One-click updates with automation
8. **Fulfillment** → Purchase workflow with tracking
9. **Delivery Coordination** → Automated customer notifications
10. **Completion** → Final status with feedback collection

### 6. Security & Validation

#### 6.1 Enhanced Link Validation Security
**Multi-Layer Protection:**
- Known scam domain blacklist
- Phishing pattern recognition
- SSL certificate verification
- Domain reputation scoring
- User report integration
- Admin override logging

#### 6.2 Data Protection
**Security Measures:**
- Input sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on form submissions
- Admin authentication for status updates
- Encrypted data storage

### 7. Performance & Monitoring

#### 7.1 Key Metrics
- Order conversion rate (Instagram → form → WhatsApp)
- Average processing time per status
- Customer satisfaction scores
- System uptime percentage
- Link validation accuracy
- Automation success rate

#### 7.2 Error Handling
- Graceful failure modes
- User-friendly error messages
- Admin error notifications
- Automatic retry mechanisms
- Fallback communication methods

### 8. Launch Strategy

#### 8.1 MVP Launch Requirements
- Core order system functional
- WhatsApp integration operational
- Basic automation implemented
- Instagram integration active
- Refund FAQ embedded
- Admin override controls working
- Local backup system active

#### 8.2 Post-Launch Iterations
- Customer feedback integration
- Performance optimization
- Feature expansion based on usage patterns
- Advanced automation implementation
- Scale preparation

### 9. Success Criteria

#### 9.1 Technical Success Metrics
- 99%+ system uptime
- <3 second page load times
- 95%+ link validation accuracy
- <2% automation failure rate
- Zero data loss incidents
- <24 hour average order processing time

#### 9.2 Business Success Metrics
- 50+ orders/month within 3 months
- 85%+ customer satisfaction rate
- <5% refund rate
- 90%+ Instagram → form conversion rate
- 85%+ WhatsApp conversion rate
- Positive customer testimonials

#### 9.3 Risk Mitigation Success
- <1% orders stuck due to validation failures
- <10% manual intervention required
- 95%+ customer satisfaction with refund process
- <5% orders requiring admin override
- 100% Instagram traffic properly tracked

### 10. Risk Mitigation Summary

#### 10.1 Implemented Solutions
1. **Dependency Reduction**: Light automation with manual fallbacks
2. **Refund Friction**: Embedded FAQ and auto-reply system
3. **Link Validation**: Modular logic with timeout protection
4. **Traffic Flow**: Instagram integration with prominent CTAs
5. **Shipping Risk**: Admin override capabilities for edge cases

#### 10.2 Contingency Plans
- Manual override for all automated processes
- Fallback communication methods
- Local backup for system failures
- Admin escalation procedures
- Customer support redundancy

This updated PRD maintains the core business logic while implementing the risk mitigations to ensure a robust, scalable, and user-friendly MVP launch.