# Product Requirements Document (PRD)
## Project: Ekansh Homoeopathic Clinic – Official Digital Web Platform & Patient Consultation Portal

| Attribute | Specification |
| :--- | :--- |
| **Clinic Name** | Ekansh Homoeopathic Clinic |
| **Location** | Rajsamand, Rajasthan, India |
| **Practitioner Structure** | Solo Homeopathic Practitioner (Individual Practice) |
| **Target Domain** | `https://ekanshclinic.in` (Placeholder / Subject to Final Registration) |
| **Document Version** | 1.0.0 (Baseline Architecture & Production Prototype Release) |
| **Document Status** | Approved for Frontend Prototype & Architecture Review |
| **Lead Roles** | Senior Product Manager, Lead Solutions Architect, UI/UX Principal, Senior Frontend Engineer |
| **Technology Stack** | Astro v5 / Static Architecture, Modern CSS3 Tokens, Vanilla JavaScript (ES2022), Semantic HTML5, Schema.org JSON-LD |

---

## 1. Executive Summary & Product Vision

### 1.1 Executive Summary
Ekansh Homoeopathic Clinic is an established individual homeopathic medical practice situated in the historic district of Rajsamand, Rajasthan, India. Operating under the philosophy of *"Care That Begins With Listening"*, the clinic provides patient-centric, holistic constitutional homeopathic treatment for both chronic and recurring ailments. While maintaining deep local community roots across Rajsamand and surrounding Mewar regions, the clinic is expanding its clinical accessibility through structured, confidential online consultation channels for patients across India and overseas.

The objective of this digital platform project is to design, architect, and deploy a modern, serene, and medical-ethics-compliant web platform. The platform serves as the digital front door of the clinic, articulating its holistic philosophy, demystifying the homeopathic consultation journey, establishing uncompromised professional credibility, and providing a frictionless consultation booking and inquiry flow.

> **NOTE: Core Value Proposition & Clinical Philosophy**  
> Unlike transactional medical portals or generic clinic directories, Ekansh Homoeopathic Clinic’s digital platform balances **editorial warmth and organic serenity** with **rigorous clinical clarity**. It communicates homeopathy as an individualized, evidence-informed, and compassionate constitutional discipline. Every patient touchpoint—from the split-screen hero narrative to the multi-step consultation intake module—is engineered to inspire calm confidence, respect patient confidentiality, and prioritize thorough case-taking over rushed symptom suppression.

---

### 1.2 Target Audience & User Personas

The platform serves three distinct user cohorts, each with distinct psychological contexts, digital literacy levels, and healthcare priorities:

```
                                  +---------------------------------------+
                                  |   Ekansh Patient Demographics Pool   |
                                  +---------------------------------------+
                                                      |
                  +-----------------------------------+-----------------------------------+
                  |                                   |                                   |
                  v                                   v                                   v
   [Persona 1: Local Patient]            [Persona 2: Remote / Digital]          [Persona 3: Family Caregiver]
   Location: Rajsamand & Mewar           Location: Urban India & Overseas       Location: Regional & National
   Goal: Walk-in timings & trust         Goal: Structured online triage         Goal: Gentle care for loved ones
```

#### Persona 1: Local Rajsamand Patient (Chronic Condition Seeker)
* **Name & Archetype:** Rameshwar Sharma, 48 years old, Business Owner & Resident of Rajsamand.
* **Context & Pain Points:** Suffers from long-standing allergic rhinitis and recurring joint stiffness. Has experienced temporary relief through conventional pain relievers but desires root-cause constitutional treatment without side effects.
* **Digital Behavior:** Primed on mobile devices (smartphones running 4G/5G); values simple navigation, clear Hindi/English dual clarity, direct click-to-call, WhatsApp messaging, and landmark-guided physical clinic directions.
* **Core Requirements:** Verified physical clinic address in Rajsamand, consultation operating hours, practitioner background verification, and a straightforward way to confirm walk-in or pre-booked appointment slots.

#### Persona 2: Digital Outstation Patient (Remote & Lifestyle Seeker)
* **Name & Archetype:** Sunidhi Mehta, 32 years old, Software Engineering Lead living in Bengaluru (roots in Rajasthan).
* **Context & Pain Points:** Experiences chronic stress-induced gut sensitivity, sleep disruption, and skin flare-ups. Has limited time for physical clinic visits and seeks a dependable, empathetic doctor willing to conduct comprehensive video/audio consultations and arrange courier dispatch of remedies.
* **Digital Behavior:** High digital fluency, browses on iPhone and MacBook, reads health journals, appreciates refined editorial typography, and expects clean online scheduling with instant confirmation states.
* **Core Requirements:** Transparent online consultation workflow, digital case-taking duration guidelines (45–60 mins), secure intake form, and WhatsApp video/tele-consultation clarity.

#### Persona 3: Holistic Health Explorer & Family Caregiver
* **Name & Archetype:** Bhavna Patel, 39 years old, Teacher and Mother of two.
* **Context & Pain Points:** Seeking gentle, non-invasive therapeutic options for her 9-year-old child's recurrent respiratory allergies and skin sensitivities. Needs reassurance regarding the safety, non-toxicity, and philosophy of homeopathic remedies.
* **Digital Behavior:** Evaluates clinic ethics, checks practitioner credentials thoroughly, reads patient educational articles, and values clear explanations of *"Our Approach"* before committing.
* **Core Requirements:** Explicit constitutional case-taking breakdown, transparent FAQs addressing common myths, professional pediatric focus guidance, and medical ethics disclaimers.

---

### 1.3 Key Objectives & Success Metrics

To ensure the platform delivers measurable clinical and operational outcomes, the project is tracked across quantitative engineering, usability, and engagement benchmarks:

| Key Objective | Measurement Metric | Target Benchmark | Business / Clinical Significance |
| :--- | :--- | :--- | :--- |
| **Core Web Vitals** | Google Lighthouse Performance Score | $\ge 95 / 100$ on Mobile & Desktop | Guarantees instant load on Tier-2/3 network speeds in Rajasthan. |
| **First Contentful Paint (FCP)** | Navigation to visual rendering | $< 1.0\text{ s}$ | Reduces patient bounce rate during urgent or anxious lookups. |
| **Largest Contentful Paint (LCP)** | Hero section & typography load | $< 1.5\text{ s}$ | Editorial visual stability without jarring layout shifts. |
| **Cumulative Layout Shift (CLS)** | Visual layout movement index | $< 0.02$ | Eliminates accidental misclicks during appointment booking. |
| **Conversion UX Efficiency** | Path from landing to consultation booking | $\le 2\text{ clicks}$ from any page | Frictionless access for both local walk-ins and remote patients. |
| **Accessibility Compliance** | WCAG 2.1 AA Audit Rating | $100\%$ AA pass rate | High-contrast legibility for elderly patients; keyboard navigability. |
| **Medical Integrity & Ethics** | Zero unverified medical claims / cure guarantees | $100\%$ compliance with Ayush & Indian Telemedicine Guidelines | Preserves clinical reputation and patient trust; zero legal liability. |
| **Consultation Intake Completion** | Client-side form completion rate | $\ge 65\%$ initiated forms completed | Clear inline field validation and minimal cognitive burden. |

---

## 2. Technical Architecture & Technology Stack

The engineering architecture is built around **Astro v5**, adhering to the *Islands Architecture* and *Zero-JS by Default* paradigm. Healthcare informational websites require exceptional read performance, maximum SEO discoverability, and zero client-side JavaScript bloat, while still delivering refined micro-interactions.

```
+---------------------------------------------------------------------------------------+
|                                    Client Browser                                     |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                               Astro Static HTML Engine                                |
|   +-------------------------------------------------------------------------------+   |
|   |                        BaseLayout.astro (Global Head & Meta)                  |   |
|   |   +-----------------------------------------------------------------------+   |   |
|   |   | Design Tokens & Theme Engine (src/styles/global.css)                  |   |   |
|   |   | Playfair Display (Serif Display) + DM Sans (Humanist Body)            |   |   |
|   |   +-----------------------------------------------------------------------+   |   |
|   |   | Component Layer:                                                      |   |   |
|   |   |  ├── Navbar.astro (Sticky Header, Desktop Nav, Mobile Drawer)         |   |   |
|   |   |  ├── Hero.astro (Split Editorial Layout + High-Impact Trust Cues)     |   |   |
|   |   |  ├── ApproachGrid.astro (4-Pillar Clinical Flow Cards)                |   |   |
|   |   |  ├── ServiceCards.astro (In-Clinic, Online, Follow-up, Guidance)      |   |   |
|   |   |  ├── DoctorProfile.astro (Verified Credential & Ethics Framework)     |   |   |
|   |   |  ├── TestimonialSlider.astro (De-identified Patient Reflections)      |   |   |
|   |   |  ├── ConsultationForm.astro (Validated Multi-Step Intake Engine)     |   |   |
|   |   |  ├── ContactSection.astro (Rajsamand Clinic Coordinates & Hours)      |   |   |
|   |   |  └── Footer.astro (Legal Disclaimers, Sitemap, Ayush Notice)          |   |   |
|   +---+-----------------------------------------------------------------------+---+   |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                               Client Interaction Layer                                |
|  - Mobile Navigation Drawer Controller (Vanilla JS, inert state, focus trap)          |
|  - Consultation Booking Form State Machine (Validation, triage, WhatsApp payload)     |
|  - Interactive Clinical FAQ Disclosure System (ARIA expanded state toggle)            |
|  - Health Journal Category Filter (Dynamic DOM category view toggling)                |
+---------------------------------------------------------------------------------------+
```

### 2.1 Technology Stack Breakdown

* **Core Framework:** **Astro v5** (`astro ^5.x`): Emits zero client-side JavaScript by default, compiling all layouts and non-interactive components to pure, highly optimized HTML and CSS.
* **Styling Framework:** **Vanilla CSS with Custom Design Tokens & Utility Classes** (located in `src/styles/global.css`): Adheres strictly to the requested brand palette without bulky CSS dependencies. Bootstrap utility classes are employed surgically where grid scaffolding enhances responsive reliability.
* **Typography Engine:** **Google Fonts CDN** (preconnected with `font-display: swap`):
  * Headings & Editorial Accents: *Playfair Display* (weights: 500, 600, 700, italic 400).
  * Body & Interactive Elements: *DM Sans* (weights: 400, 500, 700).
* **Interactivity Engine:** **Modular Vanilla JavaScript (ES2022)**: Encapsulated client-side scripts attached directly to Astro components for zero external bundle overhead.
* **Vector & Asset Layer:** Custom-crafted inline SVG botanical motifs, clinical trust badges, and optimized responsive WebP imagery.
* **Structured Data:** **Schema.org JSON-LD**: Embedded entities for `MedicalClinic`, `Physician`, and `MedicalBusiness`.

---

## 3. Website Architecture & Site Navigation Flow

The platform comprises seven dedicated, content-rich pages designed to fulfill all patient information needs:

```
                                  +-------------------+
                                  |    Homepage (/)   |
                                  +-------------------+
                                            |
        +------------------+----------------+------------------+------------------+
        |                  |                |                  |                  |
        v                  v                v                  v                  v
+----------------+ +----------------+ +------------+ +-----------------+ +-------------------+
| About Doctor   | | Our Approach   | | Services   | | Health Journal  | | Book Consultation |
| (/about)       | | (/approach)    | | (/services)| | (/journal)      | | (/book)           |
+----------------+ +----------------+ +------------+ +-----------------+ +-------------------+
        |                  |                |                  |                  |
        +------------------+----------------+------------------+------------------+
                                            |
                                            v
                                  +--------------------+
                                  | Contact Us         |
                                  | (/contact)         |
                                  +--------------------+
```

### 3.1 Global Header Navigation Architecture
* **Brand Wordmark:** `EKANSH` with descriptor `HOMOEOPATHIC CLINIC` and subtle botanical emblem.
* **Primary Navigation Links:**
  1. `Home` (`/`)
  2. `About the Doctor` (`/about`)
  3. `Our Approach` (`/approach`)
  4. `Services` (`/services`)
  5. `Health Journal` (`/journal`)
  6. `Contact Us` (`/contact`)
* **Primary Action CTA:** `Book a Consultation` (`/book-consultation`) highlighted in button style.
* **Mobile Viewport Navigation:** Compact hamburger trigger opening an accessible sliding off-canvas drawer with full keyboard focus management.

---

## 4. Functional Modules & Implementation Details

### 4.1 Consultation Booking & Triage Routing Engine
The consultation intake system allows patients to request both in-clinic visits in Rajsamand and virtual tele-consultations.

```
[Patient Selects Mode: In-Clinic vs Online]
                     |
                     v
[Inputs Contact Details: Full Name, Phone (+91), Email (Opt)]
                     |
                     v
[Selects Preferred Date & Time Slot: Morning / Afternoon / Evening]
                     |
                     v
[Provides Optional Chief Health Concern (1-2 sentences)]
                     |
                     v
[Client-Side Validation & Sanitization]
      |                              |
 (Valid)                         (Invalid)
      |                              |
      v                              v
[Demonstration Success Modal]   [Inline Error Highlight]
  + Direct WhatsApp Deep-Link
    Formatted Pre-filled Message
```

#### State Machine & Validation Specifications:
1. **Name Validation:** Minimum 3 characters; alphabetic characters and spaces only.
2. **Phone Number Validation:** Indian mobile format matching `^(\+91[\-\s]?)?[6-9]\d{9}$`.
3. **Email Validation:** Standard RFC 5322 regex (optional field).
4. **Consultation Mode:** Radio/Pill toggle (`In-Clinic Visit (Rajsamand)` vs `Online Consultation (Video/Audio)`).
5. **Slot Selection:** Preferred Date picker with minimum date set to $T+1$ (same-day booking requires direct phone contact) and Preferred Time Slot (`Morning: 10:00 AM - 1:00 PM`, `Evening: 5:00 PM - 8:00 PM`).
6. **Frontend Prototype Disclaimer:** A clear, visible notice stating: *"This booking form is a frontend prototype. No medical relationship is created until confirmed by the clinic staff. To confirm an immediate slot, tap the WhatsApp confirmation button."*
7. **WhatsApp Intent Generator:** Generates a sanitized deep link:  
   `https://wa.me/[CLINIC_PHONE_PLACEHOLDER]?text=Hello%20Ekansh%20Clinic,%20I%20would%20like%20to%20request%20an%20appointment%20for%20[Patient_Name]...`

### 4.2 Interactive Clinical FAQ & Accordion System
* Accessible disclosure pattern using native `<details>` and `<summary>` elements or ARIA-backed accordion controllers (`aria-expanded="true/false"`, `aria-controls="faq-content-x"`).
* Addresses common patient concerns:
  * *"How does individual constitutional homeopathy differ from conventional medicine?"*
  * *"What should I prepare for my first 60-minute case-taking session?"*
  * *"Can I take homeopathic remedies alongside ongoing allopathic prescriptions?"*
  * *"How are medicines delivered for online consultation patients outside Rajsamand?"*

### 4.3 Editorial Health Journal & Article Architecture
* Clean editorial grid presenting evidence-informed wellness perspectives, avoiding false curative promises.
* Category filtering:
  * `Chronic Illness & Immunity`
  * `Pediatric & Maternal Care`
  * `Lifestyle, Stress & Sleep`
  * `Homeopathic Principles Explained`
* Each article card includes estimated reading time, publication date placeholder, category badge, and editorial excerpt.

---

## 5. Holistic Clinical Consultation & Triage Flow Engine

In accordance with classical homeopathic methodology and the Indian Ministry of Ayush ethical guidelines, patient care at Ekansh Homoeopathic Clinic adheres to a structured clinical workflow:

```
+---------------------------------------------------------------------------------------+
|                       Stage 1: Preliminary Intake & Triage                            |
|  - Distinguishes acute vs. chronic constitutional needs.                              |
|  - Confirms non-emergency status (Emergency cases directed to nearest tertiary care). |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                    Stage 2: In-Depth Constitutional Case-Taking                       |
|  - Duration: 45 to 60 Minutes.                                                        |
|  - Detailed exploration of physical symptoms, emotional state, thermal sensitivities, |
|    family medical history, past treatments, and lifestyle patterns.                   |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                  Stage 3: Repertorisation & Remedy Individualisation                   |
|  - Evaluation of the totality of symptoms according to homeopathic law of similars.   |
|  - Selection of single remedy in appropriate minimum dosage and potency.             |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                    Stage 4: Dispensation & Lifestyle Guidance                         |
|  - In-Clinic: Direct dispensation of high-grade medicated globules/dilutions.        |
|  - Online: Safe courier dispatch of medicated kits to patient doorstep.               |
|  - Dietetic advice, antidote precautions (raw onion/garlic/coffee guidance).         |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                   Stage 5: Structured Follow-Up Assessment                            |
|  - Scheduled at 3 to 4 week intervals (15 to 20 mins).                                |
|  - Observation of remedy response (Hering's Law of Cure evaluation).                  |
+---------------------------------------------------------------------------------------+
```

---

## 6. Page-wise Functional Requirements

Each page requirement is indexed with a traceable Requirement ID and concrete Acceptance Criteria.

### 6.1 Homepage (`/`)
* **REQ-HOM-001 (Hero Split Layout):** The homepage must feature a split-screen hero section. The left pane presents the primary heading *"A More Personal Approach to Your Healthcare Journey"*, brand tagline *"Care That Begins With Listening"*, supporting clinical value proposition, and two prominent CTAs (*"Book a Consultation"* and *"Explore Our Approach"*). The right pane displays an editorial clinic photography visual accompanied by trust highlight cards (*"Individualised Care"*, *"Rajsamand Clinic"*).
  * *Acceptance Criteria:* Renders without layout shift at 1440px and 390px; passes WCAG contrast checks.
* **REQ-HOM-002 (About Section):** Section titled *"A Clinic Built Around Personal Attention"*, highlighting the clinic's founding premise in Rajsamand and commitment to spending adequate time with every patient.
* **REQ-HOM-003 (Our Approach 4 Pillars):** Features 4 sequential pillars: *1. Understanding Your Concerns*, *2. Individual Consultation*, *3. Tailored Guidance*, *4. Dedicated Follow-up*.
* **REQ-HOM-004 (Services Showcase):** Cards for *In-Clinic Consultation*, *Online Consultation*, *Follow-up Assessment*, and *Preventive & Lifestyle Guidance*.
* **REQ-HOM-005 (Doctor Profile Card):** Professional portrait placeholder, placeholder for doctor's name, qualifications (`BHMS / MD (Hom)` placeholders), state council registration placeholder, and clinical focus areas.
* **REQ-HOM-006 (Why Choose Ekansh):** Distinct value markers: *Root-Cause Treatment*, *Safe & Non-Toxic*, *Unhurried Consultations*, *Continuous Continuity of Care*.
* **REQ-HOM-007 (Patient Reflections):** De-identified testimonial placeholders reflecting genuine patient experiences (chronic allergy relief, pediatric gentleness, thorough remote consultation).
* **REQ-HOM-008 (Forest Green CTA Banner):** Immersive forest-green banner titled *"We’re Here to Listen"*, with direct contact hooks and booking trigger.
* **REQ-HOM-009 (Clinic Coordinates & Map Placeholder):** Physical Rajsamand address placeholder, consultation hours table, interactive map placeholder, phone/WhatsApp links.
* **REQ-HOM-010 (Footer & Legal Disclaimers):** Copyright, sitemap navigation, statutory Ayush disclaimer, and non-emergency medical statement.

### 6.2 About the Doctor Page (`/about`)
* **REQ-ABT-001 (Doctor Narrative):** Detailed professional bio, educational background placeholders, clinical journey, and motivation for establishing the clinic in Rajsamand.
* **REQ-ABT-002 (Verification & Credentials Matrix):** Clearly formatted table with verified status vs pending verification indicators (Registration Number, Issuing Council, Degrees, Years of Clinical Practice).
* **REQ-ABT-003 (Clinical Ethics Pledge):** Six-point ethical commitment guaranteeing patient confidentiality, honest prognosis, zero miracle cure claims, and patient-first triage.

### 6.3 Our Approach Page (`/approach`)
* **REQ-APP-001 (Constitutional Philosophy Deep-Dive):** Clear, compassionate explanation of classical homeopathy vs. symptom suppression.
* **REQ-APP-002 (Case-Taking Anatomy):** Step-by-step breakdown of what occurs during the 60-minute initial consultation.
* **REQ-APP-003 (Dispensation & Remedy Storage Guidelines):** Patient instructions for storing remedies away from strong aromas, sunlight, and moisture.

### 6.4 Services Page (`/services`)
* **REQ-SRV-001 (Consultation Modality Breakdown):** Detailed breakdown of:
  * *In-Clinic Initial Consultation (45-60 min)*
  * *Online Tele-Consultation (Video/Audio for outstation patients)*
  * *Follow-Up Consultation (15-20 min progress review)*
  * *Acute / Seasonal Ailment Care*
* **REQ-SRV-002 (Transparent Fee & Booking Structure):** Fee placeholder cards noting what is included (consultation, repertorisation, medication guidance) with clear pending-verification tags.

### 6.5 Health Journal / Blog Page (`/journal`)
* **REQ-JRN-001 (Featured Editorial Article):** Prominently styled lead article on seasonal immunity or constitutional health.
* **REQ-JRN-002 (Categorized Article Grid):** Responsive 3-column card grid with category tags, estimated reading duration, and excerpt.
* **REQ-JRN-003 (Medical Disclaimer Header):** Clear header stating that articles are for educational wellness awareness and do not constitute personal medical prescriptions.

### 6.6 Contact Us Page (`/contact`)
* **REQ-CON-001 (Clinic Contact Card):** Complete physical address placeholder in Rajsamand, landmark cues, primary contact number, official WhatsApp link, and contact email.
* **REQ-CON-002 (Consultation Hours Table):** Structured schedule for Morning and Evening sessions (Monday through Saturday, Sunday timings/holidays marked).
* **REQ-CON-003 (Interactive Map Placeholder):** Styled map container with embedded Rajsamand geographical coordinates, directions guide, and Google Maps deep-link.
* **REQ-CON-004 (Direct Inquiry Form):** Lightweight message form with instant WhatsApp send integration.

### 6.7 Book a Consultation Page (`/book-consultation`)
* **REQ-BOK-001 (Full Intake Form):** Comprehensive intake form incorporating patient name, phone, optional email, consultation modality selection, preferred date, preferred time slot, and brief health inquiry.
* **REQ-BOK-002 (Frontend Prototype Safe Demonstration Banner):** Visible amber/green status alert informing the user that this is a demonstrator interface, with a direct WhatsApp routing fallback.
* **REQ-BOK-003 (Interactive Confirmation State):** Upon form submission, dynamic modal displays submitted data summary and one-tap WhatsApp confirmation link.

---

## 7. UI/UX Design System & Token Specifications

The visual identity embodies **Natural Wellness combined with Premium Editorial Design**. It avoids sterile hospital blues and neon greens, opting instead for organic, restorative earthen tones that convey deep clinical gravitas, empathy, and serene elegance.

### 7.1 Design Tokens Table

| Token Identifier | CSS Variable Name | Color Hex / Value | Semantic Role & Clinical Usage | Contrast Ratio on White / Ivory |
| :--- | :--- | :--- | :--- | :--- |
| **Forest Green** | `--forest-green` | `#355D48` | Primary brand authority, hero banners, primary buttons, footers. | $7.8:1$ on Ivory (WCAG AAA) |
| **Sage Green** | `--sage-green` | `#A3B18A` | Secondary accent, badges, subtle botanical accents, border highlights. | $2.4:1$ (Used for surfaces/borders) |
| **Warm Ivory** | `--warm-ivory` | `#F6F5EF` | Primary canvas background; replaces harsh clinical pure white. | Canvas baseline |
| **Soft Beige** | `--soft-beige` | `#E9E4D7` | Card surfaces, interactive container backdrops, table headers. | Background tone |
| **Muted Gold** | `--muted-gold` | `#B9A77D` | Editorial accents, decorative rules, rating stars, testimonial quotes. | $3.2:1$ (Used decoratively) |
| **Charcoal** | `--charcoal` | `#303832` | Primary typography color; softer than pure black, ultra-legible. | $11.2:1$ on Ivory (WCAG AAA) |
| **Pure White** | `--white` | `#FFFFFF` | Form inputs, floating cards, high-contrast modal backdrops. | Base light |

### 7.2 Typography Hierarchy

```
Display Headings:  Playfair Display (Serif, Editorial, Warm, Dignified)
Body & Interface:  DM Sans (Geometric Humanist, Clear, Open Counters, Highly Legible)
```

| Type Style | Font Family | Size Scale (Desktop / Mobile) | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero (H1)** | `Playfair Display` | `3.25rem (52px) / 2.25rem (36px)` | 600 SemiBold | `1.15` | `-0.02em` |
| **Section Heading (H2)** | `Playfair Display` | `2.25rem (36px) / 1.75rem (28px)` | 600 SemiBold | `1.25` | `-0.01em` |
| **Card Heading (H3)** | `Playfair Display` | `1.5rem (24px) / 1.25rem (20px)` | 600 SemiBold | `1.3` | `0` |
| **Subheading / Lead** | `DM Sans` | `1.125rem (18px) / 1.0rem (16px)` | 400 Regular | `1.6` | `0` |
| **Body Standard** | `DM Sans` | `1.0rem (16px) / 0.9375rem (15px)` | 400 Regular | `1.65` | `0` |
| **Caption & Labels** | `DM Sans` | `0.8125rem (13px)` | 500 Medium | `1.4` | `+0.05em (Uppercase)` |

### 7.3 Spacing, Borders & Elevation Tokens
* **Container Width:** Max desktop width `1240px` with `24px` gutter padding; mobile gutter `16px`.
* **Border Radii:**
  * Small (Buttons, Badges, Input fields): `6px` or `8px` (soft organic corners, never harsh square).
  * Medium (Cards, Containers): `12px` to `16px`.
  * Pill / Full (Tags, CTA buttons): `9999px`.
* **Elevation / Shadows:**
  * Subtle Card Shadow: `0 4px 20px -2px rgba(48, 56, 50, 0.05)`
  * Floating Modal Shadow: `0 12px 36px -4px rgba(48, 56, 50, 0.12)`
  * Border Stroke: `1px solid var(--soft-beige)` or `1px solid rgba(53, 93, 72, 0.12)`

---

## 8. Non-Functional Requirements, Security & Medical Compliance

### 8.1 Performance & Layout Stability (Core Web Vitals)
* **Zero Cumulative Layout Shift (CLS):** All images, logo marks, and placeholder blocks are rendered with explicit `width`, `height`, and `aspect-ratio` CSS declarations.
* **Pre-rendered Static Pages:** Zero client-side route evaluation delays; instant page delivery via static HTML generation.
* **Lightweight Asset Footprint:** Inline SVGs for botanical decorative flourishes; zero bloated third-party JavaScript libraries.

### 8.2 Accessibility & Universal Usability (WCAG 2.1 AA)
* **High-Contrast Text Guarantee:** All typography meets or exceeds WCAG 2.1 AA contrast ratios ($> 4.5:1$ for normal body text; $> 7:1$ for primary headings against Warm Ivory).
* **Keyboard Navigation:** Explicit visible focus rings (`:focus-visible`) styled in Forest Green and Muted Gold across all interactive anchors, buttons, and form inputs.
* **Reduced Motion Support:** Respects user preference via `@media (prefers-reduced-motion: reduce)`, instantly nullifying transition durations to prevent dizziness or vestibular discomfort.
* **Screen Reader Optimization:** ARIA landmark roles (`role="navigation"`, `role="main"`, `role="contentinfo"`), descriptive `aria-label` attributes on icon-only triggers, and form `<label>` associations.

### 8.3 SEO & Healthcare Structured Data (Schema.org)
* Embedded JSON-LD structured data on all pages representing:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Ekansh Homoeopathic Clinic",
    "description": "Holistic individualised constitutional homeopathic healthcare clinic in Rajsamand, Rajasthan, offering in-clinic and online patient consultations.",
    "url": "https://ekanshclinic.in",
    "medicalSpecialty": "Homeopathic",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rajsamand",
      "addressRegion": "Rajasthan",
      "addressCountry": "IN"
    },
    "slogan": "Care That Begins With Listening"
  }
  ```
* Canonical URL tags, dynamic Open Graph (`og:title`, `og:image`, `og:description`), and Twitter Card meta declarations.

### 8.4 Medical Regulatory Ethics & Telemedicine Compliance
* **Ayush & Telemedicine Practice Guidelines Compliance:** Conforms to the Board of Ethics and Indian Telemedicine Practice Guidelines. The platform explicitly clarifies:
  * Consultations are by appointment.
  * Virtual consultations require patient identity confirmation.
  * Prescriptions are issued strictly under the practitioner's licensed supervision.
* **Statutory Medical Disclaimer:** Present across all footers and journal articles:  
  *"The information provided on this website is for general educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Homoeopathic prescriptions are individualized and must be taken under the guidance of a qualified homeopathic physician. In case of emergency, please visit the nearest hospital or emergency medical centre immediately."*
* **Zero Cure Guarantees:** Absolutely no claims of "miracle cures", "100% guaranteed success", or unauthorized therapeutic claims regarding malignant or severe acute conditions.
* **Privacy & Data Security:** No patient health data is stored or transmitted without encryption. Form fields are client-side validated and demonstration-isolated. External hyperlinks include `rel="noopener noreferrer"`.

---

## 9. Assumptions, Dependencies & Constraints

To maintain complete transparency between development, clinic operations, and supervisory review, project parameters are categorized into Confirmed Requirements, Proposed Features, and Pending Information:

```
+---------------------------------------------------------------------------------------+
|                               Requirement Classification                              |
+---------------------------------------------------------------------------------------+
|  [CONFIRMED]         - Location: Rajsamand, Rajasthan, India.                         |
|                      - Practitioner: Solo Homeopathic Practitioner.                   |
|                      - Scope: In-Clinic & Online Consultation inquiries.              |
|                      - Brand Identity: "EKANSH HOMOEOPATHIC CLINIC".                  |
|                      - Tagline: "Care That Begins With Listening".                    |
|                      - Palette: Forest Green, Sage Green, Warm Ivory, Soft Beige,     |
|                        Muted Gold, Charcoal, White.                                   |
|                      - Typography: Playfair Display + DM Sans.                        |
|                      - Pages: Home, About, Approach, Services, Journal, Contact, Book.|
+---------------------------------------------------------------------------------------+
|  [PROPOSED]          - WhatsApp pre-filled booking intent payload generator.          |
|                      - Interactive Clinical FAQ accordion on Services & About pages.  |
|                      - Health Journal with category-based DOM filtering.              |
|                      - Interactive demonstration state modal for booking requests.    |
+---------------------------------------------------------------------------------------+
|  [PENDING]           - Doctor's verified Full Name and Registration Number.           |
|  (Documented in      - Official Medical Degrees (e.g. BHMS / MD / Gold Medalist).     |
|   PENDING_INFO.md)   - Exact physical street address, building name, and pin code.    |
|                      - Verified telephone number and WhatsApp business number.        |
|                      - Exact consultation operating hours and weekly off days.        |
|                      - Verified consultation fees and courier arrangements.           |
+---------------------------------------------------------------------------------------+
```

---

## 10. Developer Reference & Handover Guide

This section provides a clear, step-by-step technical handover runbook for setting up, customizing, testing, and deploying the platform.

### Step 1: Clone & Dependency Installation
Ensure Node.js (version 18+ or 20+ LTS) is installed. Navigate to the project root and install packages:
```bash
# Verify environment
node -v
npm -v

# Install dependencies
npm install
```

### Step 2: Local Development Server Execution
Launch the high-speed Astro development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser at `http://localhost:4321` to inspect the live website.

### Step 3: Project Directory Structure
The repository follows a clean, modular structure:
```
Ekansh-Clinic-Website/
├── reference/                         # Client PRD reference documents
│   └── PRD example.doc
├── docs/                              # Project documentation & PRD deliverables
│   ├── PRD_Ekansh_Homoeopathic_Clinic.md
│   ├── PRD_Ekansh_Homoeopathic_Clinic.docx
│   ├── PRD_Ekansh_Homoeopathic_Clinic.pdf
│   └── PENDING_INFORMATION.md
├── public/                            # Static assets, images, icons, favicons
│   ├── favicon.svg
│   ├── og-image.jpg
│   └── images/                        # Editorial clinical imagery placeholders
├── src/
│   ├── components/                    # Reusable Astro UI components
│   │   ├── Navbar.astro               # Sticky navigation with mobile drawer
│   │   ├── Footer.astro               # Global footer with legal & Ayush disclaimers
│   │   ├── Button.astro               # Editorial pill button system
│   │   ├── ServiceCard.astro          # Interactive service preview card
│   │   ├── DoctorProfileCard.astro    # Practitioner profile with credential tags
│   │   ├── ApproachPillars.astro      # 4-stage clinical consultation flow
│   │   ├── TestimonialCard.astro      # Patient reflection card
│   │   └── ConsultationForm.astro     # Validated booking form state machine
│   ├── layouts/
│   │   └── BaseLayout.astro           # HTML shell, head meta, fonts, theme tokens
│   ├── pages/                         # Route pages (Astro file-based routing)
│   │   ├── index.astro                # Visual centerpiece homepage (10 sections)
│   │   ├── about.astro                # About Doctor, background & clinical ethics
│   │   ├── approach.astro             # Consultation philosophy & case-taking guide
│   │   ├── services.astro             # Consultation options & consultation fees
│   │   ├── journal.astro              # Health journal & wellness perspectives
│   │   ├── contact.astro              # Rajsamand location, map, hours & inquiry
│   │   └── book-consultation.astro    # Consultation intake form & WhatsApp intent
│   └── styles/
│       └── global.css                 # CSS custom tokens, reset, typography, utilities
├── astro.config.mjs                   # Astro build configuration
├── package.json                       # Scripts and project dependencies
└── README.md                          # Repository overview and quickstart guide
```

### Step 4: Connecting the Consultation Form to a Live Backend
The consultation form in `src/components/ConsultationForm.astro` is currently configured as a **frontend demonstration** that generates pre-filled WhatsApp consultation intents. To connect it to a production email or database backend:
1. **Option A (Serverless Form Backend):** Update the `<form>` action attribute to your Formspree or Web3Forms endpoint:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
2. **Option B (EmailJS / Resend):** Replace the demonstration submit handler in `ConsultationForm.astro` with an API dispatch call to your backend email service.
3. **Option C (Direct WhatsApp Business Integration):** Update the WhatsApp phone placeholder variable in `src/components/ConsultationForm.astro` with the practitioner's verified 10-digit number.

### Step 5: Updating Doctor Credentials & Clinic Information
When authentic details are confirmed by the practitioner, update the placeholders in:
* `src/pages/about.astro` & `src/components/DoctorProfileCard.astro` – Doctor name, degree, registration number.
* `src/pages/contact.astro` & `src/components/Footer.astro` – Clinic address, phone numbers, consultation hours.

### Step 6: Production Build & Deployment
Execute the static production build to generate an optimized, zero-dependency distribution bundle:
```bash
npm run build
```
The compiled static website will be output to the `dist/` directory, ready for immediate, high-performance hosting on Netlify, Vercel, Cloudflare Pages, or traditional Apache/Nginx web servers.

---
*End of Document. Ekansh Homoeopathic Clinic – Product Requirements Document v1.0.0.*
