# personal-web Modernisation Plan

_Aligning personal-web with the uveruspay-website design system_

---

## Goals

1. Replace personal-web's cool-gray/blue palette with uveruspay-website's warm beige/red aesthetic
2. Expand layout from narrow centered container → full-width desktop shell (240px sidebar + fluid main)
3. Modernise all screens inspired by uveruspay's Dashboard, Transfers, and Mobile mockups
4. Preserve the runtime brand-theming system (BrandConfigService default shifts to red+warm, runtime override stays intact)
5. Zero loss of functionality — all API calls, forms, hooks, mutations remain untouched

---

## Commit Protocol

> After every phase completion **and** after each screen modernisation, commit with message:
> `redesign(phase-N): <description>`

---

## Phase 1 — Design Token Migration

**Files:** `personal-web/src/index.css`, `personal-web/tailwind.config.ts`
**Risk:** None — pure CSS variable changes, no logic touched

### 1.1 CSS variable updates (`index.css`)

Replace cool-gray surfaces with warm beige palette:

| Token                       | Old (RGB)          | New (RGB)                      |
| --------------------------- | ------------------ | ------------------------------ |
| `--background`              | `240 242 243`      | `244 239 232` (#F4EFE8)        |
| `--surface`                 | `232 234 235`      | `237 230 220` (#EDE6DC)        |
| `--surface-high`            | `221 224 226`      | `226 217 204` (#E2D9CC)        |
| `--surface-highest`         | `255 255 255`      | `255 255 255` (unchanged)      |
| `--brand-primary` default   | `0 82 255`         | `255 59 48` (#FF3B30 red)      |
| `--brand-secondary` default | `88 86 214`        | `224 42 31` (#E02A1F dark red) |
| `--foreground`              | `25 28 29`         | `22 19 16` (#161310)           |
| `--foreground-subtle`       | `176 176 176`      | `111 102 92` (#6F665C)         |
| `--border`                  | `221 224 226`      | `226 217 204` (#E2D9CC)        |
| `--sidebar-background`      | matches background | matches new background         |

New tokens to add:

- `--soft: 255 230 227` (#FFE6E3 — red tint for soft backgrounds)
- `--mint: 184 239 193` (#B8EFC1)
- `--mint-deep: 31 122 58` (#1F7A3A)
- `--lemon: 244 226 122` (#F4E27A)
- `--sky: 191 220 247` (#BFDCF7)
- `--ink: 22 19 16` (alias for foreground-strong)
- `--card-shadow: 0 1px 0 rgba(20,15,10,0.04), 0 18px 40px -18px rgba(20,15,10,0.18)`

Update border-radius base: `--radius: 0.875rem` (14px) + add `--radius-pill: 999px`

### 1.2 Typography upgrades

- Import Instrument Serif from Google Fonts (for decorative italic accent text)
- Enable Inter OpenType features: `font-feature-settings: "ss01", "cv11"` on body
- Add utility classes: `.display`, `.eyebrow`, `.num`, `.serif-italic`
- Add `clamp()`-based display text for responsive headlines

### 1.3 New utility classes

Port from uveruspay-website: `.dot-grid`, updated `.card` shadow, button variants, `.logo-mark`

### 1.4 Tailwind config updates

- Add `"Instrument Serif"` to fontFamily.serif
- Add `pill` to borderRadius (999px)
- Map new semantic colours (soft, mint, lemon, sky)

**Commit:** `redesign(phase-1): migrate design tokens to warm uveruspay palette`

---

## Phase 2 — Layout Architecture

**Files:** `AppLayout.tsx`, `AppSidebar.tsx`, `BottomNav.tsx`, `AuthLayout.tsx`
**Risk:** Low — layout shell files contain no API calls or business logic

### 2.1 AppLayout

- Remove narrow max-width container constraint from main content area
- Desktop: `display: grid; grid-template-columns: 240px 1fr` — full viewport width
- Add `.topbar` area inside main: search input (pill shape) + notification icon + avatar
- Main content area: `padding: 28px 36px 80px` matching uveruspay `.main`
- Mobile: hide sidebar, show bottom nav, add `pb-20` to content area

### 2.2 AppSidebar

- Logo area at top: brand icon + name, red notification dot (matching uveruspay `.logo-mark`)
- Nav items: `.nav-item` pattern — `padding: 10px 12px`, `border-radius: 12px`, active = dark background
- Section labels: uppercase 10px muted eyebrow text
- Sidebar background: `--background` (warm beige)
- Border-right: `1px solid var(--line)` warm border
- Footer: sign-out button at bottom

### 2.3 BottomNav

- Warm beige background with `border-top: 1px solid var(--line)`
- Active item uses dark ink (not brand-primary pill) matching uveruspay tab bar
- 4 tabs: Home, History, Send, Profile

### 2.4 AuthLayout

- Update background to warm beige
- Split layout: left branding panel (dark ink with red blur) + right form panel
- Match uveruspay's card styling for the form container

**Commit:** `redesign(phase-2): full-width layout shell — sidebar + topbar + bottom nav`

---

## Phase 3 — Screen Modernisation

> **Rule:** Only edit JSX structure and CSS classes. Never touch hooks, API calls, query/mutation functions, form schemas, or service files.

### 3.1 Dashboard (`pages/account/Dashboard.tsx`)

Inspired by: uveruspay Dashboard screen

**Keep intact:**

- `useUserProfile`, `useTransactions`, `useWallet`, `useBalanceSocket`
- `useNotifications`, `usePlatformKYC`
- Balance show/hide toggle state
- Tier badge and KYC banners

**Structural changes:**

- Header row: greeting with eyebrow date + action buttons (Sync, Send money)
- Balance card: dark ink background, red radial blur, 72px balance number, 4-action grid (Send/Receive/Cards/History)
- Wallet selector: replace carousel with a simple pill-tab switcher per wallet
- Mini-stats row: 4-column grid — inflow, outflow, active wallets, tier level
- Bottom: 2-col grid (1.6fr 1fr) — recent activity list | quick-actions sidebar

**Commit:** `redesign(phase-3a): dashboard — balance card, stats row, activity grid`

### 3.2 Send (`pages/account/Send.tsx`)

Inspired by: uveruspay Transfers screen

**Keep intact:**

- `useBanks`, `useResolveAccount`
- `TransferService.initiateTransfer`, `TransferService.initiateInternalTransfer`
- PIN dialog (`TransactionPinDialog`)
- All form validation (Zod schemas)
- Internal vs. bank transfer type selection

**Structural changes:**

- Progress rail: 4 steps with connector lines — Who → How much → Review → Sent
- 2-column grid (1.4fr 1fr): form on left, info sidebar on right
- Step 0: recent contacts 3-col grid + transfer method 4-col grid
- Step 1: 72px amount input, quick-amount pills, optional narration
- Step 2: review card with dark ink background + detail rows
- Step 3: success with mint check icon + receipt reference
- Sidebar: sending-from balance card (dark) + fee info + tips

**Commit:** `redesign(phase-3b): send/transfers — progress rail, 2-col layout, steps`

### 3.3 Receive (`pages/account/Receive.tsx`)

**Keep intact:** `useWallet`, `useUserProfile`, share API, clipboard copy
**Changes:** Wallet card with dark background + account number display, copy/share action buttons

**Commit:** `redesign(phase-3c): receive screen`

### 3.4 Transactions (`pages/account/Transactions.tsx`)

**Keep intact:** `useTransactions`, pagination, search debounce, filter state
**Changes:** Date-grouped list with warm card background, pill filter tabs, search with icon

**Commit:** `redesign(phase-3d): transactions list — grouped, filtered`

### 3.5 TransactionDetail (`pages/account/TransactionDetail.tsx`)

**Keep intact:** data fetching, PDF/image export (html-to-image + jspdf)
**Changes:** Review-style layout matching uveruspay Transfers step 2 — dark amount box + detail rows

**Commit:** `redesign(phase-3e): transaction detail`

### 3.6 Profile (`pages/account/Profile.tsx`)

**Keep intact:** `UserService.getProfile`, `UserService.updateProfile`, edit mode toggle, TierDocumentsCard
**Changes:** Large avatar with initials, inline edit form, warm card layout

**Commit:** `redesign(phase-3f): profile screen`

### 3.7 Settings (`pages/account/Settings.tsx`)

**Keep intact:** All dialogs (ChangePasswordDialog, DeleteAccountDialog, TierUpgradeDialog, SetupPinDialog, VerifyPinDialog), `useUserSettings`, `usePinStatus`, `useKYC`, `usePlatformKYC`
**Changes:** Section cards with eyebrow labels, toggle rows, warm styling

**Commit:** `redesign(phase-3g): settings screen`

### 3.8 Notifications (`pages/account/Notifications.tsx`)

**Keep intact:** `useNotifications` hook
**Changes:** Warm list layout, unread indicators

**Commit:** `redesign(phase-3h): notifications screen`

### 3.9 KYC Verification (`pages/account/KYCVerification.tsx`)

**Keep intact:** `useKycMutations`, all form logic
**Changes:** Warm card styling, step layout

**Commit:** `redesign(phase-3i): KYC verification screen`

### 3.10 Create Wallet (`pages/account/CreateWallet.tsx`)

**Keep intact:** `useWalletMutations`
**Changes:** Warm card form layout

**Commit:** `redesign(phase-3j): create wallet screen`

---

## Phase 4 — Auth Screens

**Files:** `pages/Index.tsx`, `pages/auth/*.tsx`

**Keep intact:** All auth mutations (`useRegister`, `usePublicValidateBvn`, OTP, password reset flows), form schemas
**Changes:** Split layout (branding left / form right on desktop), warm palette, Inter typography

Screens: Login, Register (2-step), VerifyOTP, ForgotPassword, ResetPassword

**Commit:** `redesign(phase-4): auth screens — split layout, warm palette`

---

## Phase 5 — Shared Component Updates

**Files:** `TransactionList.tsx`, `TransactionCard.tsx`, `PageHeader.tsx`, dashboard banner components

**Keep intact:** All data props and handlers
**Changes:** Visual styling only — warm palette, rounded cards, new typography classes

**Commit:** `redesign(phase-5): shared components — TransactionList, TransactionCard, banners`

---

## Phase 6 — Admin Section (Light Touch)

**Files:** `components/admin/AdminLayout.tsx`, admin page wrappers
**Scope:** Layout shell update only — warm palette, sidebar style. No data layer changes.

**Commit:** `redesign(phase-6): admin layout shell update`

---

## Risk Mitigations

| Risk                       | Mitigation                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Breaking API calls         | Never edit service files, query hooks, or mutation hooks                                        |
| Breaking form validation   | Never edit Zod schemas or React Hook Form setup                                                 |
| Breaking brand theming     | Keep all `--brand-primary` / `--brand-secondary` CSS var injection points in BrandConfigService |
| Breaking real-time balance | Never touch `useBalanceSocket` or `balanceSocket.ts`                                            |
| Breaking PIN flow          | Preserve `TransactionPinDialog` component, only restyle                                         |
| Breaking PDF export        | Never touch `html-to-image` or `jspdf` integration                                              |
| Breaking admin routes      | AdminLayout is a separate component, admin pages untouched after phase 6                        |

---

## Files Never Touched

```
src/hooks/            — all hooks
src/services/         — all service files
src/lib/              — api.ts, currency.ts, balanceSocket.ts, utils.ts
src/types/            — index.ts
src/contexts/         — AuthContext.tsx, AdminContext.tsx
src/config/           — sessionConfig.ts
src/components/ui/    — shadcn base components (restyled via CSS vars only)
shared/               — BrandConfigService and all shared utilities
```
