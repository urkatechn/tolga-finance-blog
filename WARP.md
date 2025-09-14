# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 15.5.2 with App Router, React 19, TypeScript
- **Database & Auth**: Supabase for storage and authentication
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **Forms**: react-hook-form + zod for validation
- **Content**: MDX with Markdown preview/editor
- **State Management**: React hooks + Context

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture Overview

### Core Application Structure
```
src/
  app/              # Next.js App Router pages and layouts
    (public routes)
    api/            # API route handlers
  components/
    ui/             # shadcn/ui components
    theme-*.tsx     # Theme management components
  hooks/            # Custom React hooks
  lib/              # Utility functions and core setup
```

### Key Architectural Patterns

1. **Authentication & Storage**
   - Supabase handles authentication and image storage
   - Storage policies are configured for blog images with public/private access controls
   - See `SUPABASE_STORAGE_SETUP.md` for detailed storage configuration

2. **Theme Management**
   - Dark/light mode support via `next-themes`
   - Theme context provider wraps the application
   - Toggle component available in `components/theme-toggle.tsx`

3. **UI Components**
   - Uses shadcn/ui for base components
   - Components are generated in `components/ui/*`
   - Fully customizable as they're part of the codebase

4. **Forms and Validation**
   - Forms use react-hook-form with zod schemas
   - Validation schemas should be defined in relevant feature directories

5. **Mobile Support**
   - Responsive design via Tailwind classes
   - Mobile detection via `use-mobile` hook

## Special Notes

- The project uses Turbopack both for development and production builds
- Markdown content is rendered using MDX with support for GitHub Flavored Markdown
- Code changes should maintain the existing pattern of using shadcn/ui components
- New UI components should be added using the shadcn CLI: `npx shadcn add <component-name>`