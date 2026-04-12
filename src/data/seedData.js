export const patients = [
  {
    id: 'PT-10042',
    firstName: 'Test',
    lastName: 'One',
    dob: '1958-03-14',
    age: 68,
    sex: 'Female',
    mrn: 'MRN-884201',
    phone: '(305) 555-0142',
    email: 'test.one@email.com',
    address: '1247 Palm Ave, Miami, FL 33101',
    language: 'Spanish',
    pcp: 'Dr. Sarah Chen',
    insurance: {
      plan: 'Medicare Advantage - Humana Gold Plus',
      memberId: 'HUM-882991042',
      groupNumber: 'GRP-MA-FL',
      type: 'Primary',
      copay: '$20',
      status: 'Active'
    },
    emergencyContact: {
      name: 'Test Contact One',
      relation: 'Son',
      phone: '(305) 555-0198'
    },
    diagnoses: [
      { code: 'E11.9', description: 'Type 2 Diabetes Mellitus', status: 'Active', onsetDate: '2015-06-01' },
      { code: 'I10', description: 'Essential Hypertension', status: 'Active', onsetDate: '2012-03-15' },
      { code: 'J44.1', description: 'COPD with Acute Exacerbation', status: 'Active', onsetDate: '2020-11-20' },
      { code: 'M81.0', description: 'Osteoporosis', status: 'Active', onsetDate: '2019-08-10' }
    ],
    medications: [
      { name: 'Metformin', dose: '1000mg', frequency: 'BID', prescriber: 'Dr. Chen', status: 'Active' },
      { name: 'Lisinopril', dose: '20mg', frequency: 'Daily', prescriber: 'Dr. Chen', status: 'Active' },
      { name: 'Albuterol Inhaler', dose: '90mcg', frequency: 'PRN', prescriber: 'Dr. Patel', status: 'Active' },
      { name: 'Alendronate', dose: '70mg', frequency: 'Weekly', prescriber: 'Dr. Chen', status: 'Active' },
      { name: 'Atorvastatin', dose: '40mg', frequency: 'QHS', prescriber: 'Dr. Chen', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Penicillin', reaction: 'Anaphylaxis', severity: 'Severe' },
      { allergen: 'Sulfa', reaction: 'Rash', severity: 'Moderate' }
    ],
    caseInfo: {
      status: 'Active',
      acuity: 'High',
      caseType: 'Complex Care Management',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2026-01-15',
      program: 'Chronic Disease Management',
      lastContact: '2026-04-05',
      nextFollowUp: '2026-04-10'
    },
    riskLevel: 'High',
    admissions: [
      {
        id: 'ADM-001',
        facility: 'Baptist Hospital Miami',
        facilityType: 'Acute Care',
        admitDate: '2026-03-20',
        dischargeDate: '2026-03-25',
        admitDiagnosis: 'COPD Exacerbation',
        attendingPhysician: 'Dr. Robert Patel',
        dischargeDisposition: 'Home with Home Health',
        levelOfCare: 'Med-Surg',
        readmissionFlag: false,
        lengthOfStay: 5
      },
      {
        id: 'ADM-002',
        facility: 'Baptist Hospital Miami',
        facilityType: 'Acute Care',
        admitDate: '2025-12-10',
        dischargeDate: '2025-12-14',
        admitDiagnosis: 'Hyperglycemia',
        attendingPhysician: 'Dr. Sarah Chen',
        dischargeDisposition: 'Home',
        levelOfCare: 'Med-Surg',
        readmissionFlag: false,
        lengthOfStay: 4
      }
    ],
    appointments: [
      { date: '2026-04-10', time: '10:00 AM', provider: 'Dr. Sarah Chen', type: 'PCP Follow-up', location: 'Chen Medical Group', status: 'Scheduled' },
      { date: '2026-04-14', time: '2:30 PM', provider: 'Dr. Robert Patel', type: 'Pulmonology', location: 'Miami Lung Center', status: 'Scheduled' },
      { date: '2026-04-22', time: '9:00 AM', provider: 'Jennifer Walsh, RN', type: 'CM Phone Assessment', location: 'Telehealth', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-001',
        date: '2026-04-05',
        time: '10:30 AM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'Phone',
        subjective: 'Patient reports feeling much better since hospital discharge. States she is using her inhaler as prescribed. Denies shortness of breath at rest but reports mild dyspnea with exertion (climbing stairs). Blood sugar readings this week: fasting 130-155. States she is following up with Dr. Chen on Thursday.',
        objective: 'Alert and oriented. Voice clear during phone call. Reports compliance with all medications. Home health nurse visited yesterday - documented stable vital signs. O2 sats 94% on room air per home health report.',
        assessment: 'Post-discharge recovery progressing well. COPD stable post-exacerbation. Diabetes: fasting glucose slightly above target range (goal <130). Patient engaged in self-care and compliant with treatment plan.',
        plan: '1. Continue current medication regimen. 2. Reinforce importance of daily glucose monitoring. 3. Discuss glucose readings with Dr. Chen at Thursday appointment. 4. Follow up via phone in 5 days. 5. Continue home health services x 2 more weeks.'
      },
      {
        id: 'PN-002',
        date: '2026-03-26',
        time: '2:00 PM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'Phone',
        subjective: 'Patient called from home after discharge yesterday. States she is feeling tired but better than at hospital. Son Carlos is staying with her for the week. Reports understanding of new medication changes. Concerned about oxygen use at night.',
        objective: 'Home health ordered and confirmed to start tomorrow. DME (portable oxygen concentrator) delivered to home today. Discharge summary received and reviewed - no medication discrepancies noted.',
        assessment: 'Day 1 post-discharge from Baptist Hospital. Patient stable but fatigued. Good family support system in place. Transition of care plan being implemented.',
        plan: '1. Home health to begin tomorrow for skilled nursing visits x 3/week. 2. Follow up with Dr. Patel (Pulmonology) in 2 weeks. 3. CM follow-up call in 3 days. 4. Ensure oxygen titration teaching completed by HH nurse. 5. Updated care plan in system.'
      },
      {
        id: 'PN-003',
        date: '2026-03-15',
        time: '11:00 AM',
        author: 'Jennifer Walsh, RN',
        type: 'DAR',
        contactMethod: 'In-Person',
        data: 'Patient presented to ED with worsening SOB x 2 days. Admitted to Baptist Hospital. Bedside visit conducted. Patient anxious, using accessory muscles. O2 at 3L via NC. ABG results pending. Dr. Patel managing inpatient.',
        action: 'Concurrent review initiated. Contacted Humana for authorization - auth #HUM-2026-44821 obtained for 5 days acute care. Coordinated with inpatient team regarding care plan. Discussed discharge planning with social worker. Notified PCP Dr. Chen of admission.',
        response: 'Patient calmer after discussion. Verbalized understanding of treatment plan. Son Carlos arrived and was updated on condition.'
      }
    ],
    communications: [
      {
        id: 'COM-001',
        date: '2026-04-05',
        time: '11:00 AM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Maria Gonzalez',
        contactRole: 'Patient',
        subject: 'Post-discharge follow-up call',
        summary: 'Completed scheduled follow-up call. Patient reports improved symptoms. Reviewed medication compliance and upcoming appointments. Discussed glucose management.',
        outcome: 'Satisfactory progress',
        followUpNeeded: true,
        followUpDate: '2026-04-10'
      },
      {
        id: 'COM-002',
        date: '2026-04-03',
        time: '9:30 AM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Dr. Sarah Chen',
        contactRole: 'PCP',
        subject: 'Post-discharge update',
        summary: 'Spoke with Dr. Chen regarding patient\'s post-discharge status. Discussed recent glucose readings and COPD management. Dr. Chen will adjust diabetes regimen at Thursday visit if needed.',
        outcome: 'Physician updated',
        followUpNeeded: false,
        followUpDate: null
      },
      {
        id: 'COM-003',
        date: '2026-03-25',
        time: '3:00 PM',
        direction: 'Outbound',
        method: 'Fax',
        contactPerson: 'Humana UM Department',
        contactRole: 'Insurance',
        subject: 'Concurrent review - discharge notification',
        summary: 'Sent discharge notification to Humana. Patient discharged day 5 within approved LOS. Authorization HUM-2026-44821 closed.',
        outcome: 'Authorization closed',
        followUpNeeded: false,
        followUpDate: null
      },
      {
        id: 'COM-004',
        date: '2026-03-22',
        time: '10:00 AM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Carlos Gonzalez',
        contactRole: 'Family/Caregiver',
        subject: 'Discharge planning discussion',
        summary: 'Spoke with son Carlos regarding discharge plan. He will be staying with patient for first week post-discharge. Reviewed home safety needs, medication management, and signs/symptoms to watch for.',
        outcome: 'Family engaged in discharge plan',
        followUpNeeded: false,
        followUpDate: null
      }
    ],
    assessments: [
      {
        id: 'ASM-001',
        type: 'Comprehensive Assessment',
        date: '2026-01-15',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Independent with ADLs, requires assistance with heavy housework',
        cognitiveStatus: 'Alert and oriented x4, no cognitive deficits noted',
        phq2Score: 1,
        fallRisk: 'Moderate',
        painLevel: '3/10 - bilateral knee pain',
        sdoh: {
          housing: 'Stable - owns condo',
          foodSecurity: 'Adequate',
          transportation: 'Son provides transportation',
          socialSupport: 'Strong family support - son lives nearby'
        },
        summary: 'Initial comprehensive assessment completed for enrollment into Chronic Disease Management program. Patient is a 68-year-old Spanish-speaking female with complex medical history including DM2, HTN, COPD, and osteoporosis. Active and engaged in healthcare. Strong family support system.'
      },
      {
        id: 'ASM-002',
        type: 'Reassessment',
        date: '2026-04-01',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Decreased from baseline - SOB with exertion limits activity. Using supplemental O2 with stairs.',
        cognitiveStatus: 'Alert and oriented x4',
        phq2Score: 2,
        fallRisk: 'High',
        painLevel: '2/10',
        sdoh: {
          housing: 'Stable',
          foodSecurity: 'Adequate - son bringing meals',
          transportation: 'Son providing transport',
          socialSupport: 'Son staying with patient post-discharge'
        },
        summary: '90-day reassessment conducted post-hospitalization. Functional status decreased from baseline due to recent COPD exacerbation. Fall risk elevated. Acuity remains High. Care plan updated to include respiratory goals. Home health in place.'
      }
    ],
    carePlan: {
      goals: [
        { id: 'G1', description: 'Maintain fasting blood glucose < 130 mg/dL', status: 'In Progress', targetDate: '2026-07-15' },
        { id: 'G2', description: 'Zero hospital readmissions within 30 days of discharge', status: 'On Track', targetDate: '2026-04-25' },
        { id: 'G3', description: 'Improve functional status to baseline within 6 weeks post-discharge', status: 'In Progress', targetDate: '2026-05-06' },
        { id: 'G4', description: 'Patient demonstrates proper inhaler technique', status: 'Met', targetDate: '2026-03-30' }
      ],
      barriers: ['Language barrier - Spanish primary language', 'Limited health literacy', 'Transportation dependency']
    },
    authorizations: [
      {
        id: 'AUTH-001',
        authNumber: 'HUM-2026-44821',
        insurancePlan: 'Medicare Advantage - Humana Gold Plus',
        serviceType: 'Home Health',
        serviceRequested: 'Skilled nursing visits 3x/week x 4 weeks',
        diagnosisCode: 'J44.1',
        clinicalRationale: 'Post-discharge COPD management requiring wound assessment, medication reconciliation, vital sign monitoring, and oxygen titration education.',
        requestDate: '2026-03-25',
        decisionDate: '2026-03-26',
        expirationDate: '2026-04-25',
        approvedUnits: 12,
        usedUnits: 6,
        status: 'Approved',
        reviewerName: 'Dr. Patricia Langley',
        decisionNotes: 'Approved per InterQual criteria for post-acute home health services.',
        priority: 'Standard',
      },
      {
        id: 'AUTH-002',
        authNumber: 'HUM-2026-44935',
        insurancePlan: 'Medicare Advantage - Humana Gold Plus',
        serviceType: 'DME - Oxygen Equipment',
        serviceRequested: 'Portable oxygen concentrator with supplies x 6 months',
        diagnosisCode: 'J44.1',
        clinicalRationale: 'Supplemental O2 required for exertional desaturation below 88% following COPD exacerbation. O2 sats 94% on room air at rest, drops to 86% with activity.',
        requestDate: '2026-03-25',
        decisionDate: '2026-03-26',
        expirationDate: '2026-09-25',
        approvedUnits: 1,
        usedUnits: 1,
        status: 'Approved',
        reviewerName: 'Dr. Patricia Langley',
        decisionNotes: 'Approved. ABG and oximetry results support medical necessity.',
        priority: 'Urgent',
      },
      {
        id: 'AUTH-003',
        authNumber: 'HUM-2026-45102',
        insurancePlan: 'Medicare Advantage - Humana Gold Plus',
        serviceType: 'Pulmonary Rehab',
        serviceRequested: 'Outpatient pulmonary rehabilitation 3x/week x 8 weeks',
        diagnosisCode: 'J44.1',
        clinicalRationale: 'Functional status decreased post-COPD exacerbation. Patient reports dyspnea on exertion limiting ADLs. Pulmonary rehab recommended by pulmonologist Dr. Patel.',
        requestDate: '2026-04-05',
        decisionDate: null,
        expirationDate: null,
        approvedUnits: null,
        usedUnits: 0,
        status: 'Pending Review',
        reviewerName: null,
        decisionNotes: null,
        priority: 'Standard',
      }
    ]
  },
  {
    id: 'PT-10043',
    firstName: 'Test',
    lastName: 'Two',
    dob: '1945-11-22',
    age: 80,
    sex: 'Male',
    mrn: 'MRN-773102',
    phone: '(404) 555-0237',
    email: 'test.two@email.com',
    address: '892 Peachtree St NW, Atlanta, GA 30308',
    language: 'English',
    pcp: 'Dr. Michael Torres',
    insurance: {
      plan: 'Medicare Traditional + Medigap Plan F',
      memberId: 'MCR-1EG4-TE2-0043',
      groupNumber: 'N/A',
      type: 'Primary',
      copay: '$0',
      status: 'Active'
    },
    emergencyContact: {
      name: 'Test Contact Two',
      relation: 'Wife',
      phone: '(404) 555-0238'
    },
    diagnoses: [
      { code: 'I50.9', description: 'Heart Failure, Unspecified', status: 'Active', onsetDate: '2021-02-14' },
      { code: 'N18.3', description: 'Chronic Kidney Disease, Stage 3', status: 'Active', onsetDate: '2022-06-30' },
      { code: 'I48.0', description: 'Atrial Fibrillation', status: 'Active', onsetDate: '2019-09-01' },
      { code: 'E78.5', description: 'Hyperlipidemia', status: 'Active', onsetDate: '2010-01-15' },
      { code: 'G47.33', description: 'Obstructive Sleep Apnea', status: 'Active', onsetDate: '2018-04-20' }
    ],
    medications: [
      { name: 'Furosemide', dose: '40mg', frequency: 'BID', prescriber: 'Dr. Torres', status: 'Active' },
      { name: 'Carvedilol', dose: '25mg', frequency: 'BID', prescriber: 'Dr. Torres', status: 'Active' },
      { name: 'Eliquis', dose: '5mg', frequency: 'BID', prescriber: 'Dr. Kim', status: 'Active' },
      { name: 'Potassium Chloride', dose: '20mEq', frequency: 'Daily', prescriber: 'Dr. Torres', status: 'Active' },
      { name: 'Rosuvastatin', dose: '10mg', frequency: 'QHS', prescriber: 'Dr. Torres', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Codeine', reaction: 'Nausea/Vomiting', severity: 'Moderate' },
      { allergen: 'Iodine Contrast', reaction: 'Hives', severity: 'Moderate' }
    ],
    caseInfo: {
      status: 'Active',
      acuity: 'High',
      caseType: 'Transitions of Care',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2026-03-01',
      program: 'Heart Failure Management',
      lastContact: '2026-04-07',
      nextFollowUp: '2026-04-09'
    },
    riskLevel: 'Critical',
    admissions: [
      {
        id: 'ADM-003',
        facility: 'Emory University Hospital',
        facilityType: 'Acute Care',
        admitDate: '2026-02-25',
        dischargeDate: '2026-03-02',
        admitDiagnosis: 'Acute on Chronic Heart Failure Exacerbation',
        attendingPhysician: 'Dr. James Kim',
        dischargeDisposition: 'Home with Home Health',
        levelOfCare: 'Telemetry',
        readmissionFlag: false,
        lengthOfStay: 5
      }
    ],
    appointments: [
      { date: '2026-04-09', time: '9:00 AM', provider: 'Dr. James Kim', type: 'Cardiology Follow-up', location: 'Emory Heart & Vascular Center', status: 'Scheduled' },
      { date: '2026-04-15', time: '11:00 AM', provider: 'Dr. Michael Torres', type: 'PCP Follow-up', location: 'Torres Internal Medicine', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-004',
        date: '2026-04-07',
        time: '9:00 AM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'Phone',
        subjective: 'Patient reports stable symptoms. Weighing daily - weights stable at 195-197 lbs. Mild ankle swelling at end of day but resolves with elevation. Sleeping on 2 pillows. No PND. Taking all medications as prescribed.',
        objective: 'Daily weight log reviewed via patient portal. BP per home monitoring: 128/76 average this week. Heart rate 68-74 bpm. No significant weight gain (>2 lbs/day).',
        assessment: 'HF stable post-discharge. Medication compliance good. No signs of decompensation. Cardiology follow-up tomorrow.',
        plan: '1. Continue daily weights and BP monitoring. 2. Reinforce 2g sodium diet. 3. Cardiology appointment tomorrow. 4. Next CM call Thursday.'
      }
    ],
    communications: [
      {
        id: 'COM-005',
        date: '2026-04-07',
        time: '9:45 AM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Robert Thompson',
        contactRole: 'Patient',
        subject: 'Weekly HF monitoring call',
        summary: 'Completed weekly HF monitoring call. Patient stable. Weight and BP within parameters. Reminded of cardiology appointment tomorrow.',
        outcome: 'Stable, on track',
        followUpNeeded: true,
        followUpDate: '2026-04-10'
      }
    ],
    assessments: [
      {
        id: 'ASM-003',
        type: 'Comprehensive Assessment',
        date: '2026-03-01',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Independent with ADLs, fatigues easily with activity, uses CPAP nightly',
        cognitiveStatus: 'Mild forgetfulness - wife manages medications',
        phq2Score: 3,
        fallRisk: 'Moderate',
        painLevel: '1/10',
        sdoh: {
          housing: 'Stable - single family home',
          foodSecurity: 'Adequate',
          transportation: 'Wife drives, also has medical transport benefit',
          socialSupport: 'Wife is primary caregiver, daughter visits weekly'
        },
        summary: '80-year-old male enrolled post-HF hospitalization. Complex cardiac history with AFib and CKD3. Wife is primary caregiver and manages medications. PHQ-2 mildly elevated - will monitor. Fall risk moderate due to diuretic use and fatigue.'
      }
    ],
    carePlan: {
      goals: [
        { id: 'G5', description: 'Maintain daily weight within 2 lbs of dry weight (194 lbs)', status: 'On Track', targetDate: '2026-06-01' },
        { id: 'G6', description: 'Zero HF readmissions within 30 days', status: 'Met', targetDate: '2026-04-02' },
        { id: 'G7', description: 'Patient/wife demonstrate understanding of sodium restriction', status: 'In Progress', targetDate: '2026-04-15' }
      ],
      barriers: ['Cognitive decline - relies on wife for med management', 'PHQ-2 elevated - possible depression']
    },
    authorizations: [
      {
        id: 'AUTH-004',
        authNumber: 'MCR-2026-30112',
        insurancePlan: 'Medicare Traditional + Medigap Plan F',
        serviceType: 'Home Health',
        serviceRequested: 'Skilled nursing visits 2x/week x 4 weeks for CHF management',
        diagnosisCode: 'I50.9',
        clinicalRationale: 'Post-discharge CHF management requiring daily weight monitoring education, medication reconciliation, fluid restriction counseling, and vital sign assessment.',
        requestDate: '2026-03-10',
        decisionDate: '2026-03-11',
        expirationDate: '2026-04-10',
        approvedUnits: 8,
        usedUnits: 7,
        status: 'Approved',
        reviewerName: 'Dr. Alan Mercer',
        decisionNotes: 'Approved per Medicare home health criteria. Patient meets homebound status.',
        priority: 'Standard',
      },
      {
        id: 'AUTH-005',
        authNumber: 'MCR-2026-30245',
        insurancePlan: 'Medicare Traditional + Medigap Plan F',
        serviceType: 'Cardiology Follow-up',
        serviceRequested: 'Outpatient cardiology evaluation with echocardiogram',
        diagnosisCode: 'I50.9',
        clinicalRationale: 'Follow-up echocardiogram to assess LV function post-hospitalization for acute CHF exacerbation. EF was 30% on admission.',
        requestDate: '2026-03-12',
        decisionDate: '2026-03-13',
        expirationDate: '2026-04-30',
        approvedUnits: 1,
        usedUnits: 0,
        status: 'Approved',
        reviewerName: 'Dr. Alan Mercer',
        decisionNotes: 'Approved. Post-discharge cardiac follow-up is standard of care.',
        priority: 'Standard',
      }
    ]
  },
  {
    id: 'PT-10044',
    firstName: 'Test',
    lastName: 'Three',
    dob: '1972-07-08',
    age: 53,
    sex: 'Female',
    mrn: 'MRN-556890',
    phone: '(312) 555-0185',
    email: 'test.three@email.com',
    address: '2301 N Michigan Ave, Chicago, IL 60601',
    language: 'English',
    pcp: 'Dr. Lisa Anderson',
    insurance: {
      plan: 'Blue Cross Blue Shield PPO',
      memberId: 'BCBS-XKJ2281',
      groupNumber: 'GRP-IL-4420',
      type: 'Primary',
      copay: '$30',
      status: 'Active'
    },
    emergencyContact: {
      name: 'Test Contact Three',
      relation: 'Husband',
      phone: '(312) 555-0186'
    },
    diagnoses: [
      { code: 'C50.911', description: 'Breast Cancer, Right, Stage II', status: 'Active', onsetDate: '2026-01-20' },
      { code: 'F32.1', description: 'Major Depressive Disorder, Moderate', status: 'Active', onsetDate: '2026-02-15' },
      { code: 'G89.29', description: 'Chronic Pain Syndrome', status: 'Active', onsetDate: '2024-05-01' },
      { code: 'E03.9', description: 'Hypothyroidism', status: 'Active', onsetDate: '2018-03-10' }
    ],
    medications: [
      { name: 'Tamoxifen', dose: '20mg', frequency: 'Daily', prescriber: 'Dr. Rivera', status: 'Active' },
      { name: 'Sertraline', dose: '100mg', frequency: 'Daily', prescriber: 'Dr. Anderson', status: 'Active' },
      { name: 'Gabapentin', dose: '300mg', frequency: 'TID', prescriber: 'Dr. Anderson', status: 'Active' },
      { name: 'Levothyroxine', dose: '75mcg', frequency: 'Daily', prescriber: 'Dr. Anderson', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Latex', reaction: 'Contact Dermatitis', severity: 'Mild' }
    ],
    caseInfo: {
      status: 'Active',
      acuity: 'Medium',
      caseType: 'Disease Management',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2026-02-01',
      program: 'Oncology Care Management',
      lastContact: '2026-04-04',
      nextFollowUp: '2026-04-11'
    },
    riskLevel: 'Medium',
    admissions: [],
    appointments: [
      { date: '2026-04-12', time: '1:00 PM', provider: 'Dr. Elena Rivera', type: 'Oncology - Chemo Cycle 4', location: 'Northwestern Cancer Center', status: 'Scheduled' },
      { date: '2026-04-18', time: '10:00 AM', provider: 'Dr. Lisa Anderson', type: 'PCP Follow-up', location: 'Anderson Family Medicine', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-005',
        date: '2026-04-04',
        time: '3:00 PM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'Video',
        subjective: 'Patient reports fatigue and mild nausea following chemo cycle 3 last week. Appetite decreased but maintaining oral intake. Mood is "okay" - states sertraline is helping. Sleeping 6-7 hours. Concerned about hair loss.',
        objective: 'Appeared fatigued on video. Skin color appropriate. Lab results from 4/2: WBC 3.8, Hgb 11.2, Platelets 145K. ANC 1.9. Oncology visit notes reviewed.',
        assessment: 'Post-chemo cycle 3 with expected side effects. Blood counts mildly suppressed but within acceptable range. Depression: improving with medication. Good coping and support system.',
        plan: '1. Continue anti-nausea regimen PRN. 2. Nutritional counseling referral placed. 3. Discussed American Cancer Society wig program. 4. Next chemo cycle 4/12. 5. CM follow-up next week.'
      }
    ],
    communications: [
      {
        id: 'COM-006',
        date: '2026-04-04',
        time: '3:45 PM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Oncology Navigation Team',
        contactRole: 'Provider',
        subject: 'Nutritional counseling referral',
        summary: 'Placed referral for oncology nutritional counseling through Northwestern Cancer Center. Appointment will be coordinated with next chemo cycle.',
        outcome: 'Referral accepted',
        followUpNeeded: false,
        followUpDate: null
      }
    ],
    assessments: [
      {
        id: 'ASM-004',
        type: 'Comprehensive Assessment',
        date: '2026-02-01',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Independent with all ADLs/IADLs',
        cognitiveStatus: 'Intact, no deficits',
        phq2Score: 4,
        fallRisk: 'Low',
        painLevel: '4/10 - chronic pain bilateral hips',
        sdoh: {
          housing: 'Stable - apartment',
          foodSecurity: 'Adequate',
          transportation: 'Drives self, husband backup',
          socialSupport: 'Strong - husband, two adult children, supportive friend network'
        },
        summary: 'Newly diagnosed breast cancer stage II. Starting chemo regimen. PHQ-2 elevated at 4 - started on sertraline by PCP. Strong support system. Patient is educated and engaged in treatment decisions. Enrolled in Oncology Care Management for treatment coordination and psychosocial support.'
      }
    ],
    carePlan: {
      goals: [
        { id: 'G8', description: 'Complete planned chemotherapy regimen (6 cycles)', status: 'In Progress', targetDate: '2026-06-20' },
        { id: 'G9', description: 'PHQ-2 score < 3', status: 'In Progress', targetDate: '2026-05-01' },
        { id: 'G10', description: 'Maintain adequate nutrition during treatment', status: 'In Progress', targetDate: '2026-06-20' }
      ],
      barriers: ['Chronic pain may limit activity', 'Depression risk during treatment']
    },
    authorizations: [
      {
        id: 'AUTH-006',
        authNumber: 'BCBS-2026-78834',
        insurancePlan: 'Blue Cross Blue Shield PPO',
        serviceType: 'Chemotherapy',
        serviceRequested: 'Neoadjuvant chemotherapy - TC regimen cycles 3-6',
        diagnosisCode: 'C50.911',
        clinicalRationale: 'Stage II right breast cancer, ER+/PR+/HER2-. Neoadjuvant TC chemotherapy per NCCN guidelines to reduce tumor burden prior to surgical planning.',
        requestDate: '2026-03-01',
        decisionDate: '2026-03-03',
        expirationDate: '2026-06-30',
        approvedUnits: 4,
        usedUnits: 1,
        status: 'Approved',
        reviewerName: 'Dr. Maria Gonzalez',
        decisionNotes: 'Approved per NCCN guidelines for Stage II breast cancer. Cycles 3-6 authorized.',
        priority: 'Urgent',
      },
      {
        id: 'AUTH-007',
        authNumber: 'BCBS-2026-79201',
        insurancePlan: 'Blue Cross Blue Shield PPO',
        serviceType: 'Nutritional Counseling',
        serviceRequested: 'Medical nutrition therapy 1x/week x 8 weeks',
        diagnosisCode: 'C50.911',
        clinicalRationale: 'Patient experiencing chemotherapy-induced nausea, weight loss of 8 lbs over 6 weeks, and decreased appetite. Nutritional support critical to maintaining treatment tolerance.',
        requestDate: '2026-04-04',
        decisionDate: null,
        expirationDate: null,
        approvedUnits: null,
        usedUnits: 0,
        status: 'Pending Review',
        reviewerName: null,
        decisionNotes: null,
        priority: 'Standard',
      }
    ]
  },
  {
    id: 'PT-10045',
    firstName: 'Test',
    lastName: 'Four',
    dob: '1960-01-30',
    age: 66,
    sex: 'Male',
    mrn: 'MRN-442018',
    phone: '(617) 555-0321',
    email: 'test.four@email.com',
    address: '45 Beacon St, Boston, MA 02108',
    language: 'English',
    pcp: 'Dr. Amy Wong',
    insurance: {
      plan: 'Medicare Advantage - Aetna',
      memberId: 'AET-9922118',
      groupNumber: 'GRP-MA-NE',
      type: 'Primary',
      copay: '$15',
      status: 'Active'
    },
    emergencyContact: {
      name: 'Test Contact Four',
      relation: 'Wife',
      phone: '(617) 555-0322'
    },
    diagnoses: [
      { code: 'M17.11', description: 'Primary Osteoarthritis, Right Knee', status: 'Active', onsetDate: '2023-01-10' },
      { code: 'I10', description: 'Essential Hypertension', status: 'Active', onsetDate: '2015-06-20' },
      { code: 'E11.65', description: 'Type 2 DM with Hyperglycemia', status: 'Active', onsetDate: '2020-03-15' },
      { code: 'G47.00', description: 'Insomnia', status: 'Active', onsetDate: '2024-09-01' }
    ],
    medications: [
      { name: 'Metformin', dose: '500mg', frequency: 'BID', prescriber: 'Dr. Wong', status: 'Active' },
      { name: 'Amlodipine', dose: '10mg', frequency: 'Daily', prescriber: 'Dr. Wong', status: 'Active' },
      { name: 'Meloxicam', dose: '15mg', frequency: 'Daily', prescriber: 'Dr. Singh', status: 'Active' },
      { name: 'Melatonin', dose: '5mg', frequency: 'QHS', prescriber: 'Dr. Wong', status: 'Active' }
    ],
    allergies: [],
    caseInfo: {
      status: 'Active',
      acuity: 'Low',
      caseType: 'Pre-Surgical Planning',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2026-03-15',
      program: 'Surgical Optimization',
      lastContact: '2026-04-06',
      nextFollowUp: '2026-04-13'
    },
    riskLevel: 'Low',
    admissions: [],
    appointments: [
      { date: '2026-04-20', time: '8:00 AM', provider: 'Dr. Raj Singh', type: 'Orthopedic Surgery - TKR', location: 'Mass General Hospital', status: 'Scheduled' },
      { date: '2026-04-13', time: '10:00 AM', provider: 'Dr. Amy Wong', type: 'Pre-Surgical Clearance', location: 'Wong Medical Associates', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-006',
        date: '2026-04-06',
        time: '1:00 PM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'Phone',
        subjective: 'Patient reports he is ready for surgery on 4/20. States pain in right knee is 7/10 and significantly impacting mobility and sleep. Completed pre-surgical education class online. Has questions about post-op rehab timeline.',
        objective: 'Pre-op labs ordered for 4/14. Pre-surgical clearance appointment with PCP scheduled 4/13. Home recovery setup in progress - wife will be caregiver.',
        assessment: 'Patient appropriately prepared for upcoming TKR. Pain level high, surgery indicated. Good motivation and support system for recovery.',
        plan: '1. Complete pre-op labs 4/14. 2. PCP clearance 4/13. 3. Arrange post-op home health PT. 4. Send post-surgical home prep checklist. 5. CM follow-up 4/13 after PCP visit.'
      }
    ],
    communications: [],
    assessments: [
      {
        id: 'ASM-005',
        type: 'Pre-Surgical Assessment',
        date: '2026-03-15',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Limited mobility due to R knee pain. Uses cane. Cannot climb stairs without difficulty.',
        cognitiveStatus: 'Intact',
        phq2Score: 1,
        fallRisk: 'Moderate',
        painLevel: '7/10 - R knee',
        sdoh: {
          housing: 'Two-story home - bedroom upstairs (concern)',
          foodSecurity: 'Adequate',
          transportation: 'Wife drives',
          socialSupport: 'Wife is primary support, retired - available full time'
        },
        summary: 'Pre-surgical assessment for planned R TKR 4/20. Patient has failed conservative management. Moderate fall risk due to impaired mobility. Will need temporary first-floor sleeping arrangement post-op. Home health PT to be arranged for post-discharge.'
      }
    ],
    carePlan: {
      goals: [
        { id: 'G11', description: 'Complete all pre-surgical requirements by 4/18', status: 'In Progress', targetDate: '2026-04-18' },
        { id: 'G12', description: 'Achieve safe home environment setup for post-op recovery', status: 'In Progress', targetDate: '2026-04-19' }
      ],
      barriers: ['Two-story home - needs first floor setup', 'Insomnia may impact post-op recovery']
    },
    authorizations: [
      {
        id: 'AUTH-008',
        authNumber: 'AET-2026-55410',
        insurancePlan: 'Medicare Advantage - Aetna',
        serviceType: 'Total Knee Replacement Surgery',
        serviceRequested: 'Right total knee arthroplasty with 2-day inpatient stay',
        diagnosisCode: 'M17.11',
        clinicalRationale: 'Severe right knee osteoarthritis refractory to conservative management including PT, NSAIDs, and cortisone injections. X-ray shows bone-on-bone changes. BMI within surgical range. Patient cleared by PCP and cardiology.',
        requestDate: '2026-03-20',
        decisionDate: '2026-03-25',
        expirationDate: '2026-05-20',
        approvedUnits: 1,
        usedUnits: 0,
        status: 'Approved',
        reviewerName: 'Dr. Thomas Reed',
        decisionNotes: 'Approved. Conservative measures exhausted. Patient meets surgical criteria per MCG guidelines.',
        priority: 'Standard',
      },
      {
        id: 'AUTH-009',
        authNumber: 'AET-2026-55622',
        insurancePlan: 'Medicare Advantage - Aetna',
        serviceType: 'Post-Op Physical Therapy',
        serviceRequested: 'Outpatient PT 3x/week x 6 weeks following TKR',
        diagnosisCode: 'M17.11',
        clinicalRationale: 'Post-operative rehabilitation following right TKR. Standard protocol for range of motion restoration, strength training, and gait training.',
        requestDate: '2026-04-01',
        decisionDate: null,
        expirationDate: null,
        approvedUnits: null,
        usedUnits: 0,
        status: 'Pending Review',
        reviewerName: null,
        decisionNotes: null,
        priority: 'Standard',
      }
    ]
  },
  {
    id: 'PT-10046',
    firstName: 'Test',
    lastName: 'Five',
    dob: '1940-05-18',
    age: 85,
    sex: 'Female',
    mrn: 'MRN-221450',
    phone: '(713) 555-0094',
    email: null,
    address: '1800 Westheimer Rd, Houston, TX 77098',
    language: 'English',
    pcp: 'Dr. David Park',
    insurance: {
      plan: 'Medicare Traditional + Medicaid (Dual Eligible)',
      memberId: 'MCR-1TX8-WD5-0046',
      groupNumber: 'N/A',
      type: 'Dual',
      copay: '$0',
      status: 'Inactive'
    },
    emergencyContact: {
      name: 'Test Contact Five',
      relation: 'Son',
      phone: '(713) 555-0095'
    },
    diagnoses: [
      { code: 'G30.1', description: 'Alzheimer\'s Disease, Late Onset', status: 'Active', onsetDate: '2023-08-15' },
      { code: 'I10', description: 'Essential Hypertension', status: 'Active', onsetDate: '2005-01-01' },
      { code: 'R26.81', description: 'Unsteadiness on Feet', status: 'Active', onsetDate: '2025-06-01' },
      { code: 'Z74.1', description: 'Need for Assistance with Personal Care', status: 'Active', onsetDate: '2025-10-01' },
      { code: 'F03.90', description: 'Unspecified Dementia without Behavioral Disturbance', status: 'Active', onsetDate: '2023-08-15' }
    ],
    medications: [
      { name: 'Donepezil', dose: '10mg', frequency: 'QHS', prescriber: 'Dr. Park', status: 'Active' },
      { name: 'Lisinopril', dose: '10mg', frequency: 'Daily', prescriber: 'Dr. Park', status: 'Active' },
      { name: 'Aspirin', dose: '81mg', frequency: 'Daily', prescriber: 'Dr. Park', status: 'Active' },
      { name: 'Vitamin D3', dose: '2000 IU', frequency: 'Daily', prescriber: 'Dr. Park', status: 'Active' }
    ],
    allergies: [
      { allergen: 'NSAIDs', reaction: 'GI Bleeding', severity: 'Severe' }
    ],
    caseInfo: {
      status: 'Active',
      acuity: 'High',
      caseType: 'Complex Care Management',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2025-11-01',
      program: 'Geriatric Care Management',
      lastContact: '2026-04-06',
      nextFollowUp: '2026-04-09'
    },
    riskLevel: 'High',
    admissions: [
      {
        id: 'ADM-004',
        facility: 'Memorial Hermann Hospital',
        facilityType: 'Acute Care',
        admitDate: '2026-03-28',
        dischargeDate: '2026-04-01',
        admitDiagnosis: 'Fall with Left Hip Fracture',
        attendingPhysician: 'Dr. Karen Lee',
        dischargeDisposition: 'Skilled Nursing Facility',
        levelOfCare: 'Surgical',
        readmissionFlag: false,
        lengthOfStay: 4
      }
    ],
    appointments: [
      { date: '2026-04-15', time: '2:00 PM', provider: 'Dr. David Park', type: 'PCP Follow-up', location: 'Park Geriatric Medicine', status: 'Scheduled' },
      { date: '2026-04-22', time: '10:00 AM', provider: 'Dr. Karen Lee', type: 'Orthopedic Follow-up', location: 'Memorial Hermann Ortho Clinic', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-007',
        date: '2026-04-06',
        time: '11:00 AM',
        author: 'Jennifer Walsh, RN',
        type: 'DAR',
        contactMethod: 'In-Person',
        data: 'Visited patient at Sunrise SNF. Patient is alert but confused about location. PT/OT started. Ambulating 20 feet with walker and max assist x1. Eating 50% of meals. Son visited yesterday.',
        action: 'Spoke with SNF care team regarding progress. Reviewed therapy goals. Confirmed Medicaid authorization through 4/20 (14 days). Contacted son to discuss transition planning. Initiated discussion about long-term care options.',
        response: 'Son is considering in-home caregiver vs. assisted living. Requested information on both options. Patient cooperative with therapy but has intermittent agitation in evenings.'
      }
    ],
    communications: [
      {
        id: 'COM-007',
        date: '2026-04-06',
        time: '12:00 PM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Rev. Michael Williams',
        contactRole: 'Family/Caregiver',
        subject: 'SNF progress and discharge planning',
        summary: 'Updated son on mother\'s progress at SNF. Discussed long-term care options: 24hr in-home aide ($4,500/mo with Medicaid waiver) vs assisted living ($5,200/mo, Medicaid may cover). Son requesting a family meeting next week to discuss.',
        outcome: 'Family meeting scheduled',
        followUpNeeded: true,
        followUpDate: '2026-04-10'
      }
    ],
    assessments: [
      {
        id: 'ASM-006',
        type: 'Comprehensive Assessment',
        date: '2025-11-01',
        author: 'Jennifer Walsh, RN',
        status: 'Completed',
        functionalStatus: 'Required standby assistance with bathing and dressing. Independent with eating. Wandering risk.',
        cognitiveStatus: 'MMSE 18/30. Short-term memory significantly impaired. Recognizes family members.',
        phq2Score: null,
        fallRisk: 'High',
        painLevel: 'Unable to self-report reliably',
        sdoh: {
          housing: 'Currently at SNF - was living alone prior to fall',
          foodSecurity: 'Was receiving Meals on Wheels',
          transportation: 'Cannot drive, relied on church volunteers and son',
          socialSupport: 'Son is POA, church community involved. Was isolated at home.'
        },
        summary: 'Elderly female with Alzheimer\'s disease, now post-hip fracture at SNF. Was living alone prior to fall which raises safety concerns for return home. Son is engaged and has POA. Dual eligible. Complex discharge planning needed. High acuity.'
      }
    ],
    carePlan: {
      goals: [
        { id: 'G13', description: 'Safe discharge disposition determined by 4/15', status: 'In Progress', targetDate: '2026-04-15' },
        { id: 'G14', description: 'Ambulate 100 feet with walker and supervision within 2 weeks', status: 'In Progress', targetDate: '2026-04-14' },
        { id: 'G15', description: 'Long-term care plan established with family', status: 'Not Started', targetDate: '2026-04-20' }
      ],
      barriers: ['Alzheimer\'s - limited decision-making capacity', 'Was living alone - unsafe to return home', 'Financial considerations for long-term care', 'Family decision-making in progress']
    },
    authorizations: [
      {
        id: 'AUTH-010',
        authNumber: 'MCR-2026-41850',
        insurancePlan: 'Medicare Traditional + Medicaid (Dual Eligible)',
        serviceType: 'Skilled Nursing Facility',
        serviceRequested: 'SNF stay for post-surgical rehabilitation - up to 30 days',
        diagnosisCode: 'G30.1',
        clinicalRationale: 'Post-hip fracture repair requiring intensive rehab. Patient has Alzheimer\'s disease limiting self-care ability. Unsafe to return home alone. Requires 24-hour supervision, PT/OT, and cognitive support.',
        requestDate: '2026-04-01',
        decisionDate: '2026-04-01',
        expirationDate: '2026-05-01',
        approvedUnits: 30,
        usedUnits: 8,
        status: 'Approved',
        reviewerName: 'Dr. Sandra Whitfield',
        decisionNotes: 'Approved for 30-day SNF stay. Medicare Part A coverage. Continued stay review at day 20.',
        priority: 'Urgent',
      },
      {
        id: 'AUTH-011',
        authNumber: 'MCR-2026-42103',
        insurancePlan: 'Medicare Traditional + Medicaid (Dual Eligible)',
        serviceType: 'Home Health',
        serviceRequested: 'Skilled nursing and home health aide visits post-SNF discharge',
        diagnosisCode: 'G30.1',
        clinicalRationale: 'Anticipated need for home health services upon SNF discharge. Patient will require ongoing skilled nursing for medication management and home health aide for ADL assistance given Alzheimer\'s diagnosis.',
        requestDate: '2026-04-07',
        decisionDate: null,
        expirationDate: null,
        approvedUnits: null,
        usedUnits: 0,
        status: 'Pending Review',
        reviewerName: null,
        decisionNotes: null,
        priority: 'Standard',
      }
    ]
  },
  {
    id: 'PT-10047',
    firstName: 'Test',
    lastName: 'Six',
    dob: '1985-09-12',
    age: 40,
    sex: 'Male',
    mrn: 'MRN-889503',
    phone: '(202) 555-0167',
    email: 'test.six@email.com',
    address: '1400 K St NW, Washington, DC 20005',
    language: 'English',
    pcp: 'Dr. Nicole Foster',
    insurance: {
      plan: 'CareFirst BCBS HMO',
      memberId: 'CF-DC-775401',
      groupNumber: 'GRP-DC-FED',
      type: 'Primary',
      copay: '$25',
      status: 'Active'
    },
    emergencyContact: {
      name: 'Test Contact Six',
      relation: 'Sister',
      phone: '(202) 555-0168'
    },
    diagnoses: [
      { code: 'T91.3', description: 'Spinal Cord Injury Sequelae - T12 Incomplete', status: 'Active', onsetDate: '2026-02-14' },
      { code: 'G82.20', description: 'Paraplegia, Unspecified', status: 'Active', onsetDate: '2026-02-14' },
      { code: 'N31.9', description: 'Neurogenic Bladder', status: 'Active', onsetDate: '2026-02-20' },
      { code: 'F43.10', description: 'Post-Traumatic Stress Disorder', status: 'Active', onsetDate: '2026-03-01' }
    ],
    medications: [
      { name: 'Baclofen', dose: '10mg', frequency: 'TID', prescriber: 'Dr. Okafor', status: 'Active' },
      { name: 'Oxybutynin', dose: '5mg', frequency: 'BID', prescriber: 'Dr. Okafor', status: 'Active' },
      { name: 'Sertraline', dose: '50mg', frequency: 'Daily', prescriber: 'Dr. Foster', status: 'Active' },
      { name: 'Docusate Sodium', dose: '100mg', frequency: 'BID', prescriber: 'Dr. Okafor', status: 'Active' }
    ],
    allergies: [],
    caseInfo: {
      status: 'Active',
      acuity: 'High',
      caseType: 'Catastrophic Case Management',
      assignedCM: 'Jennifer Walsh, RN',
      enrollmentDate: '2026-02-20',
      program: 'Rehab & Recovery',
      lastContact: '2026-04-07',
      nextFollowUp: '2026-04-09'
    },
    riskLevel: 'High',
    admissions: [
      {
        id: 'ADM-005',
        facility: 'MedStar National Rehab Hospital',
        facilityType: 'Inpatient Rehab (IRF)',
        admitDate: '2026-03-01',
        dischargeDate: null,
        admitDiagnosis: 'T12 Incomplete SCI - Rehab',
        attendingPhysician: 'Dr. Chidi Okafor',
        dischargeDisposition: null,
        levelOfCare: 'Inpatient Rehab',
        readmissionFlag: false,
        lengthOfStay: null
      }
    ],
    appointments: [
      { date: '2026-04-09', time: '1:00 PM', provider: 'Dr. Chidi Okafor', type: 'Rehab Team Conference', location: 'MedStar National Rehab', status: 'Scheduled' },
      { date: '2026-04-14', time: '3:00 PM', provider: 'Vocational Counselor', type: 'Vocational Rehab Intake', location: 'MedStar National Rehab', status: 'Scheduled' }
    ],
    progressNotes: [
      {
        id: 'PN-008',
        date: '2026-04-07',
        time: '2:00 PM',
        author: 'Jennifer Walsh, RN',
        type: 'SOAP',
        contactMethod: 'In-Person',
        subjective: 'Patient states he is making progress in therapy. "I can feel more in my legs this week." Emotionally up and down. Attending PTSD group therapy sessions. Concerned about return to work as IT project manager. Asking about adaptive vehicle options.',
        objective: 'FIM score improved from 72 to 89 over past 2 weeks. Transferring with moderate assist. Bladder program established. Psychology: attending individual and group sessions 3x/week. Projected discharge in 2-3 weeks.',
        assessment: 'Making excellent functional gains in rehab. Psychosocial adjustment ongoing. Vocational rehab intake scheduled. Discharge planning to begin with focus on home modifications and community resources.',
        plan: '1. Attend team conference 4/9. 2. Begin discharge planning - home assessment needed. 3. Vocational rehab intake 4/14. 4. Request OT home eval. 5. Research adaptive driving programs in DC area. 6. Connect with SCI peer mentor program.'
      }
    ],
    communications: [
      {
        id: 'COM-008',
        date: '2026-04-07',
        time: '3:00 PM',
        direction: 'Outbound',
        method: 'Phone',
        contactPerson: 'Keisha Johnson',
        contactRole: 'Family/Caregiver',
        subject: 'Rehab progress and discharge planning',
        summary: 'Updated sister on Marcus\'s progress. Discussed home modifications needed (wheelchair ramp, bathroom modifications, widened doorways). She will begin getting contractor estimates. Discussed community resources for SCI.',
        outcome: 'Family engaged in planning',
        followUpNeeded: true,
        followUpDate: '2026-04-12'
      }
    ],
    assessments: [],
    carePlan: {
      goals: [
        { id: 'G16', description: 'Achieve FIM score > 100 for safe discharge home', status: 'In Progress', targetDate: '2026-04-28' },
        { id: 'G17', description: 'Complete home modifications prior to discharge', status: 'Not Started', targetDate: '2026-05-01' },
        { id: 'G18', description: 'Establish outpatient therapy and support services', status: 'Not Started', targetDate: '2026-05-01' }
      ],
      barriers: ['Home needs significant modifications', 'PTSD impacting adjustment', 'Single - limited in-home caregiver support', 'Employer accommodation needs to be addressed']
    },
    authorizations: [
      {
        id: 'AUTH-012',
        authNumber: 'CF-2026-99210',
        insurancePlan: 'CareFirst BCBS HMO',
        serviceType: 'Inpatient Rehabilitation',
        serviceRequested: 'Inpatient rehab facility stay - up to 45 days',
        diagnosisCode: 'T91.3',
        clinicalRationale: 'T12 incomplete spinal cord injury with paraplegia requiring intensive inpatient rehabilitation. Patient requires minimum 3 hours of therapy per day including PT, OT, and psychological support.',
        requestDate: '2026-02-20',
        decisionDate: '2026-02-21',
        expirationDate: '2026-05-15',
        approvedUnits: 45,
        usedUnits: 38,
        status: 'Approved',
        reviewerName: 'Dr. James Calloway',
        decisionNotes: 'Approved for 45-day IRF stay. Patient meets admission criteria for SCI rehabilitation. FIM scores documented.',
        priority: 'Urgent',
      },
      {
        id: 'AUTH-013',
        authNumber: 'CF-2026-99445',
        insurancePlan: 'CareFirst BCBS HMO',
        serviceType: 'DME - Power Wheelchair',
        serviceRequested: 'Custom power wheelchair with tilt-in-space and pressure relief cushion',
        diagnosisCode: 'G82.20',
        clinicalRationale: 'Paraplegia secondary to T12 SCI. Patient requires power wheelchair for community mobility. Manual wheelchair trialed but insufficient due to upper extremity fatigue and community distance requirements.',
        requestDate: '2026-03-15',
        decisionDate: '2026-03-22',
        expirationDate: '2026-09-22',
        approvedUnits: 1,
        usedUnits: 0,
        status: 'Approved',
        reviewerName: 'Dr. James Calloway',
        decisionNotes: 'Approved. ATP evaluation supports medical necessity for power mobility. Medicare LCD criteria met.',
        priority: 'Standard',
      },
      {
        id: 'AUTH-014',
        authNumber: 'CF-2026-99601',
        insurancePlan: 'CareFirst BCBS HMO',
        serviceType: 'Home Modifications',
        serviceRequested: 'Wheelchair ramp, bathroom grab bars, roll-in shower installation',
        diagnosisCode: 'G82.20',
        clinicalRationale: 'Patient with paraplegia requires home modifications for safe wheelchair accessibility. Current home has 3 steps at entrance, standard bathtub, and narrow doorways incompatible with wheelchair access.',
        requestDate: '2026-03-20',
        decisionDate: '2026-04-02',
        expirationDate: null,
        approvedUnits: null,
        usedUnits: 0,
        status: 'Denied',
        reviewerName: 'Dr. Pamela Chen',
        decisionNotes: 'Denied. Home modifications not a covered benefit under current plan. Recommend appeal with supporting documentation or referral to community resources/vocational rehab.',
        priority: 'Standard',
        appealStatus: 'Appeal Filed',
        appealDate: '2026-04-05',
        appealNotes: 'Appeal submitted with OT home evaluation, physician letter of medical necessity, and ADA accommodation request. Escalated to external review.',
      }
    ]
  }
];
