import { ComboboxData } from "@mantine/core";
import {
  EColorCode,
  IMainOptions,
  IMoreFiltersOptions,
  ValueLabel,
} from "../types/fniDataTypes";
import { DefaultOptionType } from "antd/es/select";

export const claimSubTypeOptions: ValueLabel[] = [
  { value: "In-patient Hospitalization", label: "In patient hospitalization" },
  { value: "Critical Illness", label: "Critical Illness" },
  { value: "OPD", label: "OPD" },
  { value: "Travel", label: "Travel" },
  { value: "AHC", label: "AHC" },
  { value: "Miscellaneous", label: "Miscellaneous" },
  { value: "Pre-Post", label: "Pre-Post" },
  { value: "Hospital Daily Cash", label: "Hospital Daily Cash" },
  { value: "PA/CI", label: "PA/CI" },
];

export const moreFiltersOptions: IMoreFiltersOptions[] = [
  { value: "intimationDate", label: "Date of Int", type: "date" },
  { value: "dateOfOS", label: "Date of OS", type: "date" },
  {
    value: "dateOfFallingIntoPostQaBucket",
    label: "Date of Falling in Post QA",
    type: "date",
  },
  { value: "dateOfClosure", label: "Date of Closure", type: "date" },
  { value: "clusterManager", label: "Cluster Manager", type: "array" },
  { value: "claimInvestigators", label: "Field Investigator", type: "array" },
  { value: "lossType", label: "Loss Type", type: "select" },
  { value: "colorCode", label: "Color Code", type: "select" },
  { value: "openTAT", label: "Open TAT", type: "number" },
  { value: "closureTAT", label: "Closure TAT", type: "number" },
  {
    value: "hospitalDetails.providerState",
    label: "Provider State",
    type: "text",
  },
  {
    value: "hospitalDetails.providerCity",
    label: "Provider City",
    type: "text",
  },
  { value: "insuredDetails.state", label: "Insured State", type: "text" },
  { value: "insuredDetails.city", label: "Insured City", type: "text" },
  {
    value: "investigatorRecommendation",
    label: "Investigation Recommendation",
    type: "select",
  },
  {
    value: "intimationDateRange",
    label: "Intimation Date Range",
    type: "dateRange",
  },
  {
    value: "dateOfClosureRange",
    label: "Closure Date Range",
    type: "dateRange",
  },
  {
    value: "dateOfOSRange",
    label: "OS Date Range",
    type: "dateRange",
  },
  {
    value: "dateOfFallingIntoPostQaBucketRange",
    label: "Date Range of falling into post QA bucket",
    type: "dateRange",
  },
];

export const claimTypeOptions: ValueLabel[] = [
  { value: "PreAuth", label: "PreAuth" },
  { value: "Reimbursement", label: "Reimbursement" },
];

export const cashlessTypeOptions = [
  { value: "Admitted", label: "Admitted" },
  { value: "Planned", label: "Planned" },
  { value: "Post-Facto", label: "Post-Facto" },
  { value: "", label: "All" },
];

export const claimAmountOptions: ValueLabel[] = [
  { value: '{"$lt": 100000}', label: "Less than 1 Lakh" },
  { value: '{"$gte": 100000,"$lt": 500000}', label: "1 Lakh - 5 Lakhs" },
  { value: '{"$gte": 500000,"$lt": 1000000}', label: "5 Lakhs - 10 Lakhs" },
  { value: '{"$gte": 1000000,"$lt": 2000000}', label: "10 Lakhs - 20 Lakhs" },
  { value: '{"$gte": 2000000,"$lt": 5000000}', label: "20 Lakhs - 50 Lakhs" },
  { value: '{"$gte": 5000000}', label: "Greater than 50 Lakhs" },
];

export const lossTypeOptions: ValueLabel[] = [
  { value: "Accidental Death", label: "Personal Accident-Death" },
  { value: "Accidental PTD", label: "Personal Accident-PTD" },
];

export const colorCodeOptions: ValueLabel[] = [
  { value: EColorCode["PreAuth-Red"], label: EColorCode["PreAuth-Red"] },
  { value: EColorCode["PreAuth-Green"], label: EColorCode["PreAuth-Green"] },
  { value: EColorCode["PreAuth-Amber"], label: EColorCode["PreAuth-Amber"] },
  { value: EColorCode["RM-Green"], label: EColorCode["RM-Green"] },
  { value: EColorCode["RM-Red"], label: EColorCode["RM-Red"] },
  { value: EColorCode["RM-Amber"], label: EColorCode["RM-Amber"] },
  { value: EColorCode["PAOrCI-Green"], label: EColorCode["PAOrCI-Green"] },
  { value: EColorCode["PAOrCI-Red"], label: EColorCode["PAOrCI-Red"] },
  { value: EColorCode["PAOrCI-Amber"], label: EColorCode["PAOrCI-Amber"] },
];

export const investigatorRecommendationOptions: ValueLabel[] = [
  { value: "Genuine", label: "Genuine" },
  { value: "Repudiation", label: "Repudiation" },
  { value: "Inconclusive", label: "Inconclusive" },
];

export const benefitTypeOptions: ValueLabel[] = [
  { value: "Indemnity", label: "Indemnity" },
  { value: "Benefit", label: "Benefit" },
  { value: "Travel", label: "Travel" },
];

export const hospitalizationStatusOptions: ComboboxData = [
  { value: "Planned Admission", label: "Planned Admission" },
  { value: "Admitted", label: "Admitted" },
  { value: "Discharged", label: "Discharged" },
  { value: "Differed Admission", label: "Differed Admission" },
  { value: "Cancelled Admission", label: "Cancelled Admission" },
  {
    value: "Roaming around in/out Hospital",
    label: "Roaming around in/out Hospital",
  },
];

export const differedAdmissionOptions: ComboboxData = [
  {
    value: "Hospitalization Details confirmed",
    label: "Hospitalization Details confirmed",
  },
  {
    value: "Hospitalization Details not confirmed",
    label: "Hospitalization Details not confirmed",
  },
];

export const cancelledAdmissionOptions: ComboboxData = [
  {
    value: "Planned, but cancelled as pre-Auth denied",
    label: "Planned, but cancelled as pre-Auth denied",
  },
  { value: "Other", label: "Other" },
];

export const attendantDetailsOptions = [
  { value: "Available", label: "Available" },
  { value: "Not Available", label: "Not Available" },
  { value: "NA", label: "NA" },
];

export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Transgender", label: "Transgender" },
];

export const relationshipOptions: ComboboxData = [
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Spouse", label: "Spouse" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "In Law", label: "In Law" },
  { value: "Friend", label: "Friend" },
  { value: "Passerby", label: "Passerby" },
  { value: "Neighbor", label: "Neighbor" },
  { value: "Employer", label: "Employer" },
  { value: "Colleague", label: "Colleague" },
  { value: "Relative", label: "Relative" },
];

export const occupationOptions = [
  { value: "Self Employed", label: "Self Employed" },
  { value: "Govt. Employee", label: "Govt. Employee" },
  { value: "Pvt. Employee", label: "Pvt. Employee" },
  { value: "Home Maker", label: "Home Maker" },
  { value: "Business Man", label: "Business Man" },
  { value: "Retired", label: "Retired" },
  { value: "Not Disclosed", label: "Not Disclosed" },
];
export const otherPolicyWithNBHIOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Not Disclosed", label: "Not Disclosed" },
  { value: "NA", label: "NA" },
];

export const yesNoNAOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
];

export const yesNoOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export const classOfAccommodationOptions = [
  { value: "OT", label: "OT" },
  { value: "ICU", label: "ICU" },
  { value: "ICCU", label: "ICCU" },
  { value: "NICU", label: "NICU" },
  { value: "Suite", label: "Suite" },
  { value: "Private Deluxe", label: "Private Deluxe" },
  { value: "Deluxe", label: "Deluxe" },
  { value: "Twin Sharing", label: "Twin Sharing" },
  { value: "General Ward", label: "General Ward" },
  { value: "Other", label: "Other" },
];

export const personalHabitOptions = [
  { value: "NA", label: "NA" },
  { value: "Alcohol", label: "Alcohol" },
  { value: "Addiction to Drugs", label: "Addiction to Drugs" },
  { value: "Smoking", label: "Smoking" },
  { value: "Pan Masala/Tobacco Chewing", label: "Pan Masala/Tobacco Chewing" },
];
export const ailmentOptions = [
  { value: "HTN", label: "HTN" },
  { value: "DM on Insulin", label: "DM on Insulin" },
  { value: "DM Not on Insulin", label: "DM Not on Insulin" },
  { value: "Heart Related Disease", label: "Heart Related Disease" },
  { value: "Kidney Related Disease", label: "Kidney Related Disease" },
  { value: "Liver Related Disease", label: "Liver Related Disease" },
  {
    value: "Bone/Spine/Joints Related Disease",
    label: "Bone/Spine/Joints Related Disease",
  },
  { value: "Thyroid Disorders", label: "Thyroid Disorders" },
  {
    value: "Brain/Nervous System Related Disease",
    label: "Brain/Nervous System Related Disease",
  },
  {
    value: "Respiratory System Related Disease",
    label: "Respiratory System Related Disease",
  },
  { value: "Cancer", label: "Cancer" },
  {
    value: "Blood/Hematology System Related Disease",
    label: "Blood/Hematology System Related Disease",
  },
  { value: "STD", label: "STD" },
  {
    value: "Genital/Gynecological Disorder",
    label: "Genital/Gynecological Disorder",
  },
  {
    value: "External Congenital Anomaly",
    label: "External Congenital Anomaly",
  },
  {
    value: "Mental/Psychiatric Disorder",
    label: "Mental/Psychiatric Disorder",
  },
  {
    value: "Gastro-intestinal System/Digestive System Related Diseases",
    label: "Gastro-intestinal System/Digestive System Related Diseases",
  },
  {
    value: "Genetic/Hereditary Diseases",
    label: "Genetic/Hereditary Diseases",
  },
  { value: "Other- Please specify", label: "Other- Please specify" },
];

export const recommendationOptions: ComboboxData = [
  { value: "Genuine_ND", label: "Genuine" },
  { value: "Repudiation", label: "Repudiation" },
  { value: "Inconclusive_PD", label: "Inconclusive" },
];

export const recommendationProdOptions: ComboboxData = [
  { value: "Genuine_GC", label: "Genuine" },
  { value: "Repudiation", label: "Repudiation" },
  { value: "Inconclusive_AD", label: "Inconclusive" },
];

export const otherRecommendationOptions = [
  { value: "Provider", label: "Provider" },
  { value: "Sourcing", label: "Sourcing" },
  { value: "Policy", label: "Policy" },
  { value: "NA", label: "NA" },
];

export const otherRecommendationDetailsOptions = [
  { value: "NA", label: "NA" },
  { value: "Doubtful", label: "Doubtful" },
  { value: "Fraud", label: "Fraud" },
];

export const QAFRCUGroundOfRepudiationOptions: ComboboxData = [
  {
    value: "PED/NDC_FC",
    label: "PED/NDC",
  },
  {
    value: "OPD-IPD Conversion_FC",
    label: "OPD-IPD Conversion",
  },
  {
    value: "Hospitalization for Evaluation_FC",
    label: "Hospitalization for Evaluation",
  },
  {
    value: "Non Co-Operation_DN",
    label: "Non Co-Operation",
  },
  {
    value: "Fraud/Fabrication_FC",
    label: "Fraud/Fabrication",
  },
  {
    value: "Misrepresentation_FC",
    label: "Misrepresentation",
  },
  {
    value: "Suicidal Attempt/Suicide/Self Inflicted Injury_FC",
    label: "Suicidal Attempt/Suicide/Self Inflicted Injury",
  },
  {
    value: "Alcoholic Influence/Intoxication_DM",
    label: "Alcoholic Influence/Intoxication",
  },
  {
    value: "Infertility_DM",
    label: "Infertility",
  },
  {
    value: "Other_FC",
    label: "Other",
  },
];

export const QAFRCUGroundOfRepudiationProdOptions: ComboboxData = [
  {
    value: "PED/NDC_FP",
    label: "PED/NDC",
  },
  {
    value: "OPD-IPD Conversion_FP",
    label: "OPD-IPD Conversion",
  },
  {
    value: "Hospitalization for Evaluation_FP",
    label: "Hospitalization for Evaluation",
  },
  {
    value: "Non Co-Operation_NC",
    label: "Non Co-Operation",
  },
  {
    value: "Fraud/Fabrication_FP",
    label: "Fraud/Fabrication",
  },
  {
    value: "Misrepresentation_FP",
    label: "Misrepresentation",
  },
  {
    value: "Suicidal Attempt/Suicide/Self Inflicted Injury_FP",
    label: "Suicidal Attempt/Suicide/Self Inflicted Injury",
  },
  {
    value: "Alcoholic Influence/Intoxication_PE",
    label: "Alcoholic Influence/Intoxication",
  },
  {
    value: "Infertility_PE",
    label: "Infertility",
  },
  {
    value: "Other_FP",
    label: "Other",
  },
];

export const FRCUGroundOfRepudiationOptions: ComboboxData = [
  {
    value: "PED/NDC_FC",
    label: "PED/NDC",
  },
  {
    value: "OPD-IPD Conversion_FC",
    label: "OPD-IPD Conversion",
  },
  {
    value: "Hospitalization for Evaluation_FC",
    label: "Hospitalization for Evaluation",
  },
  {
    value: "Non Co-Operation_DN",
    label: "Non Co-Operation",
  },
  {
    value: "Fraud/Fabrication_FC",
    label: "Fraud/Fabrication",
  },
  {
    value: "Misrepresentation_FC",
    label: "Misrepresentation",
  },
  {
    value: "Suicidal Attempt/Suicide/Self Inflicted Injury_FC",
    label: "Suicidal Attempt/Suicide/Self Inflicted Injury",
  },
  {
    value: "Alcoholic Influence/Intoxication_DM",
    label: "Alcoholic Influence/Intoxication",
  },
  {
    value: "Infertility_DM",
    label: "Infertility",
  },
  {
    value: "Inflation",
    label: "Inflation",
  },
  {
    value: "Impersonation",
    label: "Impersonation",
  },
  {
    value: "Un-Recognized Provider",
    label: "Un-Recognized Provider",
  },
  {
    value: "Un-Preferred Provider",
    label: "Un-Preferred Provider",
  },
  {
    value: "Breach of Law with Criminal Intent",
    label: "Breach of Law with Criminal Intent",
  },
  {
    value: "Pre-Policy Death",
    label: "Pre-Policy Death",
  },
  {
    value: "Pre-Policy Accident",
    label: "Pre-Policy Accident",
  },
  {
    value: "Natural Death",
    label: "Natural Death",
  },
  {
    value: "Out of Scope of coverage",
    label: "Out of Scope of coverage",
  },
  {
    value: "Other_FC",
    label: "Other",
  },
];

export const FRCUGroundOfRepudiationProdOptions: ComboboxData = [
  {
    value: "PED/NDC_FP",
    label: "PED/NDC",
  },
  {
    value: "OPD-IPD Conversion_FP",
    label: "OPD-IPD Conversion",
  },
  {
    value: "Hospitalization for Evaluation_FP",
    label: "Hospitalization for Evaluation",
  },
  {
    value: "Non Co-Operation_NC",
    label: "Non Co-Operation",
  },
  {
    value: "Fraud/Fabrication_FP",
    label: "Fraud/Fabrication",
  },
  {
    value: "Misrepresentation_FP",
    label: "Misrepresentation",
  },
  {
    value: "Suicidal Attempt/Suicide/Self Inflicted Injury_FP",
    label: "Suicidal Attempt/Suicide/Self Inflicted Injury",
  },
  {
    value: "Alcoholic Influence/Intoxication_PE",
    label: "Alcoholic Influence/Intoxication",
  },
  {
    value: "Infertility_PE",
    label: "Infertility",
  },
  {
    value: "Inflation",
    label: "Inflation",
  },
  {
    value: "Impersonation",
    label: "Impersonation",
  },
  {
    value: "Un-Recognized Provider",
    label: "Un-Recognized Provider",
  },
  {
    value: "Un-Preferred Provider",
    label: "Un-Preferred Provider",
  },
  {
    value: "Breach of Law with Criminal Intent",
    label: "Breach of Law with Criminal Intent",
  },
  {
    value: "Pre-Policy Death",
    label: "Pre-Policy Death",
  },
  {
    value: "Pre-Policy Accident",
    label: "Pre-Policy Accident",
  },
  {
    value: "Natural Death",
    label: "Natural Death",
  },
  {
    value: "Out of Scope of coverage",
    label: "Out of Scope of coverage",
  },
  {
    value: "Other_FP",
    label: "Other",
  },
];
export const nonCooperationOfOptions = [
  { value: "Insured", label: "Insured" },
  { value: "Hospital", label: "Hospital" },
  { value: "Both", label: "Both" },
];

export const FRCUOptions: ComboboxData = [
  { value: "Genuine_ND", label: "Genuine" },
  { value: "Repudiation", label: "Repudiation" },
  { value: "Query to Raise_NC", label: "Query to Raise" },
  { value: "Partial Payment_DP", label: "Partial Payment" },
  { value: "Inconclusive_PD", label: "Inconclusive" },
];

export const FRCUProdOptions: ComboboxData = [
  { value: "Genuine_GC", label: "Genuine" },
  { value: "Repudiation", label: "Repudiation" },
  { value: "Query to Raise_QR", label: "Query to Raise" },
  { value: "Partial Payment_PP", label: "Partial Payment" },
  { value: "Inconclusive_AD", label: "Inconclusive" },
];
export const roleOptions: ComboboxData = [
  "Admin",
  "Allocation",
  "Post QA",
  "Post QA Lead",
  "Pre QC",
  "Internal Investigator",
  "External Investigator",
  "CFR",
  "TL",
  "Central Operation",
  "Cluster Manager",
  "NA",
];
export const claimAmountThresholdOptions: ComboboxData = [
  "Any Amount",
  "Bellow 1 Lac",
  "1 Lac to 5 Lacs",
  "5 Lacs to 10 Lacs",
  "10 Lacs to 20 Lacs",
  "20 Lacs to 50 Lacs",
  "Above 50 Lacs",
];
export const leadViewOptionsArray: ComboboxData = [
  { value: "PreAuth", label: "PreAuth" },
  { value: "Reimbursement", label: "Reimbursement" },
  { value: "Personal Accident", label: "Personal Accident" },
  { value: "Critical Illness", label: "Critical Illness" },
  { value: "AHC", label: "AHC" },
  { value: "HDC", label: "HDC" },
  { value: "Spot", label: "Spot" },
];
export const zoneOptions = [
  { value: "All", label: "All" },
  { value: "zone01", label: "North" },
  { value: "zone02", label: "South" },
  { value: "zone03", label: "East" },
  { value: "zone04", label: "West" },
  { value: "zone05", label: "Central" },
];

export const alcoholAddictionOptionsArray: ComboboxData = [
  {
    value: "Diagnosis- alcohol/addiction related",
    label: "Diagnosis- alcohol/addiction related",
  },
  {
    value: "Accident at Late evening/Night",
    label: "Accident at Late evening/Night",
  },
];

export const genuinenessOptionsArray: ComboboxData = [
  {
    value: "Scribbling/Overwriting/Cut-through observed",
    label: "Scribbling/Overwriting/Cut-through observed",
  },
  {
    value: "Inflation- bill looks higher for diagnosis and hospital",
    label: "Inflation- bill looks higher for diagnosis and hospital",
  },
  {
    value:
      "Inflation- LOS/Class of accommodation high for diagnosis and hospital",
    label:
      "Inflation- LOS/Class of accommodation high for diagnosis and hospital",
  },
  {
    value: "Direct admission and discharge from ICU",
    label: "Direct admission and discharge from ICU",
  },
  {
    value: "Delay in hospitalization from date of incidence",
    label: "Delay in hospitalization from date of incidence",
  },
  {
    value: "Treating Doctor/Pathologist suspicious",
    label: "Treating Doctor/Pathologist suspicious",
  },
  {
    value: "Medicine Bills in serial order",
    label: "Medicine Bills in serial order",
  },
  {
    value: "Handwritten Bill/Discharge Summary",
    label: "Handwritten Bill/Discharge Summary",
  },
  {
    value: "Direct admission without OPD",
    label: "Direct admission without OPD",
  },
  { value: "Multiple acute diagnosis", label: "Multiple acute diagnosis" },
  { value: "No supporting lab reports", label: "No supporting lab reports" },
  { value: "RTA with no MLC/FIR", label: "RTA with no MLC/FIR" },
  {
    value: "No time of admission/discharge",
    label: "No time of admission/discharge",
  },
  {
    value: "Suspicious Hospital- round the clock operation",
    label: "Suspicious Hospital- round the clock operation",
  },
  { value: "Suspicious Infrastructure", label: "Suspicious Infrastructure" },
  { value: "Others", label: "Others" },
];

export const mainPartOptions: ComboboxData = [
  {
    value: "Insured Part",
    label: "Insured Part",
  },
  {
    value: "Vicinity Check",
    label: "Vicinity Check",
  },
  {
    value: "Hospital Part",
    label: "Hospital Part",
  },
  {
    value: "Treating Doctor Part",
    label: "Treating Doctor Part",
  },
  {
    value: "Lab Part/Pathologist Part",
    label: "Lab Part/Pathologist Part",
  },
  {
    value: "Chemist Part",
    label: "Chemist Part",
  },
  {
    value: "Social Profiling/Social Media Profiling",
    label: "Social Profiling/Social Media Profiling",
  },
  {
    value: "Market/Industry Feedback- Insured/Proposer/Corporate",
    label: "Market/Industry Feedback- Insured/Proposer/Corporate",
  },
  {
    value: "Market/Industry Feedback- Hospital/Doctor/Pathologist",
    label: "Market/Industry Feedback- Hospital/Doctor/Pathologist",
  },
  {
    value: "Loss Location Check",
    label: "Loss Location Check",
  },
  {
    value: "Miscellaneous Part",
    label: "Miscellaneous Part",
  },
];

export const mainPartRMOptions: ComboboxData = [
  "NPS Confirmation",
  "Pre-Post Verification",
  "Hospital Daily Cash Part",
  "OPD Verification Part",
  "AHC Verification Part",
  "Claim Verification",
  "Insured Verification",
  "Vicinity Verification",
  "Hospital Verification",
  "Treating Doctor Verification",
  "Family Doctor Part/Referring Doctor Verification",
  "Lab Part/Pathologist Verification",
  "Chemist Verification",
  "Employer Verification",
  "Random Vicinity Hospital/Lab/Doctor/Chemist Verification",
  "Miscellaneous Verification",
  "Employment & Establishment Verification",
];

export const insuredOptionsArray: ComboboxData = [
  {
    value: "insuredPart",
    label: "Insured Part",
  },
  {
    value: "claimantPart",
    label: "Claimant Part",
  },
  {
    value: "insuredAdressCheck",
    label: "Insured address check",
  },
  {
    value: "claimantAddressCheck",
    label: "Claimant address check",
  },
];

export const miscOptionsArray: ComboboxData = [
  {
    value: "firstTreatingHopitalPart",
    label: "First Treating Hospital Part",
  },
  {
    value: "vicinityMedicalFacilitiesCheck",
    label: "Vicinity Medical Facilities Check",
  },
  {
    value: "treatingDoctorMCIRegistrationCheck",
    label: "Treating Doctor MCI Registration Check",
  },
  {
    value: "familyDoctorPart",
    label: "Family Doctor Part",
  },
  {
    value: "corporateAddressCheck",
    label: "Corporate address check",
  },
  {
    value: "employerPart",
    label: "Employer Part",
  },
  {
    value: "involvedVehiclesCheck",
    label: "Involved Vehicles Check",
  },
  {
    value: "policeStationCheck",
    label: "Police Station Check",
  },
  {
    value: "autopsyOrPostMortemHospitalCheck",
    label: "Autopsy/Post Mortem Hospital Check",
  },
  {
    value: "municipalCorporationCheck",
    label: "Municipal Corporation Check",
  },
  {
    value: "eyeWitnessCheck",
    label: "Eye Witness check",
  },
  {
    value: "burningGhatCheck",
    label: "Burning Ghat Check",
  },
  {
    value: "railwayAuthority",
    label: "Railway Authority",
  },
  {
    value: "fireStation",
    label: "Fire Station",
  },
  {
    value: "electriciyDepartment",
    label: "Electricity Department",
  },
  {
    value: "incomeTaxDepartment",
    label: "Income Tax Department",
  },
  {
    value: "others",
    label: "Other- Please specify",
  },
];

export const mainDropdownOptions: ComboboxData = [
  { value: "PED/NDC", label: "PED/NDC" },
  { value: "Genuineness", label: "Genuineness" },
  {
    value: "Alcohol Intoxication/Addiction",
    label: "Alcohol Intoxication/Addiction",
  },
  { value: "Infertility", label: "Infertility" },
  { value: "Employment & Establishment", label: "Employment & Establishment" },
  {
    value: "Self Inflicted Injury/Attempt to suicide/Suicide",
    label: "Self Inflicted Injury/Attempt to suicide/Suicide",
  },
  { value: "Others", label: "Others" },
];

export const pedOptionsArray: ComboboxData = [
  {
    value: "Close proximity- no disclosure",
    label: "Close proximity- no disclosure",
  },
  {
    value: "Other possible Non-Disclosure",
    label: "Other possible Non-Disclosure",
  },
  {
    value: "History available no duration",
    label: "History available no duration",
  },
  {
    value: "Diagnosis with high possibility of PED/NDC",
    label: "Diagnosis with high possibility of PED/NDC",
  },
  {
    value: "History available with duration",
    label: "History available with duration",
  },
  {
    value: "Old age with no co-morbidity",
    label: "Old age with no co-morbidity",
  },
  { value: "Others", label: "Others" },
];

export const insuredPartDocNames = [
  {
    value: "Claimant Statement",
    label: "Claimant Statement",
  },
  {
    value: "KYC Documents - Insured",
    label: "KYC Documents - Insured",
  },
  {
    value: "KYC Documents - Claimant",
    label: "KYC Documents - Claimant",
  },
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Bank Statement of Insured",
    label: "Bank Statement of Insured",
  },
  {
    value: "Bank Statement of Claimant",
    label: "Bank Statement of Claimant",
  },
  {
    value: "Appointment Letter/Offer Letter",
    label: "Appointment Letter/Offer Letter",
  },
  {
    value: "Resignation Letter",
    label: "Resignation Letter",
  },
  {
    value: "Employee ID Card",
    label: "Employee ID Card",
  },
  {
    value: "Relieving Letter",
    label: "Relieving Letter",
  },
  {
    value: "Salary Slips",
    label: "Salary Slips",
  },
  {
    value: "Loan Account Statement",
    label: "Loan Account Statement",
  },
  {
    value: "Other Health Insurance/Claims Records",
    label: "Other Health Insurance/Claims Records",
  },
  {
    value: "Consent Letter",
    label: "Consent Letter",
  },
  {
    value: "Scar Mark Photo/Proof",
    label: "Scar Mark Photo/Proof",
  },
  {
    value: "Attendance Records",
    label: "Attendance Records",
  },
  {
    value: "Payment Receipts",
    label: "Payment Receipts",
  },
  {
    value: "Referral Slip",
    label: "Referral Slip",
  },
  {
    value: "OPD Consultations",
    label: "OPD Consultations",
  },
  {
    value: "Past Treatment Records",
    label: "Past Treatment Records",
  },
  {
    value: "Feedback Form",
    label: "Feedback Form",
  },
  {
    value: "Ambulance Receipts",
    label: "Ambulance Receipts",
  },
  {
    value: "DL Copy",
    label: "DL Copy",
  },
  {
    value: "RC Copy",
    label: "RC Copy",
  },
  {
    value: "Vehicle Insurance",
    label: "Vehicle Insurance",
  },
  {
    value: "Pollution Certificate",
    label: "Pollution Certificate",
  },
  {
    value: "Vehicle Repair Bill",
    label: "Vehicle Repair Bill",
  },
  {
    value: "Vehicle Photograph",
    label: "Vehicle Photograph",
  },
  {
    value: "Vehicle Fitness Certificate",
    label: "Vehicle Fitness Certificate",
  },
  {
    value: "Copy of MLC",
    label: "Copy of MLC",
  },
  {
    value: "Medical Records",
    label: "Medical Records",
  },
  {
    value: "Past Medical Records/Consultation Papers",
    label: "Past Medical Records/Consultation Papers",
  },
  {
    value: "Details of Corporate Policy/Claims",
    label: "Details of Corporate Policy/Claims",
  },
  {
    value: "Copy of OPD Papers/Records",
    label: "Copy of OPD Papers/Records",
  },
  {
    value: "Copy of Purchase Invoice",
    label: "Copy of Purchase Invoice",
  },
  {
    value: "Death Certificate",
    label: "Death Certificate",
  },
  {
    value: "Medical Cause of Death Certificate",
    label: "Medical Cause of Death Certificate",
  },
  {
    value: "Form IV-A",
    label: "Form IV-A",
  },
  {
    value: "Burning Ghat Receipts",
    label: "Burning Ghat Receipts",
  },
  {
    value: "FIR",
    label: "FIR",
  },
  {
    value: "Police Final Report",
    label: "Police Final Report",
  },
  {
    value: "Police Proceedings/Inquest Panchnama , 174 Cr. PC documents",
    label: "Police Proceedings/Inquest Panchnama , 174 Cr. PC documents",
  },
  {
    value: "FSL Report",
    label: "FSL Report",
  },
  {
    value: "Guard/Station Master Memo",
    label: "Guard/Station Master Memo",
  },
  {
    value: "ITR Copy",
    label: "ITR Copy",
  },
  {
    value: "Diatom Test Report",
    label: "Diatom Test Report",
  },
  {
    value: "Forensic Report",
    label: "Forensic Report",
  },
  {
    value: "MACT Application and Award Copy",
    label: "MACT Application and Award Copy",
  },
  {
    value: "MVI Inspection Report",
    label: "MVI Inspection Report",
  },
  {
    value: "Verified Post Mortem Report",
    label: "Verified Post Mortem Report",
  },
  {
    value: "Copy of PM Register",
    label: "Copy of PM Register",
  },
  {
    value: "Written confirmation of PM Doctor",
    label: "Written confirmation of PM Doctor",
  },
  {
    value: "Embalming Certificate",
    label: "Embalming Certificate",
  },
  {
    value: "Legal Heir/Succession Certificate",
    label: "Legal Heir/Succession Certificate",
  },
  {
    value: "Insured Photo",
    label: "Insured Photo",
  },
  {
    value: "Claimant Photo",
    label: "Claimant Photo",
  },
  {
    value: "Bed Rest Certificate",
    label: "Bed Rest Certificate",
  },
  {
    value: "Disability Certificate",
    label: "Disability Certificate",
  },
  {
    value: "Dying Declaration/Dying Disposition",
    label: "Dying Declaration/Dying Disposition",
  },
  {
    value: "Electricity Board Inspection Report",
    label: "Electricity Board Inspection Report",
  },
  {
    value: "Fire Inspection Report",
    label: "Fire Inspection Report",
  },
];

export const vicinityCheckDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Past Treatment Records",
    label: "Past Treatment Records",
  },
  {
    value: "Medical Records",
    label: "Medical Records",
  },
];

export const hospitalPartDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Payment Receipts",
    label: "Payment Receipts",
  },
  {
    value: "Referral Slip",
    label: "Referral Slip",
  },
  {
    value: "OPD Consultations",
    label: "OPD Consultations",
  },
  {
    value: "Past Treatment Records",
    label: "Past Treatment Records",
  },
  {
    value: "Ambulance Receipts",
    label: "Ambulance Receipts",
  },
  {
    value: "Medical Records",
    label: "Medical Records",
  },
  {
    value: "Copy of MLC",
    label: "Copy of MLC",
  },
  {
    value: "Past Medical Records/Consultation Papers",
    label: "Past Medical Records/Consultation Papers",
  },
  {
    value: "Copy of IPD Register/Entry",
    label: "Copy of IPD Register/Entry",
  },
  {
    value: "Verified copy/Carbon Copy Bills",
    label: "Verified copy/Carbon Copy Bills",
  },
  {
    value: "Copy of OPD Papers/Records",
    label: "Copy of OPD Papers/Records",
  },
  {
    value: "Copy of Purchase Invoice",
    label: "Copy of Purchase Invoice",
  },
  {
    value: "Medical Cause of Death Certificate",
    label: "Medical Cause of Death Certificate",
  },
  {
    value: "Form IV-A",
    label: "Form IV-A",
  },
  {
    value: "Bed Rest Certificate",
    label: "Bed Rest Certificate",
  },
  {
    value: "Disability Certificate",
    label: "Disability Certificate",
  },
];

export const treatingDoctorDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Past Treatment Records",
    label: "Past Treatment Records",
  },
  {
    value: "Medical Records",
    label: "Medical Records",
  },
  {
    value: "Treating Doctor snap from NMC",
    label: "Treating Doctor snap from NMC",
  },
  {
    value: "Treating Doctor Statement",
    label: "Treating Doctor Statement",
  },
  {
    value: "Past Medical Records/Consultation Papers",
    label: "Past Medical Records/Consultation Papers",
  },
];

export const labOrPathologistDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Payment Receipts",
    label: "Payment Receipts",
  },
  {
    value: "Copy of Lab Reports verified",
    label: "Copy of Lab Reports verified",
  },
  {
    value: "Copy of Lab Bills verified/carbon copy/e-records",
    label: "Copy of Lab Bills verified/carbon copy/e-records",
  },
  {
    value: "Pathologist Confirmation",
    label: "Pathologist Confirmation",
  },
];

export const chemistDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Payment Receipts",
    label: "Payment Receipts",
  },
  {
    value: "Copy of Purchase Invoice",
    label: "Copy of Purchase Invoice",
  },
];

export const socialProfilingDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
];

export const marketCorporateDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Appointment Letter/Offer Letter",
    label: "Appointment Letter/Offer Letter",
  },
  {
    value: "Resignation Letter",
    label: "Resignation Letter",
  },
  {
    value: "Employee ID Card",
    label: "Employee ID Card",
  },
  {
    value: "Relieving Letter",
    label: "Relieving Letter",
  },
  {
    value: "Salary Slips",
    label: "Salary Slips",
  },
  {
    value: "Attendance Records",
    label: "Attendance Records",
  },
];
export const marketPathologistDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Past Treatment Records",
    label: "Past Treatment Records",
  },
  {
    value: "Details of Corporate Policy/Claims",
    label: "Details of Corporate Policy/Claims",
  },
];
export const lossLocationDocNames = [
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
];
export const miscPartDocNames = [
  {
    value: "Miscellaneous Verification Documents",
    label: "Miscellaneous Verification Documents",
  },
  {
    value: "Customer Feedback Form",
    label: "Customer Feedback Form",
  },
  {
    value: "GPS Photo",
    label: "GPS Photo",
  },
  {
    value: "Call Recording",
    label: "Call Recording",
  },
  {
    value: "AVR",
    label: "AVR",
  },
  {
    value: "Ambulance Receipts",
    label: "Ambulance Receipts",
  },
  {
    value: "DL Copy",
    label: "DL Copy",
  },
  {
    value: "RC Copy",
    label: "RC Copy",
  },
  {
    value: "Vehicle Insurance",
    label: "Vehicle Insurance",
  },
  {
    value: "Pollution Certificate",
    label: "Pollution Certificate",
  },
  {
    value: "Vehicle Repair Bill",
    label: "Vehicle Repair Bill",
  },
  {
    value: "Vehicle Photograph",
    label: "Vehicle Photograph",
  },
  {
    value: "Vehicle Fitness Certificate",
    label: "Vehicle Fitness Certificate",
  },
  {
    value: "Copy of MLC",
    label: "Copy of MLC",
  },
  {
    value: "Treating Doctor snap from NMC",
    label: "Treating Doctor snap from NMC",
  },
  {
    value: "Past Medical Records/Consultation Papers",
    label: "Past Medical Records/Consultation Papers",
  },
  {
    value: "Copy of OPD Papers/Records",
    label: "Copy of OPD Papers/Records",
  },
  {
    value: "Copy of Purchase Invoice",
    label: "Copy of Purchase Invoice",
  },
  {
    value: "Death Certificate",
    label: "Death Certificate",
  },
  {
    value: "Medical Cause of Death Certificate",
    label: "Medical Cause of Death Certificate",
  },
  {
    value: "Form IV-A",
    label: "Form IV-A",
  },
  {
    value: "Burning Ghat Receipts",
    label: "Burning Ghat Receipts",
  },
  {
    value: "FIR",
    label: "FIR",
  },
  {
    value: "Police Final Report",
    label: "Police Final Report",
  },
  {
    value: "Police Proceedings/Inquest Panchnama ",
    label: "Police Proceedings/Inquest Panchnama ",
  },
  {
    value: " 174 Cr. PC documents",
    label: " 174 Cr. PC documents",
  },
  {
    value: "FSL Report",
    label: "FSL Report",
  },
  {
    value: "Guard/Station Master Memo",
    label: "Guard/Station Master Memo",
  },
  {
    value: "ITR Copy",
    label: "ITR Copy",
  },
  {
    value: "Anganwaudi/ASHA Worker Statement",
    label: "Anganwaudi/ASHA Worker Statement",
  },
  {
    value: "Anganwaudi/ASHA Worker Register",
    label: "Anganwaudi/ASHA Worker Register",
  },
  {
    value: "Sarpanch Statement",
    label: "Sarpanch Statement",
  },
  {
    value: "Diatom Test Report",
    label: "Diatom Test Report",
  },
  {
    value: "Forensic Report",
    label: "Forensic Report",
  },
  {
    value: "MACT Application and Award Copy",
    label: "MACT Application and Award Copy",
  },
  {
    value: "MVI Inspection Report",
    label: "MVI Inspection Report",
  },
  {
    value: "Verified Post Mortem Report",
    label: "Verified Post Mortem Report",
  },
  {
    value: "Copy of PM Register",
    label: "Copy of PM Register",
  },
  {
    value: "Written confirmation of PM Doctor",
    label: "Written confirmation of PM Doctor",
  },
  {
    value: "Embalming Certificate",
    label: "Embalming Certificate",
  },
  {
    value: "Legal Heir/Succession Certificate",
    label: "Legal Heir/Succession Certificate",
  },
  {
    value: "Bed Rest Certificate",
    label: "Bed Rest Certificate",
  },
  {
    value: "Disability Certificate",
    label: "Disability Certificate",
  },
  {
    value: "Dying Declaration/Dying Disposition ",
    label: "Dying Declaration/Dying Disposition ",
  },
  {
    value: "Electricity Board Inspection Report",
    label: "Electricity Board Inspection Report",
  },
  {
    value: "Fire Inspection Report",
    label: "Fire Inspection Report",
  },
];

const preAuthInvestigationDocNames = [
  {
    label: "Insured/Attendant Part Documents",
    value: "Insured/Attendant Part Documents",
  },
  {
    label: "Hospital Part Documents",
    value: "Hospital Part Documents",
  },
  {
    label: "GPS Location",
    value: "GPS Location",
  },
  {
    label: "MLC/FIR Copy",
    value: "MLC/FIR Copy",
  },
  {
    label: "Treating Doctor Part Documents",
    value: "Treating Doctor Part Documents",
  },
  {
    label: "Employer Part Documents",
    value: "Employer Part Documents",
  },
  {
    label: "Other",
    value: "Other",
  },
];

export const mainObjectOptionsMap: IMainOptions[] = [
  {
    name: "Insured Part",
    options: insuredPartDocNames,
  },
  {
    name: "Vicinity Check",
    options: vicinityCheckDocNames,
  },
  {
    name: "Hospital Part",
    options: hospitalPartDocNames,
  },
  {
    name: "Treating Doctor Part",
    options: treatingDoctorDocNames,
  },
  {
    name: "Lab Part/Pathologist Part",
    options: labOrPathologistDocNames,
  },
  {
    name: "Chemist Part",
    options: chemistDocNames,
  },
  {
    name: "Social Profiling/Social Media Profiling",
    options: socialProfilingDocNames,
  },
  {
    name: "Market/Industry Feedback- Insured/Proposer/Corporate",
    options: marketCorporateDocNames,
  },
  {
    name: "Market/Industry Feedback- Hospital/Doctor/Pathologist",
    options: marketPathologistDocNames,
  },
  {
    name: "Loss Location Check",
    options: lossLocationDocNames,
  },
  {
    name: "Pre-Auth Investigation",
    options: preAuthInvestigationDocNames,
  },
  {
    name: "Miscellaneous Part",
    options: miscPartDocNames,
  },
];

export const rmMainObjectOptionsMap: IMainOptions[] = [
  {
    name: "NPS Confirmation",
    options: [],
  },
  {
    name: "Pre-Post Verification",
    options: [
      {
        label: "Pre-Post Verification Documents",
        value: "Pre-Post Verification Documents",
      },
    ],
  },
  {
    name: "Hospital Daily Cash Part",
    options: [
      {
        label: "Hospital Daily Cash Verification Documents",
        value: "Hospital Daily Cash Verification Documents",
      },
    ],
  },
  {
    name: "OPD Verification Part",
    options: [
      {
        label: "OPD verification Documents",
        value: "OPD verification Documents",
      },
    ],
  },
  {
    name: "AHC Verification Part",
    options: [
      {
        label: "AHC verification Documents",
        value: "AHC verification Documents",
      },
    ],
  },
  {
    name: "Claim Verification",
    options: [{ label: "Claim Verification", value: "Claim Verification" }],
  },
  {
    name: "Insured Verification",
    options: [
      {
        label: "Insured Verification Documents",
        value: "Insured Verification Documents",
      },
    ],
  },
  {
    name: "Vicinity Verification",
    options: [
      {
        label: "Vicinity Verification Documents",
        value: "Vicinity Verification Documents",
      },
    ],
  },
  {
    name: "Hospital Verification",
    options: [
      {
        label: "Hospital Verification Documents",
        value: "Hospital Verification Documents",
      },
    ],
  },
  {
    name: "Treating Doctor Verification",
    options: [
      {
        label: "Treating Doctor Verification Document",
        value: "Treating Doctor Verification Document",
      },
    ],
  },
  {
    name: "Family Doctor Part/Referring Doctor Verification",
    options: [
      {
        label: "Family Doctor Part/Referring Doctor Verification",
        value: "Family Doctor Part/Referring Doctor Verification",
      },
    ],
  },
  {
    name: "Lab Part/Pathologist Verification",
    options: [
      {
        label: "Lab Part/Pathologist Verification Documents",
        value: "Lab Part/Pathologist Verification Documents",
      },
    ],
  },
  {
    name: "Chemist Verification",
    options: [
      {
        label: "Chemist Verification Documents",
        value: "Chemist Verification Documents",
      },
    ],
  },
  {
    name: "Employer Verification",
    options: [
      { label: "Employer Verification", value: "Employer Verification" },
    ],
  },
  {
    name: "Random Vicinity Hospital/Lab/Doctor/Chemist Verification",
    options: [
      {
        label: "Random Vicinity Hospital/Lab/Doctor/Chemist Verification",
        value: "Random Vicinity Hospital/Lab/Doctor/Chemist Verification",
      },
    ],
  },
  {
    name: "Employment & Establishment Verification",
    options: [
      {
        label: "Employment & Establishment Verification",
        value: "Employment & Establishment Verification",
      },
    ],
  },
  {
    name: "Miscellaneous Verification",
    options: miscPartDocNames,
  },
];

export const rejectionReasonsOptions = [
  { value: "Vintage Policy-First Claim", label: "Vintage Policy-First Claim" },
  {
    value: "Claim after Moratorium period-triggered for PED/NDC",
    label: "Claim after Moratorium period-triggered for PED/NDC",
  },
  {
    value: "Claim for MHD/Chemo/Radio-first claim investigated",
    label: "Claim for MHD/Chemo/Radio-first claim investigated",
  },
  {
    value: "Spot investigated",
    label: "Spot investigated",
  },
  {
    value: "Previous claims investigated- no anomalies",
    label: "Previous claims investigated- no anomalies",
  },
  {
    value: "Demographic challenge",
    label: "Demographic challenge",
  },
  {
    value: "OPD/AHC Claim",
    label: "OPD/AHC Claim",
  },
  {
    value: "Duplicate Claim, same claim investigated/under investigate",
    label: "Duplicate Claim, same claim investigated/under investigate",
  },
  {
    value: "Claim team requested not to investigate",
    label: "Claim team requested not to investigate",
  },
  {
    value: "Basis claim under IRDA esclaation/Legal",
    label: "Basis claim under IRDA esclaation/Legal",
  },
  {
    value: "Others",
    label: "Others",
  },
];

export const groundOfRepudiationOptions = [
  { value: "PED/NDC", label: "PED/NDC" },
  {
    value: "OPD-IPD Conversion/Hospitalization fro evaluation",
    label: "OPD-IPD Conversion/Hospitalization fro evaluation",
  },
  { value: "Non Co-Operation", label: "Non Co-Operation" },
  {
    value: "Fraud/Fabrication/Misrepresentation",
    label: "Fraud/Fabrication/Misrepresentation",
  },
  {
    value: "Alcoholic Influence/Intoxication",
    label: "Alcoholic Influence/Intoxication",
  },
  {
    value: "Suicidal Attempt/Suicide/Self Inflicted Injury",
    label: "Suicidal Attempt/Suicide/Self Inflicted Injury",
  },
  { value: "Infertility", label: "Infertility" },
  { value: "Other", label: "Other" },
];

export const doneNotDoneOptions = [
  { value: "Done", label: "Done" },
  { value: "Not Done", label: "Not Done" },
];

export const yesNAOptions = [
  { value: "Yes", label: "Yes" },
  { value: "NA", label: "NA" },
];

export const doctorQualificationOptions = [
  { value: "Modern Medicine", label: "Modern Medicine" },
  { value: "AYUSH", label: "AYUSH" },
  { value: "No clue", label: "No clue" },
];

export const doctorRegNoOptions = [
  { value: "Available", label: "Available" },
  { value: "Not Available", label: "Not Available" },
  { value: "Not Shared", label: "Not Shared" },
];

export const meetingStatusOptions = [
  { value: "Untraceable", label: "Untraceable" },
  { value: "Traceable", label: "Traceable" },
];

export const reportsSignedByOptions = [
  { value: "Not signed", label: "Not signed" },
  {
    value: "Signed- but no credentials available",
    label: "Signed- but no credentials available",
  },
  { value: "Signed by DMLT", label: "Signed by DMLT" },
  { value: "Signed by Pathologist", label: "Signed by Pathologist" },
  { value: "Signed by Radiologist", label: "Signed by Radiologist" },
];

export const labReportsOptions = [
  { value: "Verified", label: "Verified" },
  { value: "Not Verified", label: "Not Verified" },
  { value: "Non Co-operation", label: "Non Co-operation" },
  { value: "NA", label: "NA" },
];

export const billsVerifiedOptions = [
  { value: "Yes- Non Discrepant", label: "Yes- Non Discrepant" },
  { value: "Yes- Discrepant", label: "Yes- Discrepant" },
  { value: "No", label: "No" },
  { value: "Non Co-operation", label: "Non Co-operation" },
  { value: "NA", label: "NA" },
];

export const establishmentVerificationOptions = [
  {
    value: "Exist on the address as per contract",
    label: "Exist on the address as per contract",
  },
  {
    value: "Does Not Exist on the address as per contract",
    label: "Does Not Exist on the address as per contract",
  },
];

export const establishmentStatusOptions = [
  {
    label: "Exists on another address",
    value: "Exists on another address",
  },
  {
    label: "Does not exist on any address",
    value: "Does not exist on any address",
  },
];

export const paymentMethodOptions = [
  { value: "Wallet", label: "Wallet" },
  { value: "Card", label: "Card" },
  { value: "NEFT", label: "NEFT" },
  { value: "RTGS", label: "RTGS" },
  { value: "Cash", label: "Cash" },
  { value: "Mix", label: "Mix" },
];

export const hospitalInfrastructureOptions = [
  { value: "Poor Setup", label: "Poor Setup" },
  { value: "Primary Care", label: "Primary Care" },
  { value: "Secondary Care", label: "Secondary Care" },
  { value: "Tertiary Care", label: "Tertiary Care" },
];

export const establishmentTypeOptions = [
  { label: "Prop. firm", value: "Prop. firm" },
  { label: "Partnership Firm", value: "Partnership Firm" },
  { label: "Pvt. Ltd.", value: "Pvt. Ltd." },
  { label: "Ltd.", value: "Ltd." },
  { label: "LLP", value: "LLP" },
  { label: "NGO", value: "NGO" },
  { label: "Trust", value: "Trust" },
];

export const empRelationshipOptions = [
  { label: "Employees", value: "Employees" },
  { label: "Family Members", value: "Family Members" },
  { label: "Friends", value: "Friends" },
  { label: "Relatives", value: "Relatives" },
];

export const refundInvoiceOptions = [
  { value: "Collected", label: "Collected" },
  { value: "Not Shared", label: "Not Shared" },
  { value: "Not available with insured", label: "Not available with insured" },
];

export const icpsCollectedOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "No Records", label: "No Records" },
  { value: "Not Shared", label: "Not Shared" },
];

export const consultationOrFollowupOptions = [
  { value: "Discrepant", label: "Discrepant" },
  { value: "Non Discrepant", label: "Non Discrepant" },
  { value: "Non Co-operation", label: "Non Co-operation" },
];

export const consultationIsRelatedToDiagnosisOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Non Co-operation", label: "Non Co-operation" },
];

export const scanResultOptions = [
  { value: "No details fetched", label: "No details fetched" },
  { value: "Scan- discrepant bill", label: "Scan- discrepant bill" },
  { value: "Scan – Non Discrepant Bil", label: "Scan – Non Discrepant Bil" },
];

export const discrepancyStatusOptions = [
  { value: "Discrepant", label: "Discrepant" },
  { value: "Non Discrepant", label: "Non Discrepant" },
];

export const billVerificationResultOptions = [
  { value: "Pharmacy does not exist", label: "Pharmacy does not exist" },
  { value: "Bills are forged", label: "Bills are forged" },
  { value: "Name mismatch", label: "Name mismatch" },
  { value: "Date Mismatch", label: "Date Mismatch" },
  { value: "Amount Mismatch", label: "Amount Mismatch" },
  { value: "Content Mismatch", label: "Content Mismatch" },
  { value: "No records available", label: "No records available" },
  { value: "Others", label: "Others" },
];

export const labBillVerificationResultOptions = [
  { value: "Lab does not exist", label: "Lab does not exist" },
  { value: "Bills are forged", label: "Bills are forged" },
  { value: "Reports are forged", label: "Reports are forged" },
  { value: "Name mismatch", label: "Name mismatch" },
  { value: "Date Mismatch", label: "Date Mismatch" },
  { value: "Amount Mismatch", label: "Amount Mismatch" },
  { value: "Content Mismatch", label: "Content Mismatch" },
  {
    value: "Pathologist denied association/signature of report/test performed",
    label: "Pathologist denied association/signature of report/test performed",
  },
  { value: "No records available", label: "No records available" },
  { value: "Others", label: "Others" },
];

export const hospitalSpecialtyOptions = [
  { value: "Single", label: "Single" },
  { value: "Multi", label: "Multi" },
];

export const medicinesOptions = [
  { value: "In-house", label: "In-house" },
  { value: "Outsourced", label: "Outsourced" },
];

export const hospitalOperationsOptions = [
  { value: "Day Care", label: "Day Care" },
  { value: "OPD", label: "OPD" },
  { value: "Indoor 24 hours", label: "Indoor 24 hours" },
  { value: "Not operational at night", label: "Not operational at night" },
];

export const recordKeepingOptions = [
  { value: "Manual", label: "Manual" },
  { value: "Electronic", label: "Electronic" },
];

export const indoorEntryOptions = [
  { value: "Verified", label: "Verified" },
  { value: "Not Verified", label: "Not Verified" },
];

export const billVerificationOptions = [
  { value: "Yes- non discrepant", label: "Yes- non discrepant" },
  { value: "Yes- discrepant", label: "Yes- discrepant" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
  { value: "Non Co-operation", label: "Non Co-operation" },
];

export const paymentReceiptsOptions = [
  { value: "Verified- Non discrepant", label: "Verified- Non discrepant" },
  { value: "Verified- discrepant", label: "Verified- discrepant" },
  { value: "Not Verified", label: "Not Verified" },
  { value: "NA", label: "NA" },
  { value: "Non Co-operation", label: "Non Co-operation" },
];

export const reasonOfInsuredNotVisitOptions = [
  { value: "Non Contactable", label: "Non Contactable" },
  { value: "Non Co-operation", label: "Non Co-operation" },
  { value: "Untraceable", label: "Untraceable" },
];

export const policyTypeOptions = [
  { value: "Fresh", label: "Fresh" },
  { value: "Port", label: "Port" },
];

export const previousInsurersOptions = [
  {
    value: "Bajaj Allianz Life Insurance Company Limited",
    label: "Bajaj Allianz Life Insurance Company Limited",
  },
  {
    value: "Birla Sun Life Insurance Co. Ltd.",
    label: "Birla Sun Life Insurance Co. Ltd.",
  },
  {
    value: "HDFC Standard Life Insurance Co. Ltd.",
    label: "HDFC Standard Life Insurance Co. Ltd.",
  },
  {
    value: "ICICI Prudential Life Insurance Co. Ltd.",
    label: "ICICI Prudential Life Insurance Co. Ltd.",
  },
  {
    value: "ING Vysya Life Insurance Company Ltd.",
    label: "ING Vysya Life Insurance Company Ltd.",
  },
  {
    value: "Life Insurance Corporation of India",
    label: "Life Insurance Corporation of India",
  },
  {
    value: "Max Life Insurance Co. Ltd.",
    label: "Max Life Insurance Co. Ltd.",
  },
  {
    value: "PNB Metlife India Insurance Co. Ltd.",
    label: "PNB Metlife India Insurance Co. Ltd.",
  },
  {
    value: "Kotak Mahindra Old Mutual Life Insurance Limited",
    label: "Kotak Mahindra Old Mutual Life Insurance Limited",
  },
  { value: "SBI Life Insurance Co. Ltd", label: "SBI Life Insurance Co. Ltd" },
  {
    value: "Reliance Life Insurance Company Limited.",
    label: "Reliance Life Insurance Company Limited.",
  },
  {
    value: "Aviva Life Insurance Company India Limited",
    label: "Aviva Life Insurance Company India Limited",
  },
  {
    value: "Sahara India Life Insurance Co, Ltd.",
    label: "Sahara India Life Insurance Co, Ltd.",
  },
  {
    value: "Shriram Life Insurance Co, Ltd.",
    label: "Shriram Life Insurance Co, Ltd.",
  },
  {
    value: "Bharti AXA Life Insurance Company Ltd.",
    label: "Bharti AXA Life Insurance Company Ltd.",
  },
  {
    value: "Future Generali India Life Insurance Company Limited",
    label: "Future Generali India Life Insurance Company Limited",
  },
  {
    value: "IDBI Federal Life Insurance Company Ltd.",
    label: "IDBI Federal Life Insurance Company Ltd.",
  },
  {
    value: "Canara HSBC Oriental Bank of Commerce Life Insurance Company Ltd.",
    label: "Canara HSBC Oriental Bank of Commerce Life Insurance Company Ltd.",
  },
  {
    value: "AEGON Religare Life Insurance Company Limited",
    label: "AEGON Religare Life Insurance Company Limited",
  },
  {
    value: "DLF Pramerica Life Insurance Co. Ltd.",
    label: "DLF Pramerica Life Insurance Co. Ltd.",
  },
  {
    value: "Star Union Dai-ichi Life Insurance Co. Ltd.",
    label: "Star Union Dai-ichi Life Insurance Co. Ltd.",
  },
  {
    value: "IndiaFirst Life Insurance Company Limited",
    label: "IndiaFirst Life Insurance Company Limited",
  },
  {
    value: "Edelweiss Tokio Life Insurance Co. Ltd.",
    label: "Edelweiss Tokio Life Insurance Co. Ltd.",
  },
  {
    value: "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD.",
    label: "BAJAJ ALLIANZ GENERAL INSURANCE CO. LTD.",
  },
  {
    value: "HDFC ERGO GENERAL INSURANCE COMPANY LTD",
    label: "HDFC ERGO GENERAL INSURANCE COMPANY LTD",
  },
  {
    value: "ICICI LOMBARD GENERAL INSURANCE CO. LTD.",
    label: "ICICI LOMBARD GENERAL INSURANCE CO. LTD.",
  },
  {
    value: "NATIONAL INSURANCE COMPANY LIMITED",
    label: "NATIONAL INSURANCE COMPANY LIMITED",
  },
  {
    value: "THE NEW INDIA ASSURANCE CO. LTD.",
    label: "THE NEW INDIA ASSURANCE CO. LTD.",
  },
  {
    value: "THE ORIENTAL INSURANCE CO. LTD",
    label: "THE ORIENTAL INSURANCE CO. LTD",
  },
  {
    value: "UNITED INDIA INSURANCE CO. LTD.",
    label: "UNITED INDIA INSURANCE CO. LTD.",
  },
  {
    value: "RELIANCE GENERAL INSURANCE COMPANY LTD.",
    label: "RELIANCE GENERAL INSURANCE COMPANY LTD.",
  },
  {
    value: "ROYAL SUNDARAM ALLIANCE INSURANCE CO LTD",
    label: "ROYAL SUNDARAM ALLIANCE INSURANCE CO LTD",
  },
  {
    value: "TATA AIG GENERAL INSURANCE COMPANY LTD",
    label: "TATA AIG GENERAL INSURANCE COMPANY LTD",
  },
  {
    value: "CHOLAMANDALAM MS GENERAL INSURANCE CO LTD",
    label: "CHOLAMANDALAM MS GENERAL INSURANCE CO LTD",
  },
  {
    value: "FUTURE GENERALI INDIA INSURANCE CO.LTD",
    label: "FUTURE GENERALI INDIA INSURANCE CO.LTD",
  },
  {
    value: "Cigna TTK Health Insurance Company Limited",
    label: "Cigna TTK Health Insurance Company Limited",
  },
  {
    value: "AGRICULTURE INSURANCE CO. OF INDIA LTD",
    label: "AGRICULTURE INSURANCE CO. OF INDIA LTD",
  },
  {
    value: "STAR HEALTH AND ALLIED INSURANCE CO.LTD",
    label: "STAR HEALTH AND ALLIED INSURANCE CO.LTD",
  },
  {
    value: "Apollo Munich Health Insurance Co Ltd",
    label: "Apollo Munich Health Insurance Co Ltd",
  },
  {
    value: "EXPORT CREDIT GURANTEE CORPORATION OF I",
    label: "EXPORT CREDIT GURANTEE CORPORATION OF I",
  },
  {
    value: "UNIVERSAL SOMPO GENERAL INSURANCE CO.LTD",
    label: "UNIVERSAL SOMPO GENERAL INSURANCE CO.LTD",
  },
  {
    value: "SHRIRAM GENERAL INSURANCE CO.LTD",
    label: "SHRIRAM GENERAL INSURANCE CO.LTD",
  },
  {
    value: "BHARTI AXA GENERAL INSURANCE CO. LTD",
    label: "BHARTI AXA GENERAL INSURANCE CO. LTD",
  },
  {
    value: "RAHEJA QBE GENERAL INSURANCE CO.LTD.",
    label: "RAHEJA QBE GENERAL INSURANCE CO.LTD.",
  },
  {
    value: "SBI GENERAL INSURANCE COMPANY LTD",
    label: "SBI GENERAL INSURANCE COMPANY LTD",
  },
  {
    value: "MAGMA HDI GENERAL INSURANCE COMPANY LTD",
    label: "MAGMA HDI GENERAL INSURANCE COMPANY LTD",
  },
  {
    value: "IFFCO TOKIO GENERAL INSURANCE CO. LTD.",
    label: "IFFCO TOKIO GENERAL INSURANCE CO. LTD.",
  },
  {
    value: "Religare Health Insurance Company Limited",
    label: "Religare Health Insurance Company Limited",
  },
  {
    value: "Liberty Videocon General Insurance Co.Ltd",
    label: "Liberty Videocon General Insurance Co.Ltd",
  },
  {
    value: "Niva Bupa Health Insurance Company Ltd.",
    label: "Niva Bupa Health Insurance Company Ltd.",
  },
  {
    value: "L&amp;T General Insurance Company Limited",
    label: "L&amp;T General Insurance Company Limited",
  },
  {
    value: "Tata AIA Life Insurance Company Limited",
    label: "Tata AIA Life Insurance Company Limited",
  },
  {
    value: "Exide Life Insurance Company Limited",
    label: "Exide Life Insurance Company Limited",
  },
  {
    value: "HDFC Standard Life Insurance Company",
    label: "HDFC Standard Life Insurance Company",
  },
  {
    value: "KOTAK MAHINDRA GENERAL INSURANCE COMPANY LIMITED",
    label: "KOTAK MAHINDRA GENERAL INSURANCE COMPANY LIMITED",
  },
  {
    value: "Aditya Birla Health Insurance Company Ltd",
    label: "Aditya Birla Health Insurance Company Ltd",
  },
  {
    value: "Edelweiss General Insurance Company Limited",
    label: "Edelweiss General Insurance Company Limited",
  },
  {
    value: "ACKO General Health Insurance Limited",
    label: "ACKO General Health Insurance Limited",
  },
  {
    value: "GoDigit General Insurance Limited",
    label: "GoDigit General Insurance Limited",
  },
  {
    value: "Manipal Cigna Health Insurance Company Limited",
    label: "Manipal Cigna Health Insurance Company Limited",
  },
  { value: "Navi General Insurance Ltd", label: "Navi General Insurance Ltd" },
];

export const firstConsultationOptions = [
  { value: "OPD of treating Hospital", label: "OPD of treating Hospital" },
  { value: "Online Consultation", label: "Online Consultation" },
  { value: "Family Doctor", label: "Family Doctor" },
  { value: "Other Clinic", label: "Other Clinic" },
  { value: "Other OPD", label: "Other OPD" },
  { value: "Not Disclosed", label: "Not Disclosed" },
  { value: "NA", label: "NA" },
];

export const firstConsultationReferralSlipOptions = [
  { value: "Collected", label: "Collected" },
  { value: "Not Collected", label: "Not Collected" },
  { value: "Not shared", label: "Not shared" },
  { value: "NA", label: "NA" },
];

export const attendantDetailsAtTheTimeOfAdmissionOptions = [
  { value: "Shared", label: "Shared" },
  { value: "Not known", label: "Not known" },
  { value: "Not Disclosed", label: "Not Disclosed" },
  { value: "NA", label: "NA" },
];

export const disclosedNotDisclosedOptions = [
  { value: "Not Disclosed", label: "Not Disclosed" },
  { value: "Disclosed", label: "Disclosed" },
];

export const treatmentTypeOptions = [
  { value: "Only Tablets", label: "Only Tablets" },
  { value: "Medicines with IV fluid", label: "Medicines with IV fluid" },
  {
    value: "Medicines-IV fluid and Injectable",
    label: "Medicines-IV fluid and Injectable",
  },
  { value: "Surgical", label: "Surgical" },
  { value: "NA", label: "NA" },
];

export const anesthesiaOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Not Known", label: "Not Known" },
  { value: "NA", label: "NA" },
];

export const typeOfAnesthesiaOptions = [
  { value: "General", label: "General" },
  { value: "Local", label: "Local" },
  { value: "Spinal", label: "Spinal" },
  { value: "Not Known", label: "Not Known" },
];

export const rmClassOfAccommodationOptions = [
  { value: "General Ward", label: "General Ward" },
  { value: "Single Room", label: "Single Room" },
  { value: "Twin Sharing", label: "Twin Sharing" },
  { value: "OT", label: "OT" },
  { value: "ICU", label: "ICU" },
  { value: "ICCU", label: "ICCU" },
  { value: "NICU", label: "NICU" },
  { value: "PICU", label: "PICU" },
  { value: "Other", label: "Other" },
];

export const rmRelationshipOptions = [
  {
    group: "Family",
    items: [
      { value: "Father", label: "Father" },
      { value: "Mother", label: "Mother" },
      { value: "Spouse", label: "Spouse" },
      { value: "Son", label: "Son" },
      { value: "Daughter", label: "Daughter" },
      { value: "In Law", label: "In Law" },
    ],
  },
  {
    group: "Others",
    items: [
      { value: "Friend", label: "Friend" },
      { value: "Passerby", label: "Passerby" },
      { value: "Neighbor", label: "Neighbor" },
      { value: "Employer", label: "Employer" },
      { value: "Colleague", label: "Colleague" },
      { value: "Relative", label: "Relative" },
    ],
  },
];

export const untraceableBasisOptions = [
  {
    value: "On the given address as per contract details",
    label: "On the given address as per contract details",
  },
  {
    value: "On the given address as per claimed documents",
    label: "On the given address as per claimed documents",
  },
  {
    value: "On the address as per address proof",
    label: "On the address as per address proof",
  },
  {
    value: "On the re-located address retrieved from Hospital/Vicinity",
    label: "On the re-located address retrieved from Hospital/Vicinity",
  },
];
