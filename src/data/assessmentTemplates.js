export const assessmentTemplates = [
  {
    id: 'fall-risk',
    name: 'Morse Fall Scale',
    category: 'Safety',
    questions: [
      {
        id: 'mfs-1',
        text: 'History of falling (immediate or within past 3 months)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 25 },
        ],
      },
      {
        id: 'mfs-2',
        text: 'Secondary diagnosis (2 or more medical diagnoses)',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 15 },
        ],
      },
      {
        id: 'mfs-3',
        text: 'Ambulatory aid',
        type: 'select',
        options: [
          { label: 'None / Bed rest / Nurse assist', value: 0 },
          { label: 'Crutches / Cane / Walker', value: 15 },
          { label: 'Furniture', value: 30 },
        ],
      },
      {
        id: 'mfs-4',
        text: 'IV / Heparin lock',
        type: 'select',
        options: [
          { label: 'No', value: 0 },
          { label: 'Yes', value: 20 },
        ],
      },
      {
        id: 'mfs-5',
        text: 'Gait',
        type: 'select',
        options: [
          { label: 'Normal / Bed rest / Wheelchair', value: 0 },
          { label: 'Weak', value: 10 },
          { label: 'Impaired', value: 20 },
        ],
      },
      {
        id: 'mfs-6',
        text: 'Mental status',
        type: 'select',
        options: [
          { label: 'Oriented to own ability', value: 0 },
          { label: 'Overestimates or forgets limitations', value: 15 },
        ],
      },
    ],
    scoring: {
      method: 'sum',
      ranges: [
        { min: 0, max: 24, label: 'Low Risk', color: 'green' },
        { min: 25, max: 50, label: 'Moderate Risk', color: 'yellow' },
        { min: 51, max: 125, label: 'High Risk', color: 'red' },
      ],
    },
  },

  {
    id: 'phq-2',
    name: 'PHQ-2 Depression Screening',
    category: 'Behavioral Health',
    questions: [
      {
        id: 'phq2-1',
        text: 'Over the last 2 weeks, how often have you had little interest or pleasure in doing things?',
        type: 'select',
        options: [
          { label: 'Not at all', value: 0 },
          { label: 'Several days', value: 1 },
          { label: 'More than half the days', value: 2 },
          { label: 'Nearly every day', value: 3 },
        ],
      },
      {
        id: 'phq2-2',
        text: 'Over the last 2 weeks, how often have you been feeling down, depressed, or hopeless?',
        type: 'select',
        options: [
          { label: 'Not at all', value: 0 },
          { label: 'Several days', value: 1 },
          { label: 'More than half the days', value: 2 },
          { label: 'Nearly every day', value: 3 },
        ],
      },
    ],
    scoring: {
      method: 'sum',
      maxScore: 6,
      ranges: [
        { min: 0, max: 2, label: 'Negative Screen', color: 'green' },
        { min: 3, max: 6, label: 'Positive Screen — Administer PHQ-9', color: 'red' },
      ],
    },
  },

  {
    id: 'toc',
    name: 'Transitions of Care Assessment',
    category: 'Care Coordination',
    questions: [
      {
        id: 'toc-1',
        text: 'Does the member understand their discharge diagnosis and instructions?',
        type: 'select',
        options: [
          { label: 'Yes, verbalizes understanding', value: 2 },
          { label: 'Partial understanding', value: 1 },
          { label: 'No / Unable to verbalize', value: 0 },
        ],
      },
      {
        id: 'toc-2',
        text: 'Has a follow-up appointment been scheduled with PCP within 7 days?',
        type: 'select',
        options: [
          { label: 'Yes, confirmed', value: 2 },
          { label: 'Scheduled but not confirmed', value: 1 },
          { label: 'No appointment scheduled', value: 0 },
        ],
      },
      {
        id: 'toc-3',
        text: 'Have discharge medications been obtained and reconciled?',
        type: 'select',
        options: [
          { label: 'All medications obtained', value: 2 },
          { label: 'Some medications pending', value: 1 },
          { label: 'Medications not obtained / barriers exist', value: 0 },
        ],
      },
      {
        id: 'toc-4',
        text: 'Does the member have adequate support at home?',
        type: 'select',
        options: [
          { label: 'Caregiver / family support in place', value: 2 },
          { label: 'Limited support', value: 1 },
          { label: 'Lives alone with no support identified', value: 0 },
        ],
      },
      {
        id: 'toc-5',
        text: 'Does the member know warning signs that require seeking immediate care?',
        type: 'select',
        options: [
          { label: 'Yes, can verbalize red-flag symptoms', value: 2 },
          { label: 'Partially aware', value: 1 },
          { label: 'Unable to identify warning signs', value: 0 },
        ],
      },
      {
        id: 'toc-6',
        text: 'Have home health or DME services been arranged if ordered?',
        type: 'select',
        options: [
          { label: 'Services arranged or not needed', value: 2 },
          { label: 'In process', value: 1 },
          { label: 'Not arranged / barriers identified', value: 0 },
        ],
      },
      {
        id: 'toc-7',
        text: 'Is transportation to follow-up appointments available?',
        type: 'select',
        options: [
          { label: 'Yes', value: 2 },
          { label: 'Uncertain', value: 1 },
          { label: 'No / barrier identified', value: 0 },
        ],
      },
    ],
    scoring: {
      method: 'sum',
      maxScore: 14,
      ranges: [
        { min: 0, max: 6, label: 'High Readmission Risk — Intensive Follow-up', color: 'red' },
        { min: 7, max: 10, label: 'Moderate Risk — Standard TOC Protocol', color: 'yellow' },
        { min: 11, max: 14, label: 'Low Risk — Routine Follow-up', color: 'green' },
      ],
    },
  },

  {
    id: 'initial-comprehensive',
    name: 'Initial Comprehensive Assessment',
    category: 'Clinical',
    questions: [
      {
        id: 'ica-1',
        text: 'ADL Functional Status',
        type: 'select',
        options: [
          { label: 'Independent in all ADLs', value: 3 },
          { label: 'Needs minimal assistance (1-2 ADLs)', value: 2 },
          { label: 'Needs moderate assistance (3-4 ADLs)', value: 1 },
          { label: 'Dependent in most/all ADLs', value: 0 },
        ],
      },
      {
        id: 'ica-2',
        text: 'Cognitive Status',
        type: 'select',
        options: [
          { label: 'Alert and oriented x4, intact memory', value: 3 },
          { label: 'Mild forgetfulness, oriented x3', value: 2 },
          { label: 'Moderate impairment, needs cueing', value: 1 },
          { label: 'Severe impairment / unable to assess', value: 0 },
        ],
      },
      {
        id: 'ica-3',
        text: 'Pain Level (0-10 scale)',
        type: 'select',
        options: [
          { label: '0 — No pain', value: 0 },
          { label: '1-3 — Mild', value: 1 },
          { label: '4-6 — Moderate', value: 2 },
          { label: '7-10 — Severe', value: 3 },
        ],
      },
      {
        id: 'ica-4',
        text: 'Medication Management',
        type: 'select',
        options: [
          { label: 'Self-manages all medications correctly', value: 3 },
          { label: 'Uses pill organizer / minor assistance', value: 2 },
          { label: 'Requires caregiver to administer medications', value: 1 },
          { label: 'Non-adherent or unable to manage', value: 0 },
        ],
      },
      {
        id: 'ica-5',
        text: 'Food Security',
        type: 'select',
        options: [
          { label: 'Adequate access to nutritious food', value: 0 },
          { label: 'Occasional difficulty affording food', value: 1 },
          { label: 'Frequently skips meals due to cost', value: 2 },
        ],
      },
      {
        id: 'ica-6',
        text: 'Housing Stability',
        type: 'select',
        options: [
          { label: 'Stable housing', value: 0 },
          { label: 'At risk (behind on rent, unsafe conditions)', value: 1 },
          { label: 'Homeless or in temporary shelter', value: 2 },
        ],
      },
      {
        id: 'ica-7',
        text: 'Transportation Access',
        type: 'select',
        options: [
          { label: 'Reliable transportation', value: 0 },
          { label: 'Sometimes has difficulty getting rides', value: 1 },
          { label: 'Frequently misses appointments due to transport', value: 2 },
        ],
      },
      {
        id: 'ica-8',
        text: 'Caregiver / Social Support',
        type: 'select',
        options: [
          { label: 'Strong support system in place', value: 0 },
          { label: 'Limited support, some isolation', value: 1 },
          { label: 'Socially isolated, no identified support', value: 2 },
        ],
      },
    ],
    scoring: {
      method: 'composite',
      sections: [
        {
          name: 'Functional / Clinical',
          questionIds: ['ica-1', 'ica-2', 'ica-3', 'ica-4'],
          note: 'Lower functional scores indicate higher acuity',
        },
        {
          name: 'Social Determinants of Health',
          questionIds: ['ica-5', 'ica-6', 'ica-7', 'ica-8'],
          note: 'Higher SDOH scores indicate greater barriers',
        },
      ],
    },
  },

  {
    id: 'braden-scale',
    name: 'Braden Scale for Pressure Injury Risk',
    category: 'Safety',
    questions: [
      {
        id: 'bs-1',
        text: 'Sensory Perception',
        type: 'select',
        options: [
          { label: '1 — Completely limited', value: 1 },
          { label: '2 — Very limited', value: 2 },
          { label: '3 — Slightly limited', value: 3 },
          { label: '4 — No impairment', value: 4 },
        ],
      },
      {
        id: 'bs-2',
        text: 'Moisture',
        type: 'select',
        options: [
          { label: '1 — Constantly moist', value: 1 },
          { label: '2 — Very moist', value: 2 },
          { label: '3 — Occasionally moist', value: 3 },
          { label: '4 — Rarely moist', value: 4 },
        ],
      },
      {
        id: 'bs-3',
        text: 'Activity',
        type: 'select',
        options: [
          { label: '1 — Bedfast', value: 1 },
          { label: '2 — Chairfast', value: 2 },
          { label: '3 — Walks occasionally', value: 3 },
          { label: '4 — Walks frequently', value: 4 },
        ],
      },
      {
        id: 'bs-4',
        text: 'Mobility',
        type: 'select',
        options: [
          { label: '1 — Completely immobile', value: 1 },
          { label: '2 — Very limited', value: 2 },
          { label: '3 — Slightly limited', value: 3 },
          { label: '4 — No limitation', value: 4 },
        ],
      },
      {
        id: 'bs-5',
        text: 'Nutrition',
        type: 'select',
        options: [
          { label: '1 — Very poor', value: 1 },
          { label: '2 — Probably inadequate', value: 2 },
          { label: '3 — Adequate', value: 3 },
          { label: '4 — Excellent', value: 4 },
        ],
      },
      {
        id: 'bs-6',
        text: 'Friction & Shear',
        type: 'select',
        options: [
          { label: '1 — Problem', value: 1 },
          { label: '2 — Potential problem', value: 2 },
          { label: '3 — No apparent problem', value: 3 },
        ],
      },
    ],
    scoring: {
      method: 'sum',
      maxScore: 23,
      ranges: [
        { min: 6, max: 9, label: 'Very High Risk', color: 'red' },
        { min: 10, max: 12, label: 'High Risk', color: 'orange' },
        { min: 13, max: 14, label: 'Moderate Risk', color: 'yellow' },
        { min: 15, max: 18, label: 'Mild Risk', color: 'blue' },
        { min: 19, max: 23, label: 'No Risk', color: 'green' },
      ],
    },
  },
];
