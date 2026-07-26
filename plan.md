# IIT-SU Student Portal — Implementation Plan

Unofficial, student-run platform for study materials: notes, PYQs, syllabus, lab manuals, video lectures. Built and maintained by students, for students.

---

## 1. Where the project stands today

**What already works (UI only):**
- Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + GSAP animations, TypeScript
- Navigation hierarchy: Departments → Branch → Year → Semester → Subject (`app/(user)/...`)
- Admin area with moderation page (`app/admin/...`)
- Components: `Navbar`, `UserSidebar`, `SearchCommandBar`, `UploadModal`, `SubjectTabs`, `RightSidebar`, `AdminSidebar`
- Well-designed data model in `lib/types.ts` (ClassNote, PYQ, VideoLecture, LabManual with moderation status, upvotes, verification badges)

**What is missing (everything is fake right now):**
- All data lives in `lib/mockDb.ts` — hardcoded arrays, no database
- No authentication — anyone could be "admin"
- No file storage — `pdfUrl` fields point nowhere
- Upload modal doesn't actually upload; moderation page doesn't actually moderate
- Search only searches the mock arrays
- No deployment pipeline

**Verdict:** the frontend skeleton is solid. The project needs a real backend, then feature depth.

---

## 1b. Predecessor site: suiit.site (v1)

The team's earlier attempt at the same idea. Audited 2026-07-24:

- Structure: Home → CSE / ECE → semester → subject units ("App Version V2.0")
- Semesters 1, 5–8 marked "coming soon"; sem 2/3/4 list subjects but every unit shows "Index to be updated..." — **no actual PDFs or resource links exist**, so there is no content to migrate
- Reusable: subject lists per semester, branding, the lesson that content collection is the hard part

**⚠ Subject list conflicts to resolve before seeding the real database** (verify against official syllabus):
- Semester 4: old site lists Computer Network (CSC 244), COA (CSC 236), Discrete Mathematics; `mockDb.ts` instead has Operating Systems (CSC245) and Microprocessors (ECC242), with Discrete Math in sem 5
- Semester 3: old site lists "EEC (HSC 354)" which is absent from `mockDb.ts`
- Once live, redirect suiit.site to the new domain (or point the domain at the new deployment) so existing users carry over

---

## 2. Recommended stack

| Concern | Choice | Why |
|---|---|---|
| Frontend | Keep Next.js 16 + Tailwind 4 | Already built, no reason to change |
| Backend / DB | **Supabase** (Postgres) | Free tier is generous, gives DB + Auth + Storage + Row Level Security in one service — perfect for a no-budget student team |
| Auth | Supabase Auth with **Google OAuth** (restrict to college email domain if possible) | Zero password management; domain restriction keeps it students-only |
| File storage | Supabase Storage (PDF bucket) | 1 GB free; upgrade path exists. Videos: don't host — store YouTube/Drive links only |
| Hosting | **Vercel** free tier | Native Next.js support, auto-deploy from GitHub, free SSL |
| Search | Postgres full-text search (built into Supabase) | Good enough at this scale; no extra service |

**Cost: ₹0/month** to start. Optional later: custom domain (~₹800/yr).

> Note: this repo uses Next.js 16 — before writing server code, read the guides in `node_modules/next/dist/docs/` (APIs differ from older Next.js).

---

## 3. Phased roadmap

### Phase 0 — Foundation cleanup (1–2 days)
- [ ] Delete stale `out/` directory; add to `.gitignore` if static export isn't the deploy strategy
- [ ] Rewrite `README.md`: what the project is, screenshots, how to run, how to contribute
- [ ] Set up Vercel deployment from GitHub `main` (get a live URL immediately — motivates the team)
- [ ] Agree on branch workflow: feature branches + PRs, no direct pushes to `main`

### Phase 1 — Real backend (1–2 weeks) ← **highest priority**

> Status 2026-07-24: code side DONE. Migrations in `supabase/migrations/`, data layer in `lib/db.ts` (falls back to mock data until env vars are set), all catalog pages wired. Remaining: a team member creates the Supabase project and follows `supabase/README.md`.

- [ ] Create Supabase project; add `@supabase/supabase-js` + `@supabase/ssr`
- [ ] Schema (mirrors `lib/types.ts`):
  - `departments`, `branches`, `subjects` — seed from `mockDb.ts` data (write a one-time seed script)
  - `resources` — single table with `type` discriminator (note/pyq/video/lab), `status` (pending/approved/rejected), `uploader_id`, `file_path`, metadata JSON for type-specific fields
  - `profiles` — user id, name, batch, branch, `role` (student/moderator/admin)
  - `votes` — (user_id, resource_id) unique, so one upvote per user
- [ ] Row Level Security policies:
  - Anyone can read `approved` resources
  - Logged-in users can insert (status forced to `pending`)
  - Only moderators/admins can update status
- [ ] Replace `mockDb.ts` reads with Supabase queries via a `lib/db.ts` data-access layer (keep the existing types — they're good)
- [ ] Keep pages server-rendered where possible; fetch in server components

### Phase 2 — Auth + uploads + moderation (1–2 weeks)

> Status 2026-07-24: code side DONE. `/login` (Google OAuth), `/auth/callback`, auth button in nav, real PDF uploads (browser → storage, 20 MB/PDF-only), moderation queue wired to server actions, `/admin` role-gated server-side, upvotes toggle per user. Everything degrades to demo mode until Supabase env vars are set. Remaining: enable the Google provider in the Supabase dashboard (see `supabase/README.md`) and promote moderator accounts. "My uploads" page deferred to Phase 3.
- [ ] Google sign-in; store profile on first login
- [ ] Wire `UploadModal`: PDF → Supabase Storage (limit ~20 MB, PDF-only validation), row inserted as `pending`
- [ ] Wire admin moderation page: list pending, preview PDF, approve/reject with reason
- [ ] Role gating: `/admin` route protected server-side (check role in layout, not just UI)
- [ ] Upvote button writes to `votes` table
- [ ] "My uploads" page so contributors see their submission status

### Phase 3 — Search + polish (1 week)
- [ ] Wire `SearchCommandBar` to Postgres full-text search across subject names, codes, resource titles
- [ ] Filters on subject page: exam year, unit, resource type (UI likely exists in `SubjectTabs`)
- [ ] In-browser PDF preview (iframe or react-pdf) instead of forced download
- [ ] Loading skeletons + empty states ("No PYQs yet — be the first to upload")
- [ ] Mobile responsiveness pass
- [ ] SEO: metadata per subject page, sitemap — students should find pages via Google

### Phase 4 — Growth features (ongoing, pick by demand)
- **Syllabus section** — per-subject syllabus PDF or structured units (you mention syllabus as a goal; the `Subject` model needs a `syllabus` resource type or field)
- **Notices/announcements board** — exam dates, events (admin-posted)
- **GPA/SGPA calculator** — credits already in the data model; cheap win, high usage
- **Contributor leaderboard** — gamify uploads (upvote counts already exist)
- **Request board** — "need PYQ for CSC245 2024" so uploaders know what's wanted
- **Discussion/comments per subject** — only if moderation capacity exists
- **Faculty-verified badge workflow** — types already support `isVerified` and badges

---

## 4. Team workflow suggestions

- **Split work by phase, not by page**: one person on Supabase schema + RLS, one on auth flow, one on upload/moderation wiring. Frontend polish parallel.
- **Content is the real moat.** Tech is a means; assign people to collect and upload PYQs/notes per branch. An empty platform with great code helps nobody.
- **Moderation rota**: 2–3 trusted students as moderators so pending uploads don't rot.
- **Legal/safety notes** (unofficial site):
  - Clear disclaimer: "Unofficial, student-maintained, not affiliated with the institute"
  - Don't use the institute's official logo/name in a way that implies endorsement
  - Only host student-created notes and past papers; take down on request (add a report button eventually)

---

## 5. Immediate next steps (this week)

1. Deploy current UI to Vercel — get the live link
2. Create Supabase project + write schema migration
3. Seed departments/branches/subjects from `mockDb.ts`
4. Swap one page (departments list) from mock to real DB — proves the pattern, rest follows

## Update 2026-07-26: Session Refresh Fix
- Fixed session refresh issue in proxy helper by replacing the non-standard `getClaims()` call with `getUser()`.
