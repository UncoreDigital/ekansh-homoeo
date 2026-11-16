# Ekansh Homoeopathic Clinic – Digital Web Platform & Patient Consultation Portal

> **"Care That Begins With Listening."**  
> Official web platform for **Ekansh Homoeopathic Clinic**, located in Rajsamand, Rajasthan, India. Operating as an individual homeopathic medical practice, the clinic delivers personalized constitutional healthcare for local in-clinic patients and online consultations nationwide.

---

## 1. Project Overview & Deliverables

This project delivers a complete, production-ready healthcare web platform and comprehensive product documentation structured for academic and clinical review.

### Deliverable 1: Product Requirements Documentation
All product documentation is located inside the [`docs/`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs) directory in three standardized formats matching the reference PRD specification:
* **Markdown Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.md`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.md)
* **Word Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.docx`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.docx)
* **PDF Document:** [`docs/PRD_Ekansh_Homoeopathic_Clinic.pdf`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PRD_Ekansh_Homoeopathic_Clinic.pdf)
* **Practitioner Verification Checklist:** [`docs/PENDING_INFORMATION.md`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PENDING_INFORMATION.md)

### Deliverable 2: Responsive Multi-Page Website Prototype
A polished, responsive multi-page web platform built using **Astro**, **Modern CSS3 Design Tokens**, and **Accessible Vanilla JavaScript**:
1. **Home (`/`)**: Visual centerpiece featuring all 10 required sections in order.
2. **About the Doctor (`/about`)**: Physician narrative, credentials matrix, and 6-point clinical ethics pledge.
3. **Our Approach (`/approach`)**: The 4-pillar methodology, 60-minute case-taking anatomy, and remedy care rules.
4. **Services (`/services`)**: In-clinic, online tele-consultation, follow-up care, and medicine courier delivery policy.
5. **Health Journal (`/journal`)**: Editorial perspectives, lead featured essay, and category filtering.
6. **Contact Us (`/contact`)**: Rajsamand physical coordinates, operating hours, map placeholder, and inquiry form.
7. **Book a Consultation (`/book-consultation`)**: Validated patient intake form, modality toggle, date/time pickers, prototype demo alert, and instant WhatsApp deep-link generation.

---

## 2. Brand Identity & Design System

The visual identity embodies **Natural Wellness combined with Premium Editorial Design**—avoiding sterile clinic aesthetics in favor of serene, restorative earthen tones:

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

## 3. Medical Accuracy & Ethical Disclaimers

In strict adherence to the **Board of Homoeopathy**, the **Ministry of Ayush**, and the **Indian Telemedicine Practice Guidelines**:
* **Zero Fabricated Credentials:** No doctor registration numbers, conferring universities, or clinical claims have been invented. Transparent placeholders are used throughout and tracked in [`docs/PENDING_INFORMATION.md`](file:///f:/Roshni/SEM%204/Project/Tryyyyyyyy/Ekansh-Clinic-Website/docs/PENDING_INFORMATION.md).
* **No Miracle Cure Guarantees:** The website makes no promises of rapid or guaranteed cures. Treatment is articulated as individualized constitutional care requiring patient collaboration.
* **Non-Emergency Care Notice:** Clear notices across all pages instruct patients experiencing acute trauma or life-threatening emergencies to seek immediate care at the nearest hospital.
* **Frontend Demonstration Mode:** The appointment booking form explicitly clarifies that it operates as an interactive frontend prototype, generating pre-filled WhatsApp confirmation messages rather than creating unverified medical appointments.

---

## 4. Technical Architecture & Directory Structure

```
Ekansh-Clinic-Website/
├── reference/                         # Client reference documents
│   └── PRD example.doc
├── docs/                              # Project documentation & deliverables
│   ├── PRD_Ekansh_Homoeopathic_Clinic.md
│   ├── PRD_Ekansh_Homoeopathic_Clinic.docx
│   ├── PRD_Ekansh_Homoeopathic_Clinic.pdf
│   └── PENDING_INFORMATION.md
├── public/                            # Static assets
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/                    # Modular UI components
│   │   ├── Navbar.astro               # Sticky nav & mobile sliding drawer
│   │   ├── Footer.astro               # Global footer with Ayush disclaimers
│   │   ├── Button.astro               # Reusable editorial button
│   │   ├── ServiceCard.astro          # Interactive service card
│   │   ├── DoctorProfileCard.astro    # Practitioner profile & credentials matrix
│   │   ├── ApproachPillars.astro      # 4-stage constitutional clinical flow
│   │   ├── TestimonialCard.astro      # De-identified patient reflection card
│   │   ├── ConsultationForm.astro     # Validated intake form & WhatsApp intent
│   │   └── FAQAccordion.astro         # Accessible disclosure accordion
│   ├── layouts/
│   │   └── BaseLayout.astro           # HTML shell, head meta, fonts, JSON-LD
│   ├── pages/                         # File-based routes
│   │   ├── index.astro                # Homepage (10 required sections)
│   │   ├── about.astro                # About Doctor & Clinical Ethics
│   │   ├── approach.astro             # Case-Taking Process & Medicine Care
│   │   ├── services.astro             # Consultation Services & Courier Policy
│   │   ├── journal.astro              # Health Journal & Category Filter
│   │   ├── contact.astro              # Rajsamand Coordinates & Inquiry Form
│   │   └── book-consultation.astro    # Consultation Intake & WhatsApp Intent
│   └── styles/
│       └── global.css                 # CSS custom tokens, reset, typography, grid
├── astro.config.mjs                   # Astro build configuration
├── package.json                       # Scripts and project dependencies
└── README.md                          # Repository guide
```

---

## 5. Local Setup & Execution Guide

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

The development server will launch at:
```
http://localhost:4321/
```

---

## 6. Verification Checklist Before Live Deployment
1. Verify doctor's full legal name, council registration number, and degrees against state records.
2. Confirm exact Rajsamand clinic street address, landmark, and Google Maps Place ID.
3. Set primary reception phone number and WhatsApp Business number in `src/components/ConsultationForm.astro` and `src/components/Footer.astro`.
4. Review and approve consultation fee schedule and courier delivery policies with the practitioner.
5. Obtain signed practitioner approval for all educational text and patient testimonials.
