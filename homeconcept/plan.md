# HomeConcept SalesBrief — Implementation Plan

## Implementation approach

Build a static React + TypeScript single-page web app with Tailwind CSS and Vite. Use browser `localStorage` for product catalogue and enquiry persistence, seeded with five realistic Nigerian sample enquiries and a small furniture catalogue on first visit. Keep every route on the same app origin: `/start`, `/enquiry/:productSlug`, `/dashboard`, and `/products`; the root route opens the staff dashboard. A compact responsive navigation lets staff and test customers switch views.

The public enquiry experience is a conversational, step-by-step assistant, not a conventional long form. It captures customer name and WhatsApp number; room type, approximate dimensions and optional room photo; style chips; colour/material; a required NGN budget range; delivery state, area and floor; timeline; and optional inspiration image. If budget is skipped, the flow politely repeats that question; if measurements are unknown, it offers a guided estimating prompt. At completion, it displays “Here’s what I captured...” and lets the customer submit to the HomeConcept Team. Image uploads are stored as browser data URLs and treated as optional.

On submission, save a structured enquiry and transcript to localStorage so it appears immediately on the dashboard. The dashboard pairs a searchable/filterable enquiry list with the selected sales brief, status transitions, customer `wa.me` link, product image, 2–3 sentence contextual brief summary, key-details table, missing-information flags, recommended actions, and collapsible transcript. Summary, recommendations, and a personalized WhatsApp reply are produced by deterministic contextual rules from collected answers, which satisfies the requested smart rule-based prototype without claiming to call a live LLM. Include clipboard copy, browser print-to-PDF for the brief, and a clearly simulated WhatsApp send action with a confirmation state.

The products page supports creating, editing, and deleting products with name, NGN price, category, and image URL. The enquiry view references the selected product and can open a product-specific enquiry route. Use supplied search-collected Unsplash furniture images as local project assets; provide fallbacks for broken custom image URLs.

### Project structure

- `src/main.tsx` — React entry point and global styles.
- `src/App.tsx` — client routes, app shell and responsive navigation.
- `src/pages/EnquiryPage.tsx` — conversational customer journey, uploads, summary and submission.
- `src/pages/DashboardPage.tsx` — enquiry inbox, generated brief, transcript and staff actions.
- `src/pages/ProductsPage.tsx` — local product catalogue CRUD.
- `src/components/` — reusable brand mark, product imagery, status badges, input chips, dialogs/toasts and brief sections.
- `src/lib/types.ts` — typed product, enquiry, answer and transcript models.
- `src/lib/storage.ts` — versioned localStorage persistence, seed data and safe parsing.
- `src/lib/chatFlow.ts` — conversational question sequencing and validation/skip handling.
- `src/lib/briefGeneration.ts` — contextual summaries, missing information, staff recommendations and WhatsApp drafts.
- `src/data/seed.ts` — initial products and five enquiries from Lagos, Abuja and Enugu.
- `public/images/` — selected, project-local Unsplash furniture imagery.
- `public/manus-routes.json` — declared app page routes for Preview routing.

No managed server or database is needed for this explicitly local-storage prototype. Declare a reproducible static Vite build for eventual deployment. The prototype's customer/staff sharing is within the same browser profile and storage origin; it is not a cross-device live database.

## Design direction

### Design Movement

Warm contemporary editorial furniture retail: the calm, material-led restraint of Scandinavian interiors softened with Nigerian hospitality.

### Core Principles

1. Make the sofa and customer's room context feel tangible through generous, purposeful furniture photography.
2. Keep information legible and calm: one clear action at a time in chat, and scannable structured detail for staff.
3. Use warm neutral surfaces and restrained accents to signal premium care without visual clutter.
4. Make every status, omission and logistics detail visible enough to support a confident next step.

### Color Philosophy

Ivory and sand create a quiet interior-like canvas; warm greys keep dense staff details soft; ink-black anchors text and actions. A muted olive accent adds an ownable, natural signal for selected actions and positive states, while small terracotta notes can mark urgency. Avoid stark blue software styling.

### Layout Paradigm

An editorial split-view composition: image-led customer enquiry with a narrow conversational column, and a desktop staff workspace with a compact left inbox and a wider document-like brief panel. On phones, convert the dashboard to a one-column inbox/detail switch and keep primary actions thumb-reachable.

### Signature Elements

- A small `HC` frame/sofa-corner monogram paired with a wordmark placeholder.
- Hairline warm-grey dividers and softly rounded, paper-like cards instead of heavy shadows.
- Olive status dots and small uppercase section labels that give the generated brief a considered showroom-catalogue feel.

### Interaction Philosophy

Ask one natural question per chat turn, show tap-friendly choices where the answer is bounded, preserve entered values when navigating backward, and explain logistics questions in friendly microcopy. Staff actions give immediate, reversible feedback; ambiguous or incomplete information is surfaced rather than invented.

### Animation

Use brief, low-distance fade/slide transitions for new chat turns and drawer changes, with subtle status transitions. Keep motion under 200 ms, avoid looping decoration, and respect reduced-motion preferences.

### Typography System

Use Sora for display headings and the wordmark, paired with Inter for body copy, controls and data. Use a compact scale with bold large page titles, medium-weight section headings, and readable 14–16 px body text; use tabular numerals for prices and clear uppercase micro-labels sparingly.

### Brand Essence

A warm, practical sales companion that turns incomplete furniture enquiries into delivery-ready customer briefs; **considered, helpful, dependable**.

### Brand Voice

Headlines are concise and customer-centred; prompts are conversational, respectful and specific; staff actions use direct verbs. Examples: “Let’s find the right fit for your room.” and “A few details help us quote with confidence.”

### Wordmark & Logo

Use a placeholder mark consisting of a geometric `HC` monogram framed by two open right-angle strokes suggestive of a sofa arm and room corner, beside the HomeConcept wordmark. Keep the site logo editable as a presentational placeholder, not a claim of official brand artwork.

### Signature Brand Color

Muted olive `#69735B`, used in small, consistent doses for affirmative actions, selected chips and completed states.
