# Control Branding & UI Design

## Overview

Control is a specialized fintech application designed with a high-performance, dynamic primary color system. It focuses on clarity, speed, and real-time feedback.

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

Control uses a set of core gradients for emphasis:

- **Primary Gradient**: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%)`
- **Surface Gradient**: `linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--surface-elevated)) 100%)`
- **Fintech Card**: `linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(220 13% 98%) 100%)`

## Typography

- **Sans-serif**: `Inter`, Arial, sans-serif
- **Monospace**: `JetBrains Mono`, monospace (used for transaction IDs, code, and data values)

## UI Patterns & Assets

- **Border Radius**: Professional defaults:
  - Base: `0.75rem`
  - Small: `0.5rem`
  - Large: `1rem`
- **Shadows**:
  - **Fintech Glow**: `0 8px 30px hsl(var(--primary) / 0.12)`
- **Animations**:
  - `pulse-fintech`: Subtle glowing effect for active transactions.
  - `blob`: Dynamic background shapes for hero sections.
- **Icons**: Lucide React.
