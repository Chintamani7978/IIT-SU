# IIT-SU Student Portal

Unofficial, student-run platform for Sambalpur University Institute of Information Technology (SUIIT) notes, PYQs, syllabus, lab manuals, and video lectures.
## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   \\\ash
   npm install
   \\\
"@
Set-Content -Path "e:\IIT SU\README.md" -Value # IIT-SU Student Portal

Unofficial, student-run platform for Sambalpur University Institute of Information Technology (SUIIT) notes, PYQs, syllabus, lab manuals, and video lectures.
git add README.md
git commit -m "docs: add installation instructions to README"

# 3. Add Supabase setup details to README
# IIT-SU Student Portal

Unofficial, student-run platform for Sambalpur University Institute of Information Technology (SUIIT) notes, PYQs, syllabus, lab manuals, and video lectures. += @"

### Supabase Database Setup
1. Create a free project on [Supabase](https://supabase.com).
2. Set up the schema and seed the catalog using the SQL migrations in the \supabase/migrations/\ directory.
3. Configure authentication (such as Google OAuth) via the Supabase dashboard.
## Project Structure
- \pp/\ - Next.js App Router pages and layouts.
- \components/\ - Reusable UI components.
- \lib/\ - Shared utilities, types, database clients, and authentication helpers.
- \supabase/\ - Database migrations and schema setups.
