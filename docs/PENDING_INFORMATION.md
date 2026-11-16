# Ekansh Homoeopathic Clinic – Pending Information & Practitioner Verification Checklist

This document tracks all placeholder fields across the Ekansh Homoeopathic Clinic website and PRD that require authentic clinical verification prior to public domain deployment.

In strict compliance with medical ethics, Ayush guidelines, and consumer protection standards, **no qualifications, registration numbers, contact details, clinic timings, fees, patient testimonials, or medical claims have been fabricated**.

---

## 1. Practitioner & Clinical Credentials Checklist

| Item ID | Information Category | Current Website Placeholder | Status | Verification Required From Practitioner |
| :--- | :--- | :--- | :--- | :--- |
| **PINF-001** | **Practitioner Full Name** | `Dr. [Doctor Name Placeholder], BHMS` | Pending | Full legal name as registered with the State Homoeopathic Medical Council or Central Council of Homoeopathy (CCH / NCH). |
| **PINF-002** | **Medical Qualifications** | `B.H.M.S., [MD / Post-Graduate Certification Placeholder]` | Pending | Degrees earned, conferring university/institution, and year of graduation. |
| **PINF-003** | **Medical Registration Number** | `Reg. No. [Pending Council Verification]` | Pending | Official Council Registration Number and State Homoeopathic Council Name (e.g., Rajasthan Board of Homoeopathic Medicine). |
| **PINF-004** | **Years of Clinical Practice** | `Over [X] Years of Compassionate Clinical Care` | Pending | Year practice commenced and cumulative clinical experience. |
| **PINF-005** | **Clinical Focus Areas** | `Chronic Allergies, Dermatological Wellness, Lifestyle Disorders, Pediatric Care` | Pending | Specific clinical specialties and areas of established expertise. |
| **PINF-006** | **Practitioner Photography** | High-resolution editorial portrait placeholder | Pending | High-resolution, professional portrait photograph of the practitioner in formal clinical/professional attire. |

---

## 2. Clinic Physical Coordinates & Logistics

| Item ID | Information Category | Current Website Placeholder | Status | Verification Required From Practitioner |
| :--- | :--- | :--- | :--- | :--- |
| **PINF-007** | **Physical Clinic Address** | `Near [Landmark Placeholder], Rajsamand, Rajasthan - 313324, India` | Pending | Exact shop/plot/building number, street name, nearest recognizable landmark, and postal PIN code in Rajsamand. |
| **PINF-008** | **Official Contact Phone** | `+91 [Clinic Phone Placeholder]` | Pending | Primary mobile or landline telephone number for patient inquiries. |
| **PINF-009** | **Official WhatsApp Business** | `+91 [WhatsApp Number Placeholder]` | Pending | Dedicated WhatsApp Business phone number for automated appointment routing and remote consultations. |
| **PINF-010** | **Clinic Consultation Hours** | `Mon - Sat: Morning 10:00 AM - 1:00 PM, Evening 5:00 PM - 8:00 PM; Sunday: By Prior Appointment` | Pending | Exact operational schedule, daily patient consultation timings, and weekly off days. |
| **PINF-011** | **Google Maps Geolocation** | `Rajsamand Central Coordinates Placeholder` | Pending | Google Maps Place ID or exact Google Business Profile location URL for one-tap patient GPS navigation. |

---

## 3. Financial & Consultation Policy Verification

| Item ID | Information Category | Current Website Placeholder | Status | Verification Required From Practitioner |
| :--- | :--- | :--- | :--- | :--- |
| **PINF-012** | **Initial Consultation Fee** | `₹ [Fee Placeholder] (Includes in-depth constitutional evaluation)` | Pending | Standard fee for first detailed constitutional case-taking session (in-clinic and online). |
| **PINF-013** | **Follow-up Consultation Fee**| `₹ [Fee Placeholder]` | Pending | Standard fee for follow-up review sessions. |
| **PINF-014** | **Remedy Dispensation / Courier** | `Standard postal courier dispatch across India` | Pending | Policy regarding whether remedies are included in the fee or billed separately, courier charges, and domestic delivery partners. |
| **PINF-015** | **Emergency Medical Policy** | Standard emergency referral notice to nearest hospital | Confirmed | Affirmation of non-emergency protocol routing for acute critical events. |

---

## 4. Patient Testimonials & Clinical Experiences

| Item ID | Information Category | Current Website Placeholder | Status | Verification Required From Practitioner |
| :--- | :--- | :--- | :--- | :--- |
| **PINF-016** | **Patient Reviews & Reflections** | De-identified clinical case archetypes (e.g., `Mr. R. Sharma, Rajsamand`) | Pending | Patient consent-backed, de-identified feedback or real testimonials approved in writing by the patients and the practitioner. |

---

## 5. Practitioner Sign-Off & Verification Process

Before deploying the website to a live domain:
1. Print or transmit this document along with `docs/PRD_Ekansh_Homoeopathic_Clinic.pdf` to the practitioner.
2. Collect verified inputs for items **PINF-001 through PINF-016**.
3. Update the corresponding configuration constants in `src/pages/about.astro`, `src/pages/contact.astro`, `src/components/DoctorProfileCard.astro`, and `src/components/ConsultationForm.astro`.
4. Secure the practitioner's written sign-off confirming that all clinical statements comply with the Board of Homoeopathy and Ayush advertising regulations.
