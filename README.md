<<<<<<< HEAD
# CCOS Charity Guild 🏛️

A comprehensive nonprofit management system built with modern web technologies to streamline charity operations, member management, donation tracking, and community engagement.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🏠 **Dashboard & Analytics**
- Real-time metrics and KPIs
- Interactive charts and visualizations  
- AI-powered insights and recommendations
- Activity feeds and notifications
- Beautiful, responsive design with glass morphism effects

### 👥 **Member Management**
- Complete CRUD operations for member profiles
- Automated tier system (Bronze, Silver, Gold, Platinum)
- Advanced search and filtering
- Bulk import/export capabilities
- Engagement scoring and tracking
- Contact management with preferences

### 💰 **Donation Tracking**
- Multi-method payment processing (online, check, cash, credit card, bank transfer)
- Automated tax receipt generation
- Recurring donation management
- Designation tracking (General Fund, specific causes)
- Payment processor integration (Stripe ready)
- Comprehensive donation analytics

### 📅 **Event Management**
- Event creation with flexible scheduling
- Registration system with capacity limits
- Ticket pricing and member discounts
- Virtual and in-person event support
- Attendee check-in and tracking
- Post-event analytics and follow-up

### 📧 **Communications System**
- Newsletter creation and management
- Email campaign automation
- Member segmentation for targeted messaging
- Social media content scheduling
- Template library for consistent branding
- Delivery and engagement tracking

### 🤖 **AI-Powered Features**
- Newsletter content generation
- Donor prospect analysis
- Predictive analytics for fundraising
- Personalized communication suggestions
- Automated content optimization
- Smart member engagement recommendations

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Charts**: Recharts
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **AI Integration**: OpenAI API
- **Email**: Resend
- **Payments**: Stripe (ready for integration)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ccos-charity-guild.git
   cd ccos-charity-guild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenAI (optional)
   OPENAI_API_KEY=your_openai_key
   
   # Resend (optional) 
   RESEND_API_KEY=your_resend_key
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   ```

4. **Database Setup**
   
   Run the migrations in your Supabase SQL editor:
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Copy contents of `supabase/migrations/002_rls_policies.sql`
   - Copy contents of `supabase/seed.sql` (for sample data)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── members/       # Member management pages
│   │   ├── donations/     # Donation tracking pages
│   │   ├── events/        # Event management pages
│   │   ├── communications/# Communication system pages
│   │   └── analytics/     # Analytics and reporting pages
│   ├── api/               # API routes
│   │   ├── members/       # Member API endpoints
│   │   ├── donations/     # Donation API endpoints
│   │   ├── events/        # Event API endpoints
│   │   ├── ai/           # AI-powered endpoints
│   │   └── webhooks/      # Webhook handlers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client and types
│   ├── ai/              # AI integration utilities
│   ├── email/           # Email service utilities
│   ├── payments/        # Payment processing utilities
│   └── utils/           # General utilities
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── stores/              # State management
```

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level security policies
- **Role-based Access Control** - Admin, Treasurer, and Member roles
- **Data Encryption** - Sensitive data encryption at rest
- **Audit Logging** - Complete audit trail for financial transactions
- **GDPR Compliance** - Data privacy and consent management
- **Secure API Endpoints** - Protected routes with authentication

## 📊 Database Schema

The system uses a comprehensive PostgreSQL schema with:

- **Members** - Complete member profiles and preferences
- **Donations** - Transaction history and payment details
- **Events** - Event management and registration tracking
- **Communications** - Message history and engagement metrics
- **Automations** - Workflow definitions and execution logs
- **Activities** - Member activity tracking and analytics

All tables include proper relationships, indexes, and triggers for optimal performance.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 📞 Support

- **Email**: support@ccoscharityguild.org

---

**Built with ❤️ for nonprofits making a difference in the world.**
=======
# CCOS-Charity-Guild
>>>>>>> origin/main
