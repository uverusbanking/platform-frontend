# Personal Web Branding & UI Design

## Overview

Personal Web is the consumer-facing interface for Uverus. Its design is vibrant, modern, and high-energy, using a Purple-Indigo-Violet theme with glassmorphism and subtle animations to create a premium feel.

## Color Palette

### Uverus Core Palette

The design is built around the Uverus Purple brand identity:

- **Primary (Uverus Purple)**: `hsl(263 70% 50%)`
- **Uverus Purple Light**: `hsl(263 70% 60%)`
- **Uverus Purple Dark**: `hsl(263 70% 40%)`
- **Uverus Indigo**: `hsl(245 58% 51%)`
- **Uverus Violet**: `hsl(270 67% 58%)`

### Status palette

- **Success**: `hsl(142 76% 36%)`
- **Warning**: `hsl(38 92% 50%)`
- **Destructive**: `hsl(0 84% 60%)`

### Surface & Background

- **Background**: `hsl(0 0% 100%)` (Light) / `hsl(240 10% 6%)` (Dark)
- **Foreground**: `hsl(240 10% 10%)` (Light) / `hsl(0 0% 98%)` (Dark)
- **Accent**: `hsl(263 70% 96%)` / `hsl(263 70% 20%)`

## Gradients

Personal Web heavily utilizes gradients for its premium aesthetic:

- **Primary Gradient**: Purple to Indigo (`linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(245 58% 51%) 100%)`)
- **Hero Gradient**: Purple to Violet to Indigo (`linear-gradient(135deg, hsl(263 70% 50%) 0%, hsl(270 67% 58%) 50%, hsl(245 58% 51%) 100%)`)

## Typography

- **Primary Sans**: `Inter`
- **Secondary Sans**: `DM Sans`
- **Hierarchy**: Uses bold, tracking-tight headings for a modern, impactful look.

## UI Patterns & Assets

- **Border Radius**: Large, consumer-friendly radius:
  - Base (`var(--radius)`): `0.75rem`
- **Glassmorphism**:
  - `.glass`: Backdrop blur with semi-transparent white background.
  - `.glass-dark`: Backdrop blur with semi-transparent black background.
- **Shadows**:
  - **Shadow Glow**: Intense purple glow (`0 0 40px -10px hsl(263 70% 50% / 0.4)`) used for primary buttons and cards.
- **Animations**:
  - `float`: Gentle vertical movement for hero assets.
  - `shimmer\*\*: Loading/skeletal effect.
- **Mobile Optimized**:
  - Minimum touch targets: `44px`.
  - Safe area padding support (`env(safe-area-inset-top)`, etc.).
- **Icons**: Lucide React.
