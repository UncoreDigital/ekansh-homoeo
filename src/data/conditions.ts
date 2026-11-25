export interface ConditionItem {
  id: string;
  name: string;
  letter: string;
  category: string;
  summary: string;
  triggers?: string;
  approach: string;
}

export const conditionsDataset: ConditionItem[] = [
  // A
  {
    id: "acne",
    name: "Acne",
    letter: "A",
    category: "Skin Conditions",
    summary: "Inflammatory facial and body eruptions, blackheads, and hormonal flare-ups treated without drying topical chemicals.",
    triggers: "Dietary factors, emotional stress, and endocrine cycles.",
    approach: "Constitutional remedies aim to balance sebaceous gland activity and support internal systemic harmony."
  },
  {
    id: "allergic-rhinitis",
    name: "Allergic Rhinitis",
    letter: "A",
    category: "Respiratory Health",
    summary: "Recurrent morning sneezing bouts, watery nasal discharge, itchy palate, and airborne pollen or dust sensitivity.",
    triggers: "Sudden temperature drops, seasonal transitions, dust mites, and drafty air conditioning.",
    approach: "Focuses on reducing hyper-reactivity of the respiratory mucous membranes through individualized remedies."
  },
  {
    id: "alopecia-areata",
    name: "Alopecia Areata",
    letter: "A",
    category: "Hair & Scalp",
    summary: "Coin-shaped bald patches on the scalp or beard, and diffuse thinning triggered by stress or metabolic exhaustion.",
    triggers: "Acute psychological stress, nutritional deficits, or immune imbalance.",
    approach: "Aims to revitalize dormant follicles by addressing deep-seated constitutional susceptibility."
  },
  {
    id: "anxiety-stress",
    name: "Anxiety & Restlessness",
    letter: "A",
    category: "Stress & Sleep",
    summary: "Anticipatory nervousness, racing thoughts, sleep initiation difficulty, and stress-related somatic tension.",
    triggers: "Prolonged mental overwork, unresolved emotional worry, and irregular sleep routines.",
    approach: "Gentle individualized micro-doses support neuro-vegetative equilibrium without sedation or habit formation."
  },
  {
    id: "asthma",
    name: "Asthma",
    letter: "A",
    category: "Respiratory Health",
    summary: "Bronchial sensitivity, nocturnal wheezing, dry cough after light exertion, and chest tightness.",
    triggers: "Cold damp air, physical exertion, airborne irritants, and seasonal weather changes.",
    approach: "Evaluates individual modality triggers to ease bronchial reactivity and support natural lung resilience."
  },

  // B
  {
    id: "bronchitis",
    name: "Bronchitis",
    letter: "B",
    category: "Respiratory Health",
    summary: "Persistent chesty cough, bronchial congestion, and recurrent respiratory tract infections.",
    triggers: "Cold weather exposure, viral aftermath, and atmospheric pollution.",
    approach: "Strengthens upper and lower respiratory defenses to prevent frequent seasonal relapses."
  },
  {
    id: "back-pain",
    name: "Back Pain & Lumbar Strain",
    letter: "B",
    category: "Joint & Muscular",
    summary: "Lower back ache, postural muscle fatigue, sacroiliac discomfort, and chronic lumbar stiffness.",
    triggers: "Prolonged desk sitting, improper lifting, sudden movements, and cold damp drafts.",
    approach: "Targets muscular spasm, eases localized tension, and promotes musculoskeletal posture recovery."
  },

  // C
  {
    id: "cervical-spondylosis",
    name: "Cervical Spondylosis",
    letter: "C",
    category: "Joint & Muscular",
    summary: "Neck stiffness, shoulder blade discomfort, occipital heaviness, and numbness radiating along the arm.",
    triggers: "Prolonged screen posture, forward head tilt, cold exposure, and degenerative wear.",
    approach: "Constitutional remedies aim to alleviate neural irritability and cervical muscle contracture."
  },
  {
    id: "chronic-constipation",
    name: "Chronic Constipation",
    letter: "C",
    category: "Digestive Concerns",
    summary: "Infrequent or incomplete bowel movements, sluggish intestinal motility, and abdominal heaviness.",
    triggers: "Low dietary fiber, sedentary habits, travel stress, and prolonged suppression of natural urges.",
    approach: "Evaluates digestive habits, hydration, and symptom patterns to support natural bowel regularity."
  },
  {
    id: "childhood-coughs",
    name: "Childhood Recurrent Coughs",
    letter: "C",
    category: "Pediatric Care",
    summary: "Recurrent nocturnal coughing fits, post-viral sensitivity, and seasonal chest catch in young children.",
    triggers: "Daycare exposure, cold drinks, seasonal transition, and low baseline immunity.",
    approach: "Gentle sweet globules tailored to the child's physical temperament to build natural resistance."
  },

  // D
  {
    id: "dandruff",
    name: "Dandruff & Scalp Dermatitis",
    letter: "D",
    category: "Hair & Scalp",
    summary: "Persistent dry or greasy white flakes, scalp itching, and localized follicular irritation.",
    triggers: "Seborrheic imbalance, harsh chemical shampoos, climate dryness, and stress.",
    approach: "Evaluates scalp sensitivity and overall constitutional factors during consultation."
  },
  {
    id: "digestive-concerns",
    name: "Digestive Concerns",
    letter: "D",
    category: "Digestive Concerns",
    summary: "Bloating, gas accumulation, post-meal sluggishness, sour burping, and irregular assimilation.",
    triggers: "Irregular eating schedules, greasy foods, stress during meals, and weak digestive fire.",
    approach: "Constitutional case evaluation restores harmonious gastric motility and enzymatic vitality."
  },
  {
    id: "dysmenorrhea",
    name: "Dysmenorrhea (Menstrual Cramps)",
    letter: "D",
    category: "Women's Health",
    summary: "Sharp spasmodic or dragging pelvic pains prior to or during the menstrual period, with lower back ache.",
    triggers: "Hormonal prostaglandin fluctuation, stress, fatigue, and cold exposure.",
    approach: "Gentle antispasmodic constitutional remedies promote normal uterine muscular relaxation."
  },

  // E
  {
    id: "eczema",
    name: "Eczema",
    letter: "E",
    category: "Skin Conditions",
    summary: "Dry, red, itchy skin patches on flexures, hands, or neck with scaling or occasional watery oozing.",
    triggers: "Synthetic fabrics, dry air, harsh soaps, emotional tension, and specific food triggers.",
    approach: "Considers individual skin sensitivity, personal triggers, and lifestyle factors in selecting remedies."
  },

  // F
  {
    id: "fatty-liver",
    name: "Fatty Liver & Sluggish Metabolism",
    letter: "F",
    category: "Digestive Concerns",
    summary: "Right hypochondriac fullness, chronic tiredness after meals, and metabolic sluggishness.",
    triggers: "Refined sugar intake, sedentary routine, and metabolic stress.",
    approach: "Constitutional liver drainage remedies support hepatic micro-circulation and lipid metabolism."
  },
  {
    id: "fibromyalgia",
    name: "Fibromyalgia & Muscular Ache",
    letter: "F",
    category: "Joint & Muscular",
    summary: "Widespread tender points across muscles, non-restorative sleep, and chronic bodily fatigue.",
    triggers: "Weather changes, physical overexertion, mental burnout, and sleep disruption.",
    approach: "Holistic evaluation of physical and emotional totalities to soothe myofascial hyper-sensitivity."
  },

  // G
  {
    id: "gastritis",
    name: "Gastritis",
    letter: "G",
    category: "Digestive Concerns",
    summary: "Burning in the upper stomach, acid regurgitation, nausea after eating, and epigastric tenderness.",
    triggers: "Spicy foods, prolonged fasting, NSAID usage, and psychological anxiety.",
    approach: "Constitutional soothing remedies help normalize gastric mucosal pH and ease mucosal inflammation."
  },
  {
    id: "gerd",
    name: "GERD (Acid Reflux)",
    letter: "G",
    category: "Digestive Concerns",
    summary: "Substernal heartburn, sour fluid regurgitation into the throat, and difficulty lying down after meals.",
    triggers: "Late dinners, high-fat meals, caffeine, tight clothing, and reclining too soon after eating.",
    approach: "Strengthens lower esophageal sphincter function and harmonizes upper gastrointestinal motility."
  },

  // H
  {
    id: "hair-fall",
    name: "Hair Fall",
    letter: "H",
    category: "Hair & Scalp",
    summary: "Excessive shedding while washing or brushing, widening part-lines, and premature root weakness.",
    triggers: "Post-illness recovery, iron deficiency, thyroid fluctuations, hard water, and stress.",
    approach: "Focuses on constitutional nourishment of the hair papilla and balancing systemic vitality."
  },
  {
    id: "headaches-tension",
    name: "Headaches (Tension)",
    letter: "H",
    category: "Stress & Sleep",
    summary: "Band-like tightness across the forehead and temples, neck stiffness, and heaviness behind the eyes.",
    triggers: "Screen eye fatigue, missed meals, postural strain, and prolonged cognitive worry.",
    approach: "Eases pericranial myofascial tension and promotes calm nervous system balance."
  },
  {
    id: "hormonal-imbalance",
    name: "Hormonal Imbalance",
    letter: "H",
    category: "Women's Health",
    summary: "Unpredictable menstrual timing, premenstrual mood shifts, fluid retention, and weight resistance.",
    triggers: "Circadian rhythm disruptions, high cortisol, nutritional imbalances, and thyroid shifts.",
    approach: "Constitutional remedies work along the neuro-endocrine axis to support balanced hormonal health."
  },

  // I
  {
    id: "insomnia",
    name: "Insomnia & Sleep Disturbance",
    letter: "I",
    category: "Stress & Sleep",
    summary: "Inability to fall asleep despite fatigue, frequent midnight awakenings, and unrefreshing rest.",
    triggers: "Blue-light screen use late at night, racing thoughts, caffeinated drinks, and irregular hours.",
    approach: "Calms mental hyperactivity and supports restful sleep routines through individualized care."
  },
  {
    id: "ibs",
    name: "Irritable Bowel Syndrome (IBS)",
    letter: "I",
    category: "Digestive Concerns",
    summary: "Alternating episodes of diarrhea and constipation, cramping relieved after evacuation, and gut anxiety.",
    triggers: "Stressful life events, travel, fermentable foods, and irregular meal timing.",
    approach: "Calms the gut-brain axis and stabilizes visceral hypersensitivity individualized to each patient."
  },

  // J
  {
    id: "joint-pain",
    name: "Joint Pain",
    letter: "J",
    category: "Joint & Muscular",
    summary: "Morning stiffness, knee crepitus, aching fingers or ankles, and discomfort on starting to move.",
    triggers: "Damp weather, barometric drops, cold drafts, and prolonged standing or sitting.",
    approach: "Constitutional remedies ease synovial friction, calm inflammation, and preserve joint flexibility."
  },

  // K
  {
    id: "knee-osteoarthritis",
    name: "Knee Osteoarthritis",
    letter: "K",
    category: "Joint & Muscular",
    summary: "Knee pain when climbing stairs or squatting, joint crunching, and stiffness after rest.",
    triggers: "Excess mechanical load, cold winter weather, and wear on articular cartilage.",
    approach: "Supports synovial lubrication, eases periarticular muscle spasm, and slows degenerative discomfort."
  },

  // L
  {
    id: "low-immunity-children",
    name: "Low Immunity in Children",
    letter: "L",
    category: "Pediatric Care",
    summary: "Recurrent colds every month, slow post-viral recovery, low appetite, and missing school frequently.",
    triggers: "Seasonal transitions, classroom exposure, and immature immune conditioning.",
    approach: "Deep constitutional prescribing builds intrinsic immune resilience and vitality in growing children."
  },

  // M
  {
    id: "migraine",
    name: "Migraine",
    letter: "M",
    category: "Stress & Sleep",
    summary: "Unilateral throbbing head pain, sensitivity to bright light and sharp sounds, with nausea or visual aura.",
    triggers: "Bright sunlight, skipping meals, hormonal fluctuations, lack of sleep, and loud environments.",
    approach: "Targeted constitutional treatment reduces the frequency, severity, and vascular intensity of attacks."
  },
  {
    id: "menstrual-irregularities",
    name: "Menstrual Irregularities",
    letter: "M",
    category: "Women's Health",
    summary: "Cycles arriving too early, delayed by months, unusually scanty flow, or prolonged heavy spotting.",
    triggers: "Endocrine shifts, rapid weight changes, travel, emotional stress, and PCOD tendencies.",
    approach: "Regulates ovarian-pituitary communication to encourage regular, natural ovulatory cycles."
  },

  // N
  {
    id: "nasal-polyps",
    name: "Nasal Polyps & Congestion",
    letter: "N",
    category: "Respiratory Health",
    summary: "Persistent nasal blockage, reduced sense of smell, mouth breathing, and chronic snoring.",
    triggers: "Chronic untreated allergic rhinitis, fungal sensitivity, and mucosal inflammation.",
    approach: "Aims to shrink mucosal edema and arrest recurrent polypoid growth through constitutional medicine."
  },

  // O
  {
    id: "osteoarthritis",
    name: "Osteoarthritis",
    letter: "O",
    category: "Joint & Muscular",
    summary: "Degenerative joint ache affecting knees, hips, or spine with stiffness worse after periods of rest.",
    triggers: "Cold damp seasons, high-impact stress, and age-related cartilage thinning.",
    approach: "Promotes comfortable joint mobility, eases localized tenderness, and aids functional longevity."
  },

  // P
  {
    id: "pcod-pcos",
    name: "PCOD / PCOS",
    letter: "P",
    category: "Women's Health",
    summary: "Polycystic ovarian morphology, delayed cycles, mild hirsutism, cystic acne, and metabolic hurdles.",
    triggers: "Insulin resistance, sedentary lifestyle, chronic emotional stress, and circadian disruption.",
    approach: "Constitutional remedies balance ovarian hormones and encourage natural follicle maturation."
  },
  {
    id: "psoriasis",
    name: "Psoriasis",
    letter: "P",
    category: "Skin Conditions",
    summary: "Thick, silvery-scaled plaques on elbows, knees, scalp, or lower back with persistent dry itch.",
    triggers: "Dry cold winter air, skin injury (Koebner's phenomenon), bacterial infections, and mental strain.",
    approach: "Constitutional deep-acting remedies regulate rapid epidermal turnover from within."
  },
  {
    id: "pediatric-tonsillitis",
    name: "Pediatric Tonsillitis",
    letter: "P",
    category: "Pediatric Care",
    summary: "Enlarged inflamed throat tonsils, painful swallowing, snoring, and recurrent high fever bouts.",
    triggers: "Cold drinks, ice creams, seasonal viruses, and throat sensitivity.",
    approach: "Reduces chronic hypertrophy of lymphatic glandular tissue and reduces frequency of acute throat episodes."
  },

  // Q
  {
    id: "sleep-quality",
    name: "Quality of Sleep & Night Waking",
    letter: "Q",
    category: "Stress & Sleep",
    summary: "Fragmented sleep, frequent night-time awakenings, unrefreshing sleep, and morning mental fog.",
    triggers: "Nervous exhaustion, irregular bedtime habits, digestive heaviness, and cognitive overstimulation.",
    approach: "Individualized constitutional care restores natural circadian rhythms and nervous calm."
  },

  // R
  {
    id: "respiratory-allergies",
    name: "Respiratory Allergies",
    letter: "R",
    category: "Respiratory Health",
    summary: "Hyper-reactive airways, paroxysmal coughing fits when exposed to dust or paint fumes, and throat tickle.",
    triggers: "Pollen seasons, pet dander, household dust mites, and industrial aerosols.",
    approach: "Desensitizes the immune response to common everyday environmental triggers."
  },

  // S
  {
    id: "sciatica",
    name: "Sciatica & Nerve Compression",
    letter: "S",
    category: "Joint & Muscular",
    summary: "Shooting neural pain radiating from the lower back through the buttock down the back of the leg to the foot.",
    triggers: "Prolonged sitting, bending forward, cold weather, and lumbar disc strain.",
    approach: "Constitutional remedies help relieve sciatic nerve root irritation and alleviate muscular guarding."
  },
  {
    id: "sinusitis",
    name: "Sinusitis (Chronic)",
    letter: "S",
    category: "Respiratory Health",
    summary: "Facial heaviness over the forehead and cheekbones, post-nasal drip, morning headache, and blocked nasal passages.",
    triggers: "Cold drafts, humidity drops, untreated colds, and seasonal allergen spikes.",
    approach: "Assists natural sinus drainage, soothes inflamed mucosal linings, and builds resistance to head colds."
  },
  {
    id: "skin-allergies-urticaria",
    name: "Skin Allergies & Urticaria",
    letter: "S",
    category: "Skin Conditions",
    summary: "Sudden raised, red, itchy wheals (hives) that shift locations rapidly across the body with stinging sensations.",
    triggers: "Certain food preservatives, synthetic fabrics, sudden warmth or cold, and emotional excitement.",
    approach: "Normalizes mast cell degranulation and calms cutaneous vascular reactivity constitutionally."
  },

  // T
  {
    id: "tonsillitis",
    name: "Tonsillitis",
    letter: "T",
    category: "Respiratory Health",
    summary: "Throat inflammation, difficulty swallowing solid foods, tender neck glands, and voice hoarseness.",
    triggers: "Viral exposures, chilled beverages, and sudden weather fluctuations.",
    approach: "Provides gentle constitutional care tailored to throat sensitivity and recurring symptom patterns."
  },

  // U
  {
    id: "urticaria",
    name: "Urticaria (Hives)",
    letter: "U",
    category: "Skin Conditions",
    summary: "Transient itchy cutaneous wheals that flare up rapidly, often accompanied by heat or prickling sensation.",
    triggers: "Temperature extremes, friction, stress, contact allergens, or food sensitivities.",
    approach: "Addresses underlying histamine sensitivity and constitutional hyper-reactivity."
  },

  // V
  {
    id: "vertigo",
    name: "Vertigo & Vestibular Imbalance",
    letter: "V",
    category: "Stress & Sleep",
    summary: "Sensation of spinning or swaying, unsteadiness when turning the head quickly, and accompanying mild nausea.",
    triggers: "Inner ear fluid shifts, neck stiffness, rapid postural changes, and fatigue.",
    approach: "Stabilizes inner ear labyrinthine and cervical neuro-reflexes with constitutional prescribing."
  },

  // W
  {
    id: "womens-menopausal-care",
    name: "Women's Menopausal Health",
    letter: "W",
    category: "Women's Health",
    summary: "Hot flashes, night sweats, mood fluctuations, sleep fragmentation, and energy changes during perimenopause.",
    triggers: "Fluctuating estrogen levels, stress, hot beverages, and physical fatigue.",
    approach: "Constitutional balancing remedies offer gentle symptomatic relief and smooth hormonal transition."
  },

  // X
  {
    id: "xerosis-cutis",
    name: "Xerosis Cutis (Chronic Dry Skin)",
    letter: "X",
    category: "Skin Conditions",
    summary: "Severe dry, rough, chapped skin with scaling, tight sensations after washing, and winter aggravation.",
    triggers: "Low environmental humidity, hot water baths, aging lipid barrier, and dehydration.",
    approach: "Restores cutaneous moisture retention and lipid barrier vitality through constitutional constitutional remedies."
  },

  // Y
  {
    id: "yeast-digestive-sensitivity",
    name: "Yeast Sensitivity & Gut Dysbiosis",
    letter: "Y",
    category: "Digestive Concerns",
    summary: "Recurrent gut fermentation, bloating after yeasted foods, sugar cravings, and bowel irregularity.",
    triggers: "Antibiotic history, refined carbohydrates, compromised gut flora, and digestive sluggishness.",
    approach: "Strengthens gut mucosal ecology and natural digestive terrain constitutionally."
  },

  // Z
  {
    id: "zona-neuralgia",
    name: "Zona & Post-Viral Nerve Ache",
    letter: "Z",
    category: "Neuro-Wellness",
    summary: "Burning, stinging, or hyper-sensitive neural discomfort following acute viral flare-ups.",
    triggers: "Nervous exhaustion, immune dips, cold air exposure, and emotional stress.",
    approach: "Soothes irritated nerve pathways and supports cellular vitality with individualized dilutions."
  }
];

// Helper to get all letters with condition counts
export const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const availableLetters = Array.from(
  new Set(conditionsDataset.map((c) => c.letter.toUpperCase()))
).sort();
