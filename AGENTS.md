# AutoScout24 Clone — Project Instructions

## Project Overview

This is an AutoScout24-inspired vehicle marketplace clone with a Django REST backend and a Next.js frontend. Users can browse, search, and filter vehicle listings. Authenticated users can create/edit/delete their own listings. Staff users have an admin dashboard for managing all listings and toggling featured status.

---

## Tech Stack

### Backend

| Technology            | Version | Purpose                |
| --------------------- | ------- | ---------------------- |
| Python                | 3.x     | Runtime                |
| Django                | 5.1     | Web framework          |
| Django REST Framework | latest  | REST API layer         |
| SQLite3               | —       | Database (development) |
| django-cors-headers   | latest  | Cross-origin requests  |
| Pillow                | latest  | Image processing       |

### Frontend

| Technology           | Version | Purpose                                                      |
| -------------------- | ------- | ------------------------------------------------------------ |
| Next.js              | 14.1.3  | React framework (App Router)                                 |
| React                | 18      | UI library                                                   |
| TypeScript           | 5       | Type safety                                                  |
| Tailwind CSS         | 3.3.0   | Utility-first styling                                        |
| shadcn/ui (Radix UI) | —       | Component primitives (Dialog, Dropdown, Select, Tabs, Sheet) |
| Lucide React         | 0.359.0 | Icon library                                                 |
| tailwindcss-animate  | —       | Animation utilities                                          |

---

## Folder Structure

```
root/
├── AGENTS.md                  # This file — project instructions
├── README.md
├── backend/                   # Django REST API
│   ├── manage.py
│   ├── db.sqlite3
│   ├── as24backend/           # Django project config
│   │   ├── settings.py        # Installed apps, middleware, CORS, auth, media
│   │   ├── urls.py            # Root URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── listings/              # Main Django app
│   │   ├── models.py          # Listing, ListingImage models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # API views (listings, auth, admin)
│   │   ├── admin.py           # Django admin config
│   │   ├── tests.py
│   │   └── migrations/
│   └── media/                 # Uploaded images (gitignored)
│       └── listings/
└── frontend/                  # Next.js 14 App Router
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── components.json        # shadcn/ui config
    ├── app/                   # Pages (App Router)
    │   ├── layout.tsx         # Root layout (Header + Footer wrapper)
    │   ├── page.tsx           # Home page
    │   ├── globals.css        # Global styles, CSS variables, fonts
    │   ├── search/page.tsx
    │   ├── vehicle/[id]/page.tsx
    │   ├── add-listing/page.tsx
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── admin/page.tsx
    │   └── my-listings/page.tsx
    ├── components/
    │   ├── Header.tsx         # Top-level client wrapper
    │   ├── Footer.tsx         # Top-level client wrapper
    │   └── ui/
    │       ├── badge.tsx      # shadcn/ui primitives
    │       ├── button.tsx
    │       ├── select.tsx
    │       ├── sheet.tsx
    │       ├── tabs.tsx
    │       ├── dropdown-menu.tsx
    │       └── custom/        # Project-specific components
    │           ├── index.tsx   # Barrel export
    │           ├── Header/
    │           ├── Footer/
    │           ├── Search/
    │           ├── VehicleCard/
    │           ├── VehicleSearchedResult/
    │           ├── FilterSidebar/
    │           ├── FeaturedVehicles/
    │           ├── BodyTypeSearch/
    │           ├── CurrentlyInDemand/
    │           ├── FuelTypeSearch/
    │           └── LastSearchCard/
    ├── lib/
    │   ├── api.ts             # API client (fetch wrappers, types)
    │   └── utils.ts           # cn() Tailwind class merge utility
    ├── types/
    │   └── Home.ts            # Shared TypeScript types
    ├── utils/
    │   ├── tabsData.tsx       # Tab component config
    │   ├── tabsStatic.ts      # Static dropdown data (makes, models, prices, years, countries)
    │   └── vehicleBrands.ts   # Brand-to-model mapping
    └── public/
        ├── body-types/        # Static body-type SVGs/images
        ├── demand/            # Demand section images
        └── icons/             # Tab icons, UI icons
```

---

## Component Architecture

### Separation Pattern

Components follow a **three-tier** structure:

1. **shadcn/ui primitives** (`components/ui/*.tsx`) — Low-level, unstyled Radix UI wrappers. Do not modify these directly; re-generate via `npx shadcn-ui@latest add <component>`.
2. **Custom domain components** (`components/ui/custom/<Feature>/`) — Feature-specific components grouped by folder. Each folder contains the main component and its sub-components (e.g., `FilterSidebar.tsx` + `FilterSidebarComponents.tsx`).
3. **Page components** (`app/*/page.tsx`) — Top-level route handlers. Compose custom components and manage page-level state/data fetching.

### Barrel Exports

`components/ui/custom/index.tsx` re-exports shared components (Header variants, Footer variants). Import from the barrel:

```tsx
import { HeaderDesktop, HeaderMobile, FooterTop } from "@/components/ui/custom";
```

### Sub-component Convention

Larger features split into a main file and a `*Components.tsx` companion:

- `FilterSidebar.tsx` — Main wrapper, state, layout
- `FilterSidebarComponents.tsx` — Smaller building blocks used inside the sidebar
- `VehicleSearchedResult.tsx` + `VehicleSearchedResultComponents.tsx` — Same pattern

### Client Components

Most components use `"use client"` since the app is heavily interactive. The root layout (`app/layout.tsx`) is a server component that imports client-side Header/Footer wrappers.

---

## Database Schema

### Listing

| Field               | Type             | Notes                                     |
| ------------------- | ---------------- | ----------------------------------------- |
| `id`                | BigAutoField     | Primary key                               |
| `user`              | ForeignKey(User) | CASCADE delete, `related_name='listings'` |
| `title`             | CharField(255)   |                                           |
| `make`              | CharField(100)   | Vehicle brand                             |
| `model`             | CharField(100)   |                                           |
| `year`              | IntegerField     |                                           |
| `registration_year` | IntegerField     |                                           |
| `mileage`           | IntegerField     |                                           |
| `price`             | IntegerField     | In EUR                                    |
| `fuel_type`         | CharField        | Choices: petrol, diesel, electric, hybrid |
| `country`           | CharField(100)   |                                           |
| `city`              | CharField(100)   |                                           |
| `description`       | TextField        | Nullable                                  |
| `main_image`        | ImageField       | `upload_to='listings/'`, nullable         |
| `status`            | CharField        | Default: `'ACTIVE'`                       |
| `featured`          | BooleanField     | Default: `False`                          |
| `created_at`        | DateTimeField    | auto_now_add                              |

### ListingImage

| Field        | Type                | Notes                                   |
| ------------ | ------------------- | --------------------------------------- |
| `id`         | BigAutoField        | Primary key                             |
| `listing`    | ForeignKey(Listing) | CASCADE delete, `related_name='images'` |
| `image`      | ImageField          | `upload_to='listings/'`                 |
| `created_at` | DateTimeField       | auto_now_add, used for ordering         |

---

## API Endpoints

Base URL: `http://127.0.0.1:8000`

### Listings

| Method | Endpoint              | Auth          | Description                                                                                   |
| ------ | --------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/api/listings/`      | Public        | List listings. Filters: `make`, `model`, `price` (max), `registration`, `country`, `featured` |
| POST   | `/api/listings/`      | Token         | Create listing with images                                                                    |
| GET    | `/api/listings/<id>/` | Public        | Single listing detail                                                                         |
| PUT    | `/api/listings/<id>/` | Token (owner) | Update listing                                                                                |
| DELETE | `/api/listings/<id>/` | Token (owner) | Delete listing                                                                                |

### Authentication

| Method | Endpoint                  | Auth   | Description                                                            |
| ------ | ------------------------- | ------ | ---------------------------------------------------------------------- |
| POST   | `/api/auth/register/`     | Public | Register: `username`, `email`, `password`                              |
| POST   | `/api/auth/login/`        | Public | Login: `username` or `email` + `password`. Returns `token` + user data |
| GET    | `/api/auth/current-user/` | Token  | Verify token, get current user (id, username, email, is_staff)         |

### Admin

| Method | Endpoint                                    | Auth          | Description                      |
| ------ | ------------------------------------------- | ------------- | -------------------------------- |
| GET    | `/api/admin/listings/`                      | Token (staff) | All listings for admin dashboard |
| PATCH  | `/api/admin/listings/<id>/toggle-featured/` | Token (staff) | Toggle `featured` flag           |
| GET    | `/api/admin/brand-average-prices/`          | Public        | Average price + count per make   |

---

## Authentication & State Management

### Auth Flow

1. User registers or logs in → backend returns a **Token** + user data.
2. Frontend stores `authToken`, `authUser`, and `isAdmin` in `localStorage`.
3. A custom `authChange` event (`window.dispatchEvent(new Event("authChange"))`) notifies the Header to re-render.
4. On page load, the Header calls `/api/auth/current-user/` to verify the token is still valid.
5. Protected pages redirect to `/login` if no token is found.

### State Management

- **No global state library.** All state is local via `useState`.
- Auth state lives in `localStorage` + custom DOM events for cross-component sync.
- API calls use the native `fetch` API with `cache: "no-store"`.

---

## Styling Conventions

### Tailwind CSS

- **Mobile-first** responsive design. Use `md:` breakpoints for desktop layouts.
- Container: centered, max `1400px`.
- Use the `cn()` utility from `lib/utils.ts` for conditional class merging:
  ```tsx
  className={cn("base-class", condition && "conditional-class")}
  ```

### Theme (CSS Variables)

Defined in `app/globals.css` using HSL format:

| Token           | Value                   | Usage                   |
| --------------- | ----------------------- | ----------------------- |
| `--primary`     | Dark navy (#1c1c2e)     | Main text, headers      |
| `--accent`      | Bright yellow (#f5f200) | CTA buttons, highlights |
| `--background`  | #f4f4f4                 | Page background         |
| `--secondary`   | Light gray              | Secondary surfaces      |
| `--destructive` | Red                     | Errors, delete actions  |

### Font

- **Inter** (Google Fonts), loaded in root layout.

---

## Security Standards

### Backend

- **Token Authentication** via `rest_framework.authtoken`. Tokens sent as `Authorization: Token <key>`.
- **CSRF middleware** enabled (Django default).
- **Permission classes**: `IsAuthenticated` by default; `AllowAny` explicitly set on public endpoints.
- **Owner checks**: Listing edit/delete verifies the requesting user owns the listing.
- **Staff checks**: Admin endpoints verify `request.user.is_staff` server-side (never trust the client).
- **Media isolation**: Uploaded images stored under `/media/listings/`.

### Frontend

- **Client-side route protection**: Pages redirect to `/login` if no `authToken` in localStorage.
- **Admin verification**: The admin page calls `/api/auth/current-user/` and checks `is_staff` before rendering.
- **Token-based requests**: All authenticated API calls include `Authorization: Token <key>` header.

### Known Development-Only Settings (fix before production)

- `CORS_ALLOW_ALL_ORIGINS = True` — Restrict to specific origins.
- `DEBUG = True` — Disable in production.
- `SECRET_KEY` hardcoded in settings.py — Move to environment variable.
- API base URL hardcoded as `http://127.0.0.1:8000` in `lib/api.ts` — Use environment variable.
- Auth tokens in `localStorage` — Consider `httpOnly` cookies for production.

---

## Development Commands

### Backend

```bash
cd backend
python manage.py runserver          # Start Django dev server (port 8000)
python manage.py makemigrations     # Create new migrations
python manage.py migrate            # Apply migrations
python manage.py createsuperuser    # Create admin user
```

### Frontend

```bash
cd frontend
npm install                         # Install dependencies
npm run dev                         # Start Next.js dev server (port 3000)
npm run build                       # Production build
npm run lint                        # Run ESLint
```

---

## Coding Conventions

- **Python**: Follow PEP 8. Use Django/DRF patterns (ModelSerializer, ViewSet-like views, permission_classes).
- **TypeScript**: Strict mode. Define types in `types/` or co-locate in `lib/api.ts`. Prefer `type` over `interface`.
- **Components**: `"use client"` directive at top of interactive components. Name files in PascalCase matching the exported component.
- **Imports**: Use `@/` path alias for all imports (`@/components/...`, `@/lib/...`, `@/types/...`).
- **CSS**: Tailwind utility classes only. No inline `style` props. Use `cn()` for conditional classes.
- **API calls**: Use `fetch` directly (no axios). Set `cache: "no-store"` for dynamic data.
- **New pages**: Create under `app/<route>/page.tsx`. Follow App Router conventions.
- **New components**: Create a folder under `components/ui/custom/<Feature>/`. Export from barrel if shared.
- **Migrations**: Let Django auto-number (`0001`, `0002`, …). Use `--name` for clarity: `python manage.py makemigrations --name <short_description>` (e.g., `--name add_view_count`). Never manually rename or renumber migration files. Always commit migrations to version control.

---

## Skill: Commit Message + Changelog

Trigger:

- Any user request asking for a commit message.
- Any user request asking for a changelog.
- Wording does not need to be exact (examples: "the changelog", "write commit msg", "can you prepare release notes").

When this intent is detected, always return exactly 1 fenced code block.

Output wrapper contract (strict):

- Return exactly 1 fenced code block using ```text.
- The block contains 2 sections separated by a line of dashes: ----------------------------------------
- Section 1 (top) = semantic commit message.
- Section 2 (bottom) = GitHub changelog.
- Do not output any plain text before or after the fenced code block.

### Section 1: Semantic commit message (top half)

- First line must be semantic: feat:, fix:, refactor:, perf:, test:, docs:, chore:, build:, ci:, or style:
- Subject must be short and specific.
- Add bullets with concise technical scope by area (UI, Service, Controller, Repository, Entity, DB, Security, Dependency).
- Plain text only in section 1: no backticks, no bold, no italic, no links, no markdown code formatting.
- If a class/file/field/method name is mentioned in section 1, write it as plain text.

### Section 2: GitHub changelog (bottom half)

- Start with ## Changes (<commit_link>)
- Use markdown code formatting for technical identifiers: `fieldName`, `ClassName`, routes, SQL columns, etc.
- Use **bold** for major impact points when useful.

### Template

```text
<type>: <short title>

- <Area>: <change>
- <Area>: <change>
- <Area>: <change>

----------------------------------------

## Changes (<commit_link>)

- <Area>: <detailed summary with `identifiers`>.
- <Area>: <detailed summary>.
- <Area>: <migration/dependency/security/testing note>.
```

Selection hints:

- feat: new feature/capability
- fix: bug fix
- refactor: internal restructuring without behavior change
- perf: performance improvement
- docs: documentation only
