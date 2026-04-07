# Dashboard Branding & UI Design

## Overview

Dashboard is a fintech-oriented project, identical in its foundation to Control but tailored for different user perspectives. Its design prioritizes information density, interactive data visualization, and financial oversight.

## Color Palette

### Primary Colors (Dynamic)

The primary system is based on a dynamic hue-saturation-lightness (HSL) model:

- **Primary**: `hsl(4.92 85.15% 55.1%)` (Red/Orange base)
- **Primary Light**: Primary + 15% Lightness
- **Primary Dark**: Primary - 10% Lightness

### Fintech Success/Status Palette

- **Success**: `hsl(145 63% 49%)`
- **Warning**: `hsl(38 92% 50%)`
- **Error/Destructive**: `hsl(0 84% 60%)`
- **Info**: `hsl(207 89% 86%)`

### Surface & Background

- **Background**: `hsl(0 0% 100%)` (Light) / `hsl(222.2 84% 4.9%)` (Dark)
- **Surface Elevated**: `hsl(0 0% 98%)`
- **Surface Overlay**: `hsl(0 0% 96%)`
- **Card**: `hsl(0 0% 100%)`

## Gradients

Dashboard uses Fintech-focused gradients:

- **Primary Gradient**: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%)`
- **Surface Gradient**: `linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--surface-elevated)) 100%)`
- **Fintech Card**: `linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(220 13% 98%) 100%)`

## Typography

- **Sans-serif**: `Inter`, Arial, sans-serif
- **Monospace**: `JetBrains Mono`, monospace (Essential for financial data and numerical values)

## UI Patterns & Assets

- **Border Radius**: Balanced professional radius:
  - Base: `0.75rem`
  - Small: `0.5rem`
  - Large: `1rem`
- **Shadows**:
  - **Fintech Glow**: `0 8px 30px hsl(var(--primary) / 0.12)`
- **Interactive Elements**:
  - Focus on charts (Recharts) and data tables (shadcn/ui).
  - Custom animations for real-time updates: `pulse-fintech`.
- **Icons**: Lucide React.
