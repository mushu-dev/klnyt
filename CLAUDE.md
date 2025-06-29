# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Klynt Shipment is a lean MVP shipping service targeting Caribbean users (primarily Trinidad & Tobago). The platform enables users to submit international product orders via a streamlined web interface, with order processing and communication handled through WhatsApp integration.

## Technology Stack

- **Frontend**: Web application (technology TBD based on Claude Code implementation)
- **Backend/Database**: Convex
- **Communication**: WhatsApp Business API integration
- **Backup**: Local file system with Convex sync
- **Automation**: Email queuing system and shared CRM board integration

## Development Commands

```bash
# Install dependencies
cd klynt-app && npm install

# Run development server (local only)
npm run dev

# Run development server (accessible on network/phone)
npm run dev -- --host

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Deploy to Convex (when configured)
npx convex deploy
```

## Architecture Overview

### Core Components

1. **Order Management System**
   - Multi/single item order forms
   - Link validation with modular logic
   - Stock availability verification
   - Order status workflow (15 statuses from Submitted to Delivered)

2. **Database Schema (Convex)**
   - Orders table: Tracks all order details, status history, and customer info
   - Customers table: Customer profiles and preferences
   - Link validation cache: Stores validation results for performance

3. **Integration Points**
   - WhatsApp Business API for customer communication
   - Email queue system for automated notifications
   - Shared CRM board for team coordination
   - Instagram integration for traffic management

4. **Key Features**
   - Real-time link validation with fallback to manual review
   - Admin override capabilities for edge cases
   - Automated status progression with manual controls
   - Refund request system with FAQ integration
   - Risk assessment for shipping items

### Security Considerations

- Input sanitization required for all form inputs
- Rate limiting on form submissions
- Admin authentication for status updates
- Encrypted data storage in Convex
- Protection against SQL injection and XSS attacks

### Performance Requirements

- <3 second page load times
- 99%+ system uptime
- Real-time validation timeout protection (5 seconds max)
- Batch email processing every 5 minutes

## Important Implementation Notes

1. **Order ID Format**: KS-YYYY-XXXX (e.g., KS-2025-0001)

2. **Status Flow**: Orders progress through specific statuses with automation triggers at each stage

3. **Instagram Integration**: Form links must be prominently placed for Story/Bio traffic

4. **WhatsApp Redirect**: After form submission, users should be redirected to WhatsApp

5. **Backup Strategy**: Critical operations trigger local backups organized by date

6. **Admin Controls**: All automated processes must have manual override options

7. **Validation Logic**: Modular approach with primary validation, fallback options, and admin overrides