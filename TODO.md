# TODO — Missing & Incomplete Features

## Database / Model Gaps -- DONE

- ~~Add `body_type` field (Sedan, SUV, Coupe, Hatchback, Wagon, Convertible, Van)~~
- ~~Add `transmission` field (Manual, Automatic, CVT, Semi-automatic)~~
- ~~Add `horsepower` / `engine_power` field (currently hardcoded "9 kW (12 hp)" in vehicle detail)~~
- ~~Add `engine_displacement` (cc)~~
- ~~Add `exterior_color`, `interior_color`~~
- ~~Add `number_of_doors`, `number_of_seats`~~
- ~~Add `drive_type` (FWD, RWD, AWD)~~
- ~~Add `previous_owners` count~~
- ~~Add `seller_type` (Private / Dealer)~~
- ~~Add `views_count` for popularity tracking~~

## User / Contact Info -- DONE

- ~~Add contact fields to User profile (phone, display name, location)~~
- ~~Show seller contact info on vehicle detail page (name, phone, email)~~
- ~~"Send Email" button on vehicle detail is non-functional — needs backend endpoint or mailto~~
- ~~Replace hardcoded "Private seller" on detail page with actual data~~

## ~~Listing Limits -- DONE~~

- ~~Regular users can only have 1 active listing at a time~~
- ~~Must remove/deactivate current listing before adding another~~
- ~~Admin/staff users have no listing limit~~
- ~~Show remaining quota on add-listing page~~

## Vehicle Detail Page

- ~~Gearbox shows "-" — wire to actual `transmission` field~~
- ~~Power shows hardcoded value — wire to `horsepower` field~~
- ~~Add body type, color, drivetrain, doors, seats, previous owners~~
- ~~Favorites heart is local state only — lost on refresh~~

## Homepage — Non-functional Buttons/Links -- DONE

- ~~BodyTypeSearch — clicking Sedan/SUV/etc does nothing, should navigate to `/search?body_type=...`~~
- ~~CurrentlyInDemand — "Electric cars", "New cars" buttons don't filter~~
- ~~FuelTypeSearch — component folder is empty, no files~~
- ~~LastSearchCard — hardcoded "BMW 320d" test data, "More results" button does nothing~~
- ~~Favorites link in header goes to `/favorites` which doesn't exist~~

## Search & Filtering

- ~~No `body_type` filter (needs DB field first)~~
- ~~No `transmission` filter~~
- ~~No sort options (price low/high, newest, mileage)~~

## Admin Dashboard

- ~~No pagination on listings table~~
- ~~No search/filter on admin listings~~
- No bulk actions (multi-select, bulk feature toggle)

## ~~Translations & Localization~~ -- DONE

- ~~All strings hardcoded in English~~
- ~~No i18n framework (next-intl or similar) — custom React Context + JSON files~~
- ~~No locale switching — language switcher in header, stored in localStorage~~
- Prices always shown in EUR with no formatting options

## Form Validation

- ~~Login: no email format validation~~
- ~~Register: no password confirmation field, no strength indicator~~
- ~~Add-listing: no validation on price/mileage/year (negative values possible)~~
- ~~No max file size check on image uploads (frontend or backend) — added backend validation (type, 5MB, 20 files max)~~
- ~~Serializer has no field-level validators~~

## ~~Error Handling & UX~~ -- DONE

- ~~No toast notification system (success/error)~~
- ~~Errors only shown inline or logged to console~~
- ~~No global error boundary~~
- ~~No "unsaved changes" warning on add-listing page~~
- ~~No confirmation dialog before delete (besides browser default)~~
- ~~No loading spinners on delete/update operations~~

## ~~Favorites System~~ -- DONE

- ~~Heart icon state is local only — not persisted~~
- ~~No backend endpoint for favorites CRUD~~
- ~~No `/favorites` page~~

## ~~Saved Searches~~ -- DONE

- ~~LastSearchCard UI exists but not wired to real data~~
- ~~No localStorage or backend persistence for recent searches~~
- No search alerts / notifications

## Dealer System -- DONE

- ~~Add dealer request flow (user requests dealer status, admin approves/rejects)~~
- ~~Add DealerPhone and DealerAddress models for multi-contact dealer profiles~~
- ~~Add company_name and company_image to UserProfile~~
- ~~Admin dashboard: manage dealer requests (approve/reject)~~
- ~~Admin dashboard: manage listing limit requests~~
- ~~Auto-set seller_type from UserProfile on listing create/update (removed from form)~~

## Search Result Cards -- DONE

- ~~Show real seller data instead of hardcoded "PG Cars" / "Lukas Sternberger"~~
- ~~Show dealer logo on search result cards (if dealer)~~
- ~~Dynamic image count (1 / N from actual images)~~
- ~~Dynamic transmission and horsepower display~~
- ~~"Show more vehicles" links to /search?seller=username~~
- ~~Add seller filter to listings API and search page~~

## Security Hardening -- DONE

- ~~Add owner permission check on listing edit/delete~~
- ~~Remove email from public seller API response~~
- ~~Restrict CORS to localhost origins~~
- ~~Add DRF rate limiting (30/min anon, 120/min authenticated)~~
- ~~Use F() expression for atomic view count increment~~
- ~~Return 403 for non-staff on admin endpoints~~
- ~~Add image upload validation (file type, size, count)~~
