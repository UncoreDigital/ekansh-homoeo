# Ekansh Homoeopathic Clinic – Digital Web Platform & Patient Consultation Portal

> **"Care That Begins With Listening."**  
> Official web platform for **Ekansh Homoeopathic Clinic**, located in Rajsamand, Rajasthan, India. Operating as an individual homeopathic medical practice, the clinic delivers personalized constitutional healthcare for local in-clinic patients and online consultations nationwide.

---

## 1. Project Overview & Deliverables

### Deliverable 1: Product Requirements Documentation
All product documentation is located inside the [`docs/`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs) directory in three standardized formats matching the reference PRD specification:
* **Markdown Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.md`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.md)
* **Word Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.docx`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.docx)
* **PDF Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.pdf`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.pdf)
* **Practitioner Verification Checklist:** [`docs/PENDING_INFORMATION.md`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PENDING_INFORMATION.md)

### Deliverable 2: Responsive Multi-Page Website Prototype (Iteration 2 Refactored)
A streamlined, responsive multi-page web platform built using **Astro v5**, **Modern CSS3 Design Tokens**, and **Accessible Vanilla JavaScript**:
1. **Home (`/`)**: Visual centerpiece featuring all 10 required sections in order, streamlined with concise copy, a new conditions-treated icon grid, and zero empty placeholders.
2. **About the Doctor (`/about`)**: Physician profile with the official doctor illustration, credentials summary (B.H.M.S.), and a 6-point clinical ethics code.
3. **Our Approach (`/approach`)**: The 4-pillar methodology, 60-minute intake stages, and practical medicine care rules.
4. **Services (`/services`)**: In-clinic, online tele-consultation, follow-up care, and nationwide courier delivery timelines.
5. **Health Journal (`/journal`)**: Editorial perspectives, lead featured essay, and category filtering.
6. **Contact Us (`/contact`)**: Rajsamand physical coordinates, operating hours, stylized vector route map (`clinic-map.svg`), and fast inquiry form.
7. **Book a Consultation (`/book-consultation`)**: Validated patient intake form, modality toggle, date/time pickers, prototype demo alert, and instant WhatsApp deep-link generation.

---

## 2. Iteration 2 Enhancements & Refactoring

1. **Official Clinic Logo Integration:**
   - Located the new logo provided in `reference/logo.png`.
   - Placed in `public/images/logo.png` and updated across the sticky Navbar (desktop and mobile drawer) and Footer.
   - Sized responsively (54px height on desktop, 44px on mobile) with proper aspect ratios so navigation and grid layouts never break.
2. **Concise, Punchy UX Copywriting:**
   - Stripped away verbose, academic paragraphs in favor of scannable sentences, icon lists, and quick-read bullet points.
   - Kept the vital clinical answers front-and-center: who the doctor is, conditions treated, clinic timings, and how to book an appointment.
   - Reduced cognitive load: visitors can understand the clinic's offerings and schedule an appointment in under 30 seconds.
3. **Professional Graphic Imagery (Zero Empty Placeholders):**
   - Replaced all empty dashed placeholder frames with tailored, high-fidelity SVGs in the clinic's brand palette (`#355D48`, `#A3B18A`, `#B9A77D`, `#F6F5EF`):
     - `public/images/hero-sanctuary.svg` – Serene botanical clinic sanctuary illustration for the hero section.
     - `public/images/doctor-portrait.svg` – Dignified physician illustration with white clinical coat, stethoscope, and credentials badge.
     - `public/images/clinic-map.svg` – Stylized vector map showing Rajsamand Lake, NH 58, and the clinic location pin.
4. **Streamlined Navigation & Conversion Focus:**
   - The "Book Consultation" CTA is highlighted as the most prominent element across the sticky header, hero section, service cards, and mobile drawer.
   - Health Journal prominence on the homepage has been minimized to keep the visitor focused on booking, timings, and location.

---

## 3. Brand Identity & Design System

The visual identity embodies **Natural Wellness combined with Premium Editorial Design**:

| Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Forest Green** | `#355D48` | Primary brand authority, buttons, footers, dark cards |
| **Sage Green** | `#A3B18A` | Secondary accent, badges, subtle botanical highlights |
| **Warm Ivory** | `#F6F5EF` | Primary canvas background |
| **Soft Beige** | `#E9E4D7` | Card surfaces, container backdrops, dividers |
| **Muted Gold** | `#B9A77D` | Editorial accents, quotation marks, decorative rules |
| **Charcoal** | `#303832` | High-contrast, readable body typography |
| **Pure White** | `#FFFFFF` | Form inputs, floating cards, high-contrast modal backdrops |

### Typography
* **Headings & Display:** `Playfair Display` (Serif) – Warm, dignified, editorial.
* **Body & UI Elements:** `DM Sans` (Humanist Sans-Serif) – Open, highly legible, accessible.

---

## 4. Local Setup & Execution Guide

### Prerequisites
* **Node.js:** v18.17.1+ or v20.x LTS
* **NPM:** v9.6.5+

### Installation & Run Commands
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build optimized static distribution bundle
npm run build

# 4. Preview compiled production build
npm run preview
```

The preview server will launch at:
```
http://localhost:4321/
```
