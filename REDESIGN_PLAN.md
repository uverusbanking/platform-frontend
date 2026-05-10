# corporate-web Modernisation Plan

_Aligning corporate-web with the uveruspay-website design system — blue brand variant_

---

## Goals

1. Replace corporate-web's HSL-based blue+white palette with uveruspay-website's warm beige aesthetic
2. Convert CSS variable format from HSL triplets to RGB triplets (aligning with personal-web)
3. Refine the existing DashboardLayout + AppSidebar shell to match uveruspay patterns
4. Modernise all screens inspired by uveruspay Dashboard, Transfers, and corporate workflow patterns
5. Preserve runtime brand-theming system (`BrandConfigService` already wired in `main.tsx`)
6. Keep default `--brand-primary` as **blue** (`0 82 255`) — not red like personal-web
7. Zero loss of functionality — all mock data, form logic, approval workflows, Recharts, and Supabase wiring remain untouched

---

## Commit Protocol

> After every phase completion **and** after each screen modernisation, commit with:
> `redesign(phase-N): <description>`
> Header must stay under 100 characters (husky enforced).

---

## Phase 0 — Enable Routes

**File:** `corporate-web/src/App.tsx`
**Risk:** None — uncomments existing routes, no logic changes

- Uncomment all disabled routes in `App.tsx` (login, register, change-password, onboarding, all dashboard routes)
- Redirect `/` to `/login` (or keep UnderConstruction on `/` only)
- This makes every page navigable during the redesign

**Commit:** `redesign(phase-0): enable all routes for development review`

---

## Phase 1 — Design Token Migration

**Files:** `corporate-web/src/index.css`, `corporate-web/tailwind.config.ts`
**Risk:** Medium — HSL → RGB format change in `tailwind.config.ts` affects all Tailwind-generated color classes. Run `npm run build` immediately after to verify no compile errors before committing.

### 1.1 CSS variable format migration (`index.css`)

Convert all CSS vars from HSL format (`--primary: 215 70% 38%`) to RGB triplet format (`--primary: 0 82 255`). This aligns with personal-web's token system and enables the `rgb(var(--...) / <alpha>)` pattern everywhere.

Replace light off-white surfaces with warm beige palette:

| Token                  | Old (HSL)                    | New (RGB)                 |
| ---------------------- | ---------------------------- | ------------------------- |
| `--background`         | `210 20% 98%`                | `244 239 232` (#F4EFE8)   |
| `--surface`            | _(new)_                      | `237 230 220` (#EDE6DC)   |
| `--surface-high`       | _(new)_                      | `226 217 204` (#E2D9CC)   |
| `--surface-highest`    | _(new)_                      | `255 255 255`             |
| `--brand-primary`      | _(was `--primary` HSL)_      | `0 82 255` (#0052FF blue) |
| `--brand-secondary`    | _(was `--secondary` HSL)_    | `88 86 214` (#5856D6)     |
| `--foreground`         | `215 28% 8%`                 | `22 19 16` (#161310)      |
| `--foreground-subtle`  | _(was `--muted-foreground`)_ | `111 102 92` (#6F665C)    |
| `--border`             | HSL border                   | `226 217 204` (#E2D9CC)   |
| `--sidebar-background` | sidebar HSL vars             | matches `--background`    |

Keep backward-compat aliases so shadcn components don't break:

- `--primary` → same value as `--brand-primary`
- `--muted-foreground` → same value as `--foreground-subtle`

New tokens to add:

- `--soft: 227 236 255` (#E3ECFF — blue tint for soft backgrounds; parallel to personal-web's red tint)
- `--mint: 184 239 193` (#B8EFC1)
- `--mint-deep: 31 122 58` (#1F7A3A)
- `--lemon: 244 226 122` (#F4E27A)
- `--sky: 191 220 247` (#BFDCF7)
- `--ink: 22 19 16` (alias for foreground-strong)
- `--card-shadow: 0 1px 0 rgba(20,15,10,0.04), 0 18px 40px -18px rgba(20,15,10,0.18)`

Update border-radius: `--radius: 0.875rem` (14px) + add `--radius-pill: 999px`

Dark mode section: carry through — update surface vars to warm dark neutrals (e.g. `--background` dark: `20 17 14`).

### 1.2 Tailwind config updates (`tailwind.config.ts`)

- Change all color references from `hsl(var(--...) / <alpha-value>)` to `rgb(var(--...) / <alpha-value>)`
- Add `"Instrument Serif"` to `fontFamily.serif`
- Add `pill: "999px"` to `borderRadius`
- Add `"card-shadow"` to `boxShadow` using the new `--card-shadow` var
- Map new semantic colors: `soft`, `mint`, `lemon`, `sky`, `surface`, `surface-high`, `surface-highest`, `brand-primary`, `brand-secondary`

### 1.3 Typography upgrades

- Import Instrument Serif from Google Fonts (decorative italic accent)
- Keep Manrope for display headings (existing corporate brand choice — complements the warm palette)
- Enable Inter OpenType features: `font-feature-settings: "ss01", "cv11"` on body
- Add utility classes: `.display`, `.eyebrow`, `.num`, `.serif-italic`
- Add `clamp()`-based responsive display text

### 1.4 New utility classes

Port from uveruspay-website/personal-web: `.dot-grid`, updated `.card` (shadow-card), button pill variants, `.logo-mark`

**Commit:** `redesign(phase-1): warm RGB tokens, blue brand primary, Instrument Serif`

---

## Phase 2 — Layout Architecture

**Files:** `corporate-web/src/layouts/DashboardLayout.tsx`, `corporate-web/src/components/AppSidebar.tsx`, `corporate-web/src/layouts/OnboardingLayout.tsx`
**Risk:** Low — layout files contain only shell and routing logic

### 2.1 DashboardLayout

- Wrap with warm beige `bg-background`
- Header (h-16): warm beige background + `border-b border-border`, SidebarTrigger + search pill (desktop) + bell icon + user avatar
- Main content area: `padding: 28px 36px 80px` (matching uveruspay `.main`)
- Mobile: keep existing SidebarTrigger, add `pb-20` to content area
- Loading state spinner: `border-t-transparent rounded-pill` with `borderColor: rgb(var(--brand-primary))`
- `text-muted-foreground` → `text-foreground-subtle` throughout

### 2.2 AppSidebar

- Logo area: brand icon + name from `BrandConfigService` + blue notification dot
- Nav items: `padding: 10px 12px`, `border-radius: 12px`, active = dark ink background (`rgb(var(--foreground))` bg + white text)
- Section labels: uppercase 10px eyebrow — Overview / Operations / Admin
- Sidebar background: `--background` (warm beige), `border-right: 1px solid rgb(var(--border))`
- Admin collapsible section: keep collapse behavior, re-style header with eyebrow label
- Footer: user name + email (warm typography) + sign-out button

### 2.3 OnboardingLayout

- Warm beige full-page background
- Narrow `max-w-5xl` centered container
- Header: brand logo + "Step X of 5" pill counter + warm pill action buttons (Save & Exit / Continue)
- Step sidebar: warm surface card with progress circles and connector lines

**Commit:** `redesign(phase-2): dashboard layout, sidebar, onboarding layout`

---

## Phase 3 — Screen Modernisation

> **Rule:** Only edit JSX structure and CSS classes. Never touch mock data, form schemas, Recharts config, Supabase calls, AuthContext, or paymentStore.

### 3.1 Dashboard (`pages/Dashboard.tsx`)

**Keep intact:** Balance display, account list, recent activity data, all mock data

**Changes:**

- Header row: eyebrow date + display greeting + "Send Money" pill button
- Balance hero card: dark ink background (`rgb(var(--foreground))`), blue radial blur, 72px balance number, 3-action grid
- Accounts list: warm surface cards with balance and account suffix
- Recent activity: date-grouped list (desktop table rows stay; mobile gets warm cards)
- Stats row: pending outflows, monthly spend, burn % as 4-col warm pill cards

**Commit:** `redesign(phase-3a): dashboard — balance hero, accounts, activity`

### 3.2 Payments (`pages/PaymentsPage.tsx`)

**Keep intact:** Tab state, search/filter logic, paymentStore integration, BulkCsvUpload

**Changes:**

- Pill tab switcher (All / Bulk / Recurring / Attention)
- Search: pill shape with icon, warm border
- Table rows: warm hover states on `--surface`
- Mobile payment cards: warm surface with status pill
- Status badges: lemon (pending), mint (approved), soft (failed/attention)

**Commit:** `redesign(phase-3b): payments page — pill tabs, warm table`

### 3.3 New Payment (`pages/NewPayment.tsx`)

**Keep intact:** 3-step state machine, form validation, balance check, Supabase submit

**Changes:**

- Progress rail: 3 steps with connector lines — Recipient → Details → Confirm
- 2-col layout on desktop (1.4fr form + 1fr sidebar)
- Sidebar: "Paying from" dark ink card with blue blur + fee estimate
- Step 3 review: dark ink card with amount + warm detail rows (matching personal-web Send step 2)

**Commit:** `redesign(phase-3c): new payment — progress rail, 2-col layout`

### 3.4 Transactions (`pages/TransactionsPage.tsx`)

**Keep intact:** Search debounce, filter state, mock transaction data

**Changes:**

- Pill filter tabs (All / Credits / Debits)
- Search pill with icon
- Date-grouped rows with warm card background
- Credit/debit icon backgrounds: mint (credit), soft (debit)

**Commit:** `redesign(phase-3d): transactions — grouped, pill filters`

### 3.5 Accounts (`pages/AccountsPage.tsx`)

**Keep intact:** Account selector state, all Recharts AreaChart code, stat calculations

**Changes:**

- Account selector: dark ink card (active), warm surface card (inactive)
- Stats row: 4-col warm surface cards (balance, pending outflows, monthly spend, burn %)
- Recharts: update stroke color to `rgb(var(--brand-primary))`, fill with `rgb(var(--soft))`
- Action buttons: pill outline style (Fund / Move / Statement / Settings)
- Transactions section: warm grouped list matching 3.4 pattern

**Commit:** `redesign(phase-3e): accounts — selector, chart colors, stats`

### 3.6 Approval Queue (`pages/ApprovalQueue.tsx`)

**Keep intact:** Tab state, paymentStore approve/reject calls, comment requirement for rejections

**Changes:**

- Summary cards: lemon (pending), soft (escalated), mint (resolved), surface (total value)
- Search pill with type filter
- Request rows: warm hover, priority badge as eyebrow pill
- Detail modal: dark ink header with amount + warm detail rows
- Approve button: mint background; Reject button: destructive

**Commit:** `redesign(phase-3f): approval queue — summary cards, detail modal`

### 3.7 Onboarding Wizard (`pages/OnboardingWizard.tsx`)

**Keep intact:** 5-step state machine, Fill Mock Data button, progress tracking

**Changes:**

- 2-col grid: step nav sidebar (240px, warm surface card) + content area
- Step nav: active step = dark ink pill with white text; completed = mint dot; upcoming = muted
- Connector lines between steps
- Top header: brand logo + "Step X / 5" + warm pill buttons (Save & Exit / Continue)
- Content wrapper: warm surface card with `shadow-card`

**Commit:** `redesign(phase-3g): onboarding wizard layout and step nav`

### 3.8 Onboarding Steps (`components/onboarding/Step*.tsx`)

**Keep intact:** All form fields, Zod/RHF validation, mock data fill logic, file upload in StepDocuments

**Changes:**

- Section eyebrow labels above field groups
- Warm surface card containers with `shadow-card`
- Director cards (StepDirectors): warm surface, action buttons as pill outline
- Document upload zones (StepDocuments): warm drag-drop zone, blue tint on hover

**Commit:** `redesign(phase-3h): onboarding step forms`

### 3.9 Applications (`pages/ApplicationsList.tsx`, `pages/ApplicationDetail.tsx`)

**Keep intact:** Application data rendering, status logic, navigation to wizard/detail

**Changes:**

- ApplicationsList: warm card list; status as pill (lemon=draft, mint=approved, soft=needs review)
- ApplicationDetail: dark ink hero with company name + blue blur; warm cards for each section; step circles with ink/mint states; feedback section as lemon-tinted warm card

**Commit:** `redesign(phase-3i): applications list and detail`

### 3.10 Admin Pages (`pages/UserManagement.tsx`, `pages/ApprovalRules.tsx`, `pages/RolesPermissions.tsx`)

**Keep intact:** All data, permission logic, RBAC types

**Changes:**

- Section cards with eyebrow labels
- Warm table rows, hover on `--surface`
- Role/permission badges: warm pill variants (Owner=ink, Authorizer=sky, Initiator=lemon, Viewer=surface)
- Threshold/escalation rows: warm surface with edit icon

**Commit:** `redesign(phase-3j): admin pages — user mgmt, rules, roles`

---

## Phase 4 — Auth Screens

**Files:** `pages/Login.tsx`, `pages/Register.tsx`, `pages/ChangePassword.tsx`

**Keep intact:** All `AuthContext` calls, form validation, demo user quick-tap buttons, `force_password_change` redirect logic

**Changes:**

- Login / Register: already have a 2-panel layout — update to match uveruspay's dark ink left panel (blue radial blur instead of red) + warm beige form right panel
- Left panel: corporate tagline with `.display` + `.serif-italic` accent, brand icon, blue glow, muted nav link
- Right panel: warm card with Inter form fields, pill submit button using `--brand-primary`
- Demo user quick-tap buttons: warm outlined pill buttons
- ChangePassword: warm dialog card with dark ink header showing amount/context

**Commit:** `redesign(phase-4): auth — dark ink left panel, blue glow, warm form`

---

## Phase 5 — Shared Components

**Files:** `components/payments/BulkCsvUpload.tsx`, `components/settings/EditEscalationModal.tsx`, `components/settings/EditThresholdModal.tsx`, `components/settings/WorkflowDetail.tsx`

**Keep intact:** All data props, handlers, file upload logic

**Changes:**

- BulkCsvUpload: warm drag-drop zone (`--surface` bg + `--border` dashed), blue tint (`--soft`) on hover/drag-over
- Settings modals: warm card layout, eyebrow section labels, pill action buttons

**Commit:** `redesign(phase-5): shared components — csv upload, settings modals`

---

## BrandConfigService Color Injection

**Current state:** `BrandConfigService.loadConfig("corporate", VITE_BRAND_CONFIG_URL)` is already called in `main.tsx`. The service currently reads `brandName`, `brandLogoUrl`, `brandIconUrl`. It does **not** yet inject CSS color vars.

**Pattern to follow when backend integration is added:**

```typescript
// In BrandConfigService or the loadConfig callback:
document.documentElement.style.setProperty(
  "--brand-primary",
  config.brandPrimaryRgb,
);
document.documentElement.style.setProperty(
  "--brand-secondary",
  config.brandSecondaryRgb,
);
```

The CSS var defaults in `index.css` (`--brand-primary: 0 82 255`) ensure the app looks correct at zero config. Injected vars override defaults at runtime — same pattern as personal-web.

**No code change needed in this redesign.** The CSS var names are pre-wired. BrandConfigService extension is a backend task.

---

## Risk Mitigations

| Risk                                   | Mitigation                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| HSL → RGB format breaks shadcn classes | Update `tailwind.config.ts` in the same commit as `index.css`; run `npm run build` before committing          |
| Recharts chart colors                  | Update stroke/fill props in `AccountsPage` only — Recharts takes hex or `rgb()` strings directly              |
| Supabase integration                   | Never touch `src/integrations/supabase/`                                                                      |
| Mock data / paymentStore               | Never touch `src/services/`                                                                                   |
| BrandConfigService                     | CSS var names (`--brand-primary`, `--brand-secondary`) must stay as-is — backend will inject into these names |
| Dark mode                              | Carry through dark mode section in `index.css` with warm dark neutrals                                        |
| Form validation                        | Never touch Zod schemas or React Hook Form setup                                                              |
| Auth flow                              | Never touch `AuthContext.tsx`, login/register/changePassword logic                                            |

---

## Files Never Touched

```
src/services/               — mockData.ts, approvalQueueData.ts, paymentStore.ts
src/integrations/           — Supabase client and generated types
src/contexts/AuthContext.tsx
src/hooks/                  — all hooks
src/types/                  — all type definitions
src/lib/utils.ts
shared/                     — BrandConfigService and all shared utilities
src/components/ui/          — shadcn base components (restyled via CSS vars only)
```
