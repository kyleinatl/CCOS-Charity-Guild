# CCOS Charity Guild Documentation

Welcome to the comprehensive documentation for the CCOS Charity Guild nonprofit management system.

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Components](#components)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Supabase Account** - [Sign up here](https://supabase.com/)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ccos-charity-guild.git
   cd ccos-charity-guild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables in `.env.local`:
   
   ```env
   # Required - Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Optional - AI Features
   OPENAI_API_KEY=your_openai_api_key
   
   # Optional - Email Services
   RESEND_API_KEY=your_resend_api_key
   
   # Optional - Payment Processing
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Database Setup**
   
   In your Supabase SQL editor, run the migrations in order:
   
   - **Step 1**: Run `supabase/migrations/001_initial_schema.sql`
   - **Step 2**: Run `supabase/migrations/002_rls_policies.sql`
   - **Step 3**: (Optional) Run `supabase/seed.sql` for sample data

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## System Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── dashboard/        # Dashboard components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── supabase/         # Database client
│   ├── utils/            # Helper functions
│   ├── ai/              # AI integrations
│   ├── email/           # Email services
│   └── payments/        # Payment processing
├── types/               # TypeScript definitions
├── hooks/               # Custom React hooks
└── stores/              # State management
```

## Database Schema

### Core Tables

#### Members
- Complete member profiles and contact information
- Automated tier calculation based on donation totals
- Engagement scoring and activity tracking
- Subscription preferences for communications

#### Donations
- Transaction history with multiple payment methods
- Automated receipt generation and tracking
- Recurring donation support
- Designation and fund tracking

#### Events
- Event management with registration system
- Capacity limits and waitlist functionality
- Virtual and in-person event support
- Attendance tracking and analytics

#### Communications
- Newsletter and email campaign management
- Member segmentation and targeting
- Delivery and engagement metrics
- Template management system

#### Automations
- Workflow definitions and triggers
- Action sequences and conditions
- Execution logs and error handling
- Performance monitoring

### Relationships

- Members have many Donations (1:N)
- Members have many Event Registrations (1:N)
- Events have many Event Registrations (1:N)
- Communications have many Communication Recipients (1:N)
- Automations have many Automation Logs (1:N)

### Security

All tables implement Row Level Security (RLS) with role-based access:

- **Admin Role**: Full access to all data and operations
- **Treasurer Role**: Access to financial data and member information
- **Member Role**: Access to own data and public information

## Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Run the database migrations**
3. **Configure authentication settings**
4. **Set up Row Level Security policies**
5. **Generate API keys for your application**

### Optional Integrations

#### OpenAI (AI Features)
1. Create an OpenAI account
2. Generate an API key
3. Add to environment variables
4. Enable AI features in the application

#### Resend (Email Services)
1. Create a Resend account
2. Verify your domain
3. Generate an API key
4. Configure email templates

#### Stripe (Payment Processing)
1. Create a Stripe account
2. Set up products and pricing
3. Configure webhook endpoints
4. Add API keys to environment

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Connect your GitHub repository to Vercel
   - Choose the main branch for production

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure Supabase URLs are production values

3. **Domain Configuration**
   - Set up custom domain (optional)
   - Configure DNS settings

4. **Deploy**
   - Push to main branch triggers automatic deployment
   - Monitor build logs for any issues

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify Supabase URL and API keys
- Check network connectivity
- Ensure RLS policies are correctly configured

#### Build Errors
- Clear node_modules and reinstall dependencies
- Check TypeScript errors
- Verify environment variables are set

#### Authentication Problems
- Check Supabase auth configuration
- Verify redirect URLs
- Test user permissions and roles

#### Performance Issues
- Check database indexes
- Monitor API response times
- Optimize component rendering

### Support

For additional support:
- Check GitHub Issues
- Review documentation
- Contact support team

## Contributing

We welcome contributions to improve the CCOS Charity Guild system:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Follow coding standards and testing guidelines

---

For more detailed information, refer to the specific documentation sections or contact the development team.