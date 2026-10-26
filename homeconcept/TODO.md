# HomeConcept SalesBrief — TODO

## 1. Customer enquiry assistant — Complete
- [x] Provide customer-facing pages at `/enquiry/[product-slug]` and `/start` that simulate an enquiry about a furniture product and show a sample product image such as “Luxe 3-Seater Velvet Sofa”.
- [x] Guide customers in a friendly, conversational way rather than presenting a boring form, and collect customer name and WhatsApp number; room type, approximate dimensions and optional room photo; preferred style (Modern, Minimalist, Luxury, Classic, Scandinavian) with visual chips; colour/material preference; NGN budget range (`<200k`, `200k–500k`, `500k–1M`, `1M+`); delivery state, area and floor (ground floor/upstairs); timeline/urgency; and optional inspiration image.
- [x] If the customer skips budget, politely ask again. If they say they do not know room size, help them estimate it. Nigerian WhatsApp numbers and delivery state/area are validated before continuing.
- [x] Finish with “Here’s what I captured...” and a “Send to HomeConcept Team” button. A submitted enquiry must appear in the staff dashboard.

## 2. Staff sales dashboard and generated brief — Complete
- [x] Provide `/dashboard` as a clean, modern, responsive HomeConcept staff view, including on a phone.
- [x] Show new enquiry cards with statuses New, Brief Ready, Quoted and Closed, customer name, product, budget and time; support selecting an enquiry.
- [x] Show the selected Auto-Generated Sales Brief using the exact structure: “HOME CONCEPT SALES BRIEF”; Customer name and clickable WhatsApp `wa.me` link; Enquiry Source (WhatsApp / Instagram / Website); Product of Interest with image and name; contextual 2–3 sentence Brief Summary; Key Details Table with Space, Style, Color, Budget, Delivery and Timeline; Missing Info / Red Flags; Recommended Actions for Staff; and a collapsible Full Chat Transcript.
- [x] Generate the brief summary and recommended actions contextually from the collected answers using smart rules for the prototype. Highlight missing information, such as no room measurement. Actions help the team recommend suitable options, confirm access/lift for upstairs delivery and account for delivery fees/location where applicable.
- [x] Provide Mark as Quoted, Create WhatsApp Reply (draft a personalized message staff can copy), Copy Brief as PDF (browser print-to-PDF), and Send Quote via WhatsApp as an explicitly simulated WhatsApp action with feedback.
- [x] Prepopulate five realistic sample enquiries from Lagos, Abuja and Enugu with varied information and statuses.

## 3. Products and settings — Complete
- [x] Provide `/products` with simple CRUD for furniture products including Name, Price, Category and Image URL.
- [x] Let the enquiry experience reference a selected product and its image.

## 4. Persistence, appearance and prototype behavior — Complete
- [x] Use React and Tailwind CSS, with Local Storage persistence suitable for a working prototype. A submitted enquiry must instantly appear on the Sales Dashboard in the same browser profile/origin.
- [x] Deliver a fully responsive interface with a premium, minimalist furniture-brand look: beige, warm grey, black accents, Inter or Sora typography, whitespace and furniture imagery; include a HomeConcept logo placeholder and high-quality furniture images from Unsplash.
- [x] Ensure customer/staff prototype workflows function together and saved products/enquiries persist through page reloads. Surface Local Storage write failures instead of reporting false success, and cap optional photo uploads at 250 KB each.

## 5. Checkpoint and deployment — Complete
- [x] Save the source as a canonical Manus checkpoint and publish the static prototype so the customer enquiry and staff dashboard have working public links. Published version: `df2dbe6e77d9126ff336c131c0d31e80368111a8`.
