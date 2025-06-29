# Klynt Shipment

A lean MVP shipping service for Caribbean users, primarily targeting Trinidad & Tobago. This platform enables users to submit international product orders via a streamlined web interface.

## Features

- **Multi/Single Item Order Forms**: Flexible ordering system for various product types
- **Real-time Link Validation**: Smart validation with fallback options
- **WhatsApp Integration**: Direct communication channel for customer service
- **Order Tracking**: 15-status workflow from submission to delivery
- **Admin Dashboard**: Comprehensive order management system
- **Refund Management**: Integrated refund request system with FAQ

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Convex
- **Form Handling**: React Hook Form + Zod validation
- **Communication**: WhatsApp Business API integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account (for backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/klnyt.git
cd klnyt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `VITE_WHATSAPP_NUMBER`: Your WhatsApp Business number
- `VITE_CONVEX_URL`: Your Convex deployment URL

4. Set up Convex:
```bash
npx convex dev
```

### Development

Run the development server:
```bash
npm run dev
```

Access the app at `http://localhost:5173`

For network access (mobile testing):
```bash
npm run dev -- --host
```

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
klnyt/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── convex/            # Backend functions and schema
├── public/            # Static assets
└── docs/              # Documentation
```

## Key Features Documentation

### Order Management
- Orders use format: KS-YYYY-XXXX (e.g., KS-2025-0001)
- 15 status progression from Submitted to Delivered
- Automated status transitions with manual override options

### Link Validation
- Modular validation system with primary and fallback validators
- 5-second timeout protection
- Admin override capabilities

### Security
- Input sanitization on all forms
- Rate limiting on submissions
- Protected admin routes
- Encrypted data storage

## Deployment

This project is configured for automatic deployment to Netlify:

1. Push to the `main` branch triggers automatic deployment
2. Environment variables must be set in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

## Contributing

Please read our contributing guidelines before submitting PRs.

## License

Copyright © 2025 Klynt Shipment. All rights reserved.