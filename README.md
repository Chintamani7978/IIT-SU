# IIT-SU Student Portal

Unofficial, student-run platform for Sambalpur University Institute of Information Technology (SUIIT) notes, PYQs, syllabus, lab manuals, and video lectures.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Supabase Database Setup
1. Create a free project on [Supabase](https://supabase.com).
2. Set up the schema and seed the catalog using the SQL migrations in the `supabase/migrations/` directory.
3. Configure authentication (such as Google OAuth) via the Supabase dashboard.

## Project Structure
- `app/` - Next.js App Router pages and layouts.
- `components/` - Reusable UI components.
- `lib/` - Shared utilities, types, database clients, and authentication helpers.
- `supabase/` - Database migrations and schema setups.

## Troubleshooting Deployment
If you are deploying to Vercel and notice that authentication or features aren't working:
1. Ensure your environment variables are configured in the Vercel dashboard.
2. Remember that Next.js client-side variables (`NEXT_PUBLIC_...`) are inlined at build time. If you update your env variables in Vercel, you must trigger a redeployment/rebuild for them to take effect.
3. Add your Vercel domains to the redirect URLs in your Supabase Auth configuration.
