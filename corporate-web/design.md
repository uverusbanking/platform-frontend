# Corporate Web Branding & UI Design

## Overview

Corporate Web is the enterprise-facing terminal for Uverus. Its design is professional, stable, and rigid, using a Corporate Blue theme with a focus on data density and clear information architecture to facilitate complex financial operations.

## Color Palette

### Corporate Blue Theme

Corporate Web uses a distinct blue-focused palette to distinguish it from the consumer-facing purple:

- **Primary (Corporate Blue)**: `hsl(215 70% 38%)`
- **Secondary (Light Gray-Blue)**: `hsl(210 25% 93%)`
- **Tertiary (Bright Indigo)**: `hsl(225 60% 65%)`
- **Primary Glow**: `hsl(210 75% 48%)`

### Status Palette (Industry Standard)

- **Success**: `hsl(142 60% 40%)`
- **Warning**: `hsl(38 92% 50%)`
- **Destructive**: `hsl(0 72% 51%)`

### Surface & Background System

A sophisticated layering system for complex dashboard UIs:

- **Background**: `hsl(210 20% 98%)` (Light) / `hsl(215 28% 8%)` (Dark)
- **Surface Low**: `hsl(210 18% 95%)` (Background for cards/tables)
- **Surface Container**: `hsl(0 0% 100%)` (Base for content areas)
- **Surface High**: `hsl(210 25% 93%)` (Sidebar/Background for nested elements)
- **Surface Highest**: `hsl(210 20% 90%)` (Active states/Borders)
- **Sidebar**: `hsl(210 18% 96%)` background for high-contrast navigation.

## Typography

- **Headings**: `Manrope` (A professional, modern geometric sans-serif)
- **Body**: `Inter` (Standard for high readability)
- **Hierarchy**: Clean, structured hierarchy with explicit focus on tabular numbers and labels.

## UI Patterns & Assets

- **Border Radius**: Rigid and space-efficient radius:
  - Base (`var(--radius)`): `0.25rem` (Sharp, professional look compared to Personal's `0.75rem`)
- **UI Architecture**:
  - **Tables**: Heavy use of structured data tables (`Table`, `TableCell`) for transaction lists and approval queues.
  - **Sidebar**: Persistent, multi-level navigation for enterprise tooling.
  - **Modals/Sheets**: Consistent use for detail views and action prompts.
- **Icons**: Lucide React.
- **Components**: Built on shadcn/ui with extended surface tokens for layered complexity.
