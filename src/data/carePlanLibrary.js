export const carePlanLibrary = [
  {
    id: 'diabetes-t2',
    healthConcern: 'Type 2 Diabetes Mellitus',
    category: 'Endocrine',
    icdCodes: ['E11.9', 'E11.65'],
    goals: [
      {
        id: 'diabetes-g1',
        description: 'Maintain fasting blood glucose < 130 mg/dL',
        timeframe: '90 days',
        interventions: [
          'Monitor daily fasting blood glucose and log results',
          'Reinforce diabetic diet education and carb counting',
          'Coordinate with PCP/endocrinology for medication adjustment',
          'Assess medication adherence at each contact',
          'Refer to diabetes self-management education (DSME) program'
        ]
      },
      {
        id: 'diabetes-g2',
        description: 'Achieve HbA1c < 7.0%',
        timeframe: '6 months',
        interventions: [
          'Schedule quarterly HbA1c lab draw and review results',
          'Coordinate endocrinology referral if HbA1c > 9%',
          'Educate on long-term complications of uncontrolled diabetes',
          'Assess barriers to medication adherence (cost, complexity, side effects)'
        ]
      },
      {
        id: 'diabetes-g3',
        description: 'Complete annual diabetic wellness exams',
        timeframe: '12 months',
        interventions: [
          'Schedule annual dilated eye exam with ophthalmology',
          'Ensure annual foot exam is completed by PCP or podiatry',
          'Coordinate annual kidney function labs (BMP, microalbumin)',
          'Verify flu and pneumonia vaccinations are up to date'
        ]
      }
    ]
  },
  {
    id: 'chf',
    healthConcern: 'Heart Failure (CHF)',
    category: 'Cardiovascular',
    icdCodes: ['I50.9', 'I50.22', 'I50.32'],
    goals: [
      {
        id: 'chf-g1',
        description: 'Maintain daily weight within 2 lbs of dry weight',
        timeframe: '30 days',
        interventions: [
          'Educate patient on daily weight monitoring - same time, same scale',
          'Instruct to call provider if weight gain > 2 lbs in 24 hrs or 5 lbs in 1 week',
          'Reinforce 2g sodium diet restriction',
          'Review fluid restriction compliance (1.5-2L/day)',
          'Coordinate home health for vital sign and weight monitoring'
        ]
      },
      {
        id: 'chf-g2',
        description: 'Zero heart failure readmissions within 30 days',
        timeframe: '30 days',
        interventions: [
          'Complete TOC call within 48 hours of discharge',
          'Confirm follow-up appointment with cardiologist within 7 days',
          'Perform medication reconciliation post-discharge',
          'Educate on red-flag symptoms requiring ER visit (worsening SOB, chest pain, severe edema)',
          'Arrange home health skilled nursing if appropriate'
        ]
      },
      {
        id: 'chf-g3',
        description: 'Patient/caregiver verbalizes understanding of HF self-management',
        timeframe: '60 days',
        interventions: [
          'Provide HF education materials in preferred language',
          'Teach-back method for medication purpose and schedule',
          'Review HF zone tool (green/yellow/red symptom zones)',
          'Assess caregiver knowledge and involvement in care'
        ]
      }
    ]
  },
  {
    id: 'copd',
    healthConcern: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'Respiratory',
    icdCodes: ['J44.0', 'J44.1', 'J44.9'],
    goals: [
      {
        id: 'copd-g1',
        description: 'Reduce COPD exacerbations to < 2 per year',
        timeframe: '12 months',
        interventions: [
          'Verify proper inhaler technique at each contact - use teach-back',
          'Ensure patient has COPD action plan on file',
          'Coordinate pulmonology follow-up every 3-6 months',
          'Educate on trigger avoidance (smoke, allergens, cold air)',
          'Assess smoking status and refer to cessation program if applicable'
        ]
      },
      {
        id: 'copd-g2',
        description: 'Maintain oxygen saturation > 90% on current therapy',
        timeframe: '30 days',
        interventions: [
          'Coordinate DME for home oxygen if prescribed',
          'Educate on proper O2 use - flow rate, duration, safety',
          'Arrange home health respiratory therapy if ordered',
          'Monitor pulse oximetry readings at follow-up calls'
        ]
      },
      {
        id: 'copd-g3',
        description: 'Complete pulmonary rehabilitation program',
        timeframe: '90 days',
        interventions: [
          'Refer to outpatient pulmonary rehab program',
          'Coordinate transportation to rehab sessions',
          'Follow up on attendance and progress bi-weekly',
          'Reinforce breathing exercises (pursed-lip, diaphragmatic)'
        ]
      }
    ]
  },
  {
    id: 'hypertension',
    healthConcern: 'Essential Hypertension',
    category: 'Cardiovascular',
    icdCodes: ['I10'],
    goals: [
      {
        id: 'htn-g1',
        description: 'Maintain blood pressure < 130/80 mmHg',
        timeframe: '90 days',
        interventions: [
          'Educate on daily home BP monitoring - same time, resting 5 min prior',
          'Review DASH diet principles and sodium reduction',
          'Assess medication adherence and side effects at each contact',
          'Coordinate with PCP for medication titration if BP not at goal',
          'Encourage 150 min/week moderate exercise if medically cleared'
        ]
      },
      {
        id: 'htn-g2',
        description: 'Patient verbalizes 3 lifestyle modifications for BP control',
        timeframe: '30 days',
        interventions: [
          'Educate on sodium restriction (< 2300mg/day)',
          'Discuss weight management and BMI goal',
          'Address alcohol and caffeine consumption',
          'Provide stress management resources'
        ]
      }
    ]
  },
  {
    id: 'ckd',
    healthConcern: 'Chronic Kidney Disease',
    category: 'Renal',
    icdCodes: ['N18.3', 'N18.4', 'N18.5'],
    goals: [
      {
        id: 'ckd-g1',
        description: 'Slow CKD progression - maintain stable GFR',
        timeframe: '6 months',
        interventions: [
          'Coordinate quarterly renal function labs (BMP, GFR, urinalysis)',
          'Educate on renal diet - low sodium, potassium, phosphorus',
          'Ensure nephrology follow-up every 3-6 months',
          'Monitor BP and diabetes control as comorbid risk factors',
          'Review and avoid nephrotoxic medications (NSAIDs, contrast dye)'
        ]
      },
      {
        id: 'ckd-g2',
        description: 'Patient prepared for renal replacement therapy if CKD progresses',
        timeframe: '6 months',
        interventions: [
          'Refer to nephrology for dialysis access planning if GFR < 20',
          'Provide education on dialysis options (HD, PD, transplant)',
          'Coordinate AV fistula placement if indicated',
          'Connect with kidney transplant evaluation program',
          'Refer to renal dietitian'
        ]
      }
    ]
  },
  {
    id: 'depression',
    healthConcern: 'Major Depressive Disorder',
    category: 'Behavioral Health',
    icdCodes: ['F32.0', 'F32.1', 'F32.2', 'F33.0'],
    goals: [
      {
        id: 'dep-g1',
        description: 'PHQ-9 score reduced by 50% from baseline',
        timeframe: '90 days',
        interventions: [
          'Administer PHQ-9 screening at each contact',
          'Coordinate with PCP/psychiatry for antidepressant management',
          'Assess medication adherence and side effects',
          'Screen for suicidal ideation using Columbia Protocol at each contact',
          'Refer to behavioral health/therapy if not already engaged'
        ]
      },
      {
        id: 'dep-g2',
        description: 'Patient engaged in mental health treatment',
        timeframe: '30 days',
        interventions: [
          'Facilitate referral to licensed therapist (CBT preferred)',
          'Coordinate peer support or group therapy options',
          'Assess barriers to mental health treatment (stigma, cost, access)',
          'Provide crisis hotline numbers (988 Suicide & Crisis Lifeline)',
          'Educate on importance of medication compliance - no abrupt discontinuation'
        ]
      },
      {
        id: 'dep-g3',
        description: 'Improve functional status and daily activity engagement',
        timeframe: '60 days',
        interventions: [
          'Encourage daily physical activity - start with 10 min walks',
          'Assess sleep hygiene and address insomnia',
          'Identify social support system and encourage connection',
          'Refer to community mental health resources'
        ]
      }
    ]
  },
  {
    id: 'post-surgical',
    healthConcern: 'Post-Surgical Recovery',
    category: 'Surgical',
    icdCodes: ['Z96.641', 'Z96.642', 'Z96.651'],
    goals: [
      {
        id: 'surg-g1',
        description: 'Achieve safe home recovery with no surgical complications',
        timeframe: '30 days',
        interventions: [
          'Coordinate post-op follow-up with surgeon within 10-14 days',
          'Arrange home health PT/OT and skilled nursing',
          'Educate on wound care, signs of infection (redness, drainage, fever)',
          'Ensure DME is delivered prior to discharge (walker, commode, raised toilet seat)',
          'Review pain management plan and medication schedule'
        ]
      },
      {
        id: 'surg-g2',
        description: 'Restore functional mobility to baseline within 6 weeks',
        timeframe: '6 weeks',
        interventions: [
          'Monitor PT/OT progress at weekly CM calls',
          'Coordinate transition from home health to outpatient rehab',
          'Assess pain level at each contact - ensure adequate but not excessive pain control',
          'Educate on activity restrictions and weight-bearing precautions',
          'Evaluate home safety and fall prevention measures'
        ]
      }
    ]
  },
  {
    id: 'fall-risk',
    healthConcern: 'Fall Risk / Fall Prevention',
    category: 'Safety',
    icdCodes: ['R29.6', 'W19', 'Z91.81'],
    goals: [
      {
        id: 'fall-g1',
        description: 'Zero falls within 90 days',
        timeframe: '90 days',
        interventions: [
          'Conduct home safety assessment (rugs, lighting, grab bars, stairs)',
          'Review medications for fall-risk contributors (sedatives, diuretics, BP meds)',
          'Coordinate PT evaluation for balance and gait training',
          'Recommend appropriate assistive device (cane, walker)',
          'Ensure adequate footwear education (non-slip, supportive)'
        ]
      },
      {
        id: 'fall-g2',
        description: 'Patient verbalizes fall prevention strategies',
        timeframe: '30 days',
        interventions: [
          'Educate on fall risk factors specific to patient (medication, vision, gait)',
          'Teach safe transfer techniques and proper use of assistive devices',
          'Recommend vision exam if not completed in past year',
          'Assess vitamin D level and supplement if deficient',
          'Refer to community fall prevention program (e.g., Tai Chi, Matter of Balance)'
        ]
      }
    ]
  },
  {
    id: 'med-nonadherence',
    healthConcern: 'Medication Non-Adherence',
    category: 'Care Coordination',
    icdCodes: ['Z91.11', 'Z91.19'],
    goals: [
      {
        id: 'med-g1',
        description: 'Patient takes all prescribed medications as directed',
        timeframe: '60 days',
        interventions: [
          'Complete comprehensive medication reconciliation',
          'Identify barriers to adherence (cost, complexity, side effects, cognition)',
          'Coordinate with pharmacy for 90-day fills or mail-order',
          'Arrange pill organizer or blister packs if complexity is a barrier',
          'Educate on each medication purpose using teach-back method'
        ]
      },
      {
        id: 'med-g2',
        description: 'Pharmacy refill adherence rate > 80%',
        timeframe: '90 days',
        interventions: [
          'Request pharmacy refill history report',
          'Set up automatic refill reminders or pharmacy sync program',
          'Assess for medication assistance programs if cost is a barrier',
          'Coordinate with PCP to simplify medication regimen where possible',
          'Address health literacy and provide medication list in preferred language'
        ]
      }
    ]
  },
  {
    id: 'toc-readmission',
    healthConcern: 'Transitions of Care / Readmission Prevention',
    category: 'Care Coordination',
    icdCodes: ['Z87.898'],
    goals: [
      {
        id: 'toc-g1',
        description: 'Zero hospital readmissions within 30 days of discharge',
        timeframe: '30 days',
        interventions: [
          'Complete TOC call within 48 hours of discharge',
          'Perform medication reconciliation - compare discharge meds to home meds',
          'Confirm PCP follow-up within 7 days of discharge',
          'Arrange home health services if ordered',
          'Educate on red-flag symptoms and when to call provider vs. ER'
        ]
      },
      {
        id: 'toc-g2',
        description: 'All post-discharge services in place within 72 hours',
        timeframe: '72 hours',
        interventions: [
          'Verify DME delivery (oxygen, hospital bed, walker, etc.)',
          'Confirm home health start date and first visit',
          'Ensure discharge medications are obtained from pharmacy',
          'Coordinate transportation to follow-up appointments',
          'Assess caregiver readiness and home support adequacy'
        ]
      },
      {
        id: 'toc-g3',
        description: 'Patient demonstrates understanding of discharge plan',
        timeframe: '7 days',
        interventions: [
          'Review discharge instructions using teach-back method',
          'Provide written discharge summary in preferred language',
          'Educate on dietary restrictions related to diagnosis',
          'Verify patient has provider contact numbers for questions',
          'Schedule CM follow-up calls at days 3, 7, 14, and 30'
        ]
      }
    ]
  },
  {
    id: 'oncology',
    healthConcern: 'Cancer / Oncology Management',
    category: 'Oncology',
    icdCodes: ['C50.9', 'C34.9', 'C18.9', 'C61'],
    goals: [
      {
        id: 'onc-g1',
        description: 'Complete planned treatment regimen with minimal interruption',
        timeframe: '6 months',
        interventions: [
          'Coordinate with oncology team on treatment schedule',
          'Monitor for treatment side effects at each contact',
          'Facilitate prior authorizations for chemo/radiation if required',
          'Arrange transportation to treatment sessions',
          'Refer to oncology social worker for psychosocial support'
        ]
      },
      {
        id: 'onc-g2',
        description: 'Maintain adequate nutrition during treatment',
        timeframe: 'Duration of treatment',
        interventions: [
          'Refer to oncology nutritionist/dietitian',
          'Monitor weight and BMI trends',
          'Assess for nausea, appetite loss, taste changes',
          'Coordinate anti-nausea medication regimen with oncologist',
          'Evaluate need for oral nutritional supplements'
        ]
      },
      {
        id: 'onc-g3',
        description: 'Patient coping effectively with diagnosis',
        timeframe: '90 days',
        interventions: [
          'Screen for depression/anxiety with PHQ-2 and GAD-2 at each contact',
          'Refer to oncology support group or peer navigator',
          'Connect with American Cancer Society resources (wigs, financial aid)',
          'Assess and support caregiver burden',
          'Facilitate palliative care referral if appropriate'
        ]
      }
    ]
  },
  {
    id: 'sci-rehab',
    healthConcern: 'Spinal Cord Injury / Rehabilitation',
    category: 'Rehabilitation',
    icdCodes: ['T91.3', 'G82.20', 'G82.50'],
    goals: [
      {
        id: 'sci-g1',
        description: 'Achieve maximum functional independence (FIM > 100)',
        timeframe: '90 days',
        interventions: [
          'Coordinate with rehab team on therapy goals and progress',
          'Monitor FIM score trends weekly',
          'Facilitate peer mentor program connection',
          'Assess psychosocial adjustment and PTSD symptoms',
          'Coordinate vocational rehabilitation intake'
        ]
      },
      {
        id: 'sci-g2',
        description: 'Safe discharge home with necessary modifications',
        timeframe: '60 days',
        interventions: [
          'Arrange OT home evaluation for modifications (ramp, bathroom, doorways)',
          'Coordinate DME (wheelchair, hospital bed, shower chair)',
          'Assess caregiver training needs and schedule training sessions',
          'Research adaptive driving programs in patient area',
          'Connect with SCI community resources and support groups'
        ]
      },
      {
        id: 'sci-g3',
        description: 'Prevent secondary complications (skin breakdown, UTI, DVT)',
        timeframe: 'Ongoing',
        interventions: [
          'Educate on pressure relief schedule (weight shifts every 15-30 min)',
          'Teach skin inspection technique - use mirror for areas patient cannot see',
          'Ensure bladder management program is established and followed',
          'Monitor for signs of autonomic dysreflexia and educate patient/caregiver',
          'Coordinate outpatient urology and PM&R follow-up'
        ]
      }
    ]
  },
  {
    id: 'dementia',
    healthConcern: "Dementia / Alzheimer's Disease",
    category: 'Neurology',
    icdCodes: ['G30.0', 'G30.1', 'F03.90'],
    goals: [
      {
        id: 'dem-g1',
        description: 'Maintain safe living environment',
        timeframe: 'Ongoing',
        interventions: [
          'Conduct home safety assessment for wandering risk (door alarms, ID bracelet)',
          'Assess driving safety and recommend cessation if indicated',
          'Coordinate adult day program for structured activity and respite',
          'Register with Safe Return program (Alzheimer Association)',
          'Review medication management - assess need for caregiver-administered meds'
        ]
      },
      {
        id: 'dem-g2',
        description: 'Establish long-term care plan with family',
        timeframe: '60 days',
        interventions: [
          'Facilitate family meeting to discuss care options (in-home aide, ALF, memory care)',
          'Ensure POA/healthcare proxy documents are in place',
          'Provide education on disease progression and what to expect',
          'Coordinate Medicaid waiver application if eligible for home care services',
          'Connect with Alzheimer Association local chapter for support'
        ]
      },
      {
        id: 'dem-g3',
        description: 'Reduce caregiver burden and prevent burnout',
        timeframe: '30 days',
        interventions: [
          'Assess caregiver stress using Zarit Burden Interview',
          'Arrange respite care services',
          'Refer caregiver to support group',
          'Educate on behavioral management techniques (redirection, validation)',
          'Provide community resource guide for caregiver support'
        ]
      }
    ]
  },
  {
    id: 'obesity',
    healthConcern: 'Obesity / Weight Management',
    category: 'Endocrine',
    icdCodes: ['E66.01', 'E66.09', 'E66.9'],
    goals: [
      {
        id: 'ob-g1',
        description: 'Achieve 5-10% weight reduction from baseline',
        timeframe: '6 months',
        interventions: [
          'Refer to nutritionist/registered dietitian',
          'Set realistic weekly weight loss goal (1-2 lbs/week)',
          'Encourage food diary and review at each contact',
          'Coordinate with PCP regarding GLP-1 agonist therapy if BMI > 30',
          'Discuss bariatric surgery evaluation if BMI > 40 or > 35 with comorbidities'
        ]
      },
      {
        id: 'ob-g2',
        description: 'Engage in regular physical activity (150 min/week)',
        timeframe: '90 days',
        interventions: [
          'Assess current activity level and physical limitations',
          'Recommend starting with 10 min daily walks, gradually increasing',
          'Refer to community exercise program or Silver Sneakers',
          'Coordinate with PCP for exercise clearance if cardiac risk factors',
          'Provide motivational interviewing to support behavior change'
        ]
      }
    ]
  },
  {
    id: 'chronic-pain',
    healthConcern: 'Chronic Pain Management',
    category: 'Pain Management',
    icdCodes: ['G89.29', 'G89.4', 'M54.5'],
    goals: [
      {
        id: 'pain-g1',
        description: 'Reduce pain score by 2 points on 0-10 scale',
        timeframe: '90 days',
        interventions: [
          'Assess pain using validated scale at each contact (location, quality, severity, aggravating/relieving factors)',
          'Coordinate multimodal pain management plan with PCP/pain specialist',
          'Refer to physical therapy for therapeutic exercise program',
          'Educate on non-pharmacological pain management (heat/ice, relaxation, TENS)',
          'Monitor for opioid misuse risk if applicable - assess using ORT'
        ]
      },
      {
        id: 'pain-g2',
        description: 'Improve functional status despite chronic pain',
        timeframe: '60 days',
        interventions: [
          'Set functional goals with patient (e.g., walk to mailbox, prepare meals)',
          'Refer to cognitive behavioral therapy for pain (CBT-P)',
          'Assess impact of pain on sleep, mood, and daily activities',
          'Coordinate with pain management specialist for interventional options',
          'Screen for co-occurring depression with PHQ-2'
        ]
      }
    ]
  }
];
