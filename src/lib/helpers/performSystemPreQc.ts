import dayjs from "dayjs";
import { Document } from "mongoose";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  EventNames,
  IAutoPreQC,
  IDashboardData,
  MainTriage,
  NumericStage,
} from "../utils/types/fniDataTypes";
import { isWeekend } from ".";
import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import { runPreQCAutoAllocation } from "./runPreQCAutoAllocation";
dayjs.extend(utc);
dayjs.extend(timezone);

const runTriage = async (fni: IDashboardData) => {
  if (!fni) throw new Error("No data with that id");

  const chemotherapyFirst = ["Z51.2", "Z51", "N18", "Z51.1", "C34"];
  const radiotherapyFirst = ["Z51.2", "Z51", "N18", "Z51.1", "C34"];
  const mhdFirst = ["Y84.1", "Z99.2", "Z49", "T82.4"];
  const bothDiag = [...chemotherapyFirst, ...mhdFirst];
  const triagingTable: MainTriage[] = [];

  // The logics or conditions
  const hasHistory = fni?.claimDetails?.noOfClaimsInHistory > 1;
  const fraudIsNone =
    !!fni?.hospitalDetails?.fraudList &&
    ["none", "None"].includes(fni?.hospitalDetails?.fraudList);
  const diagCode = fni?.claimDetails?.diagnosisCode1;
  const diagCode2 = fni?.claimDetails?.diagnosisCode2;
  const diagCode3 = fni?.claimDetails?.diagnosisCode3;
  const claimStatus = fni?.claimDetails?.claimStatus;

  const rejected = "Investigation Rejected";
  const accepted = "Investigation Accepted";

  for (let i = 0; i < 11; i++) {
    const tempObj: MainTriage = {
      variable: "",
      logic: "",
      result: "",
      acceptOrReject: { condition: false, text: "" },
    };

    if (fni.claimType === "Reimbursement") {
      switch (i) {
        case 0: //The first row in the table
          tempObj["variable"] = "Claim Behavior";
          tempObj["logic"] =
            "De-Dupe in Repeat Claim Master/Logic built in system";
          tempObj["result"] = "Match- Repeat claim flag";
          tempObj["acceptOrReject"] = {
            condition: hasHistory,
            text: hasHistory ? accepted : rejected,
          };
          break;

        case 1:
          tempObj["variable"] = "Claim Behavior";
          tempObj["logic"] =
            "If previous claim of same member/same contract rejected under Fraud/Misrepresentation";
          tempObj["result"] =
            "Doubtful Customer- Previous claim rejected- Member/Contract";
          tempObj["acceptOrReject"] = {
            condition: !fraudIsNone,
            text: fraudIsNone ? rejected : accepted,
          };
          break;

        case 2:
          tempObj["variable"] = "Request Amount";
          tempObj["logic"] = "If Request is > 200,000";
          tempObj["result"] = "High Value";
          tempObj["acceptOrReject"] = {
            condition: fni?.claimDetails?.claimAmount > 200000,
            text: fni?.claimDetails?.claimAmount > 200000 ? accepted : rejected,
          };
          break;

        case 3:
          tempObj["variable"] = "Request Amount";
          tempObj["logic"] = "If Request is < 5000";
          tempObj["result"] = "Low Value";
          tempObj["acceptOrReject"] = {
            condition: fni?.claimDetails?.claimAmount < 5000,
            text: fni?.claimDetails?.claimAmount < 5000 ? rejected : accepted,
          };
          break;

        case 4: {
          const admissionDate = dayjs(
            fni?.hospitalizationDetails.dateOfAdmission,
            "DD-MMM-YYYY"
          );
          const policyStartDate = dayjs(
            fni?.contractDetails?.NBHIPolicyStartDate
          );

          const isWithin3Months = admissionDate.isBefore(
            policyStartDate.add(3, "month")
          );

          tempObj["variable"] = "Proximity";
          tempObj["logic"] =
            "The difference between Date of Admission from Policy Start Date";
          tempObj["result"] = "Early Claim";
          tempObj["acceptOrReject"] = {
            condition: isWithin3Months,
            text: isWithin3Months ? accepted : rejected,
          };
          break;
        }

        case 5: {
          const contractStartDate = dayjs(
            fni?.contractDetails?.NBHIPolicyStartDate,
            "DD-MMM-YYYY"
          );
          const contractEndDate = dayjs(fni?.contractDetails?.policyEndDate);

          const isWithin90DaysFromStartDate = dayjs().isBefore(
            contractStartDate.add(90, "days")
          );

          const isWithin60DaysFromEndDate = dayjs().isAfter(
            contractEndDate.subtract(60, "days")
          );

          const cond = isWithin90DaysFromStartDate || isWithin60DaysFromEndDate;

          tempObj["variable"] = "Proximity";
          tempObj["logic"] =
            "The difference between Date of Admission from Policy Start Date";
          tempObj["result"] = "Before renewal- claim in first year policy";
          tempObj["acceptOrReject"] = {
            condition: cond,
            text: cond ? accepted : rejected,
          };
          break;
        }

        case 6: {
          let isFirstClaimWithin3Years = false;
          fni?.historicalClaim?.map((el) => {
            const found = el?.history?.find((h) => {
              h.hospital === fni?.hospitalDetails?.providerName &&
                h.DOA &&
                dayjs(h.DOA).isBefore(dayjs().add(3, "year"));
            });
            if (!found) isFirstClaimWithin3Years = true;
          });

          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] =
            "If claim is 1st claim from the Hospital historically =<3 year";
          tempObj["result"] = "1st claim in gap of 3 years";
          tempObj["acceptOrReject"] = {
            condition: isFirstClaimWithin3Years,
            text: isFirstClaimWithin3Years ? accepted : rejected,
          };
          break;
        }

        case 7: {
          const isFAndCProvider =
            !!fni?.hospitalDetails?.coutionList ||
            (!!fni?.hospitalDetails?.fraudList &&
              fni?.hospitalDetails?.fraudList !== "None");

          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] = "If Provider is under Fraud and Caution List";
          tempObj["result"] = "F&C Provider";
          tempObj["acceptOrReject"] = {
            condition: isFAndCProvider,
            text: isFAndCProvider ? accepted : rejected,
          };
          break;
        }

        case 8: {
          let isRejectedBefore: boolean = false;

          const found = fni?.historicalClaim.find(
            (claim) => claim?.memberName === fni?.insuredDetails?.insuredName
          );
          if (found) {
            const exists = found?.history?.find(
              (h) =>
                h.hospital === fni?.hospitalDetails?.providerName &&
                h.claims_Status === "Rejected"
            );
            if (exists) isRejectedBefore = true;
          }

          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] =
            "If previous claim rejected under fraud/misrepresentation";
          tempObj["result"] =
            "Doubtful provider- previous claims rejected under Fraud/Misrepresentation";
          tempObj["acceptOrReject"] = {
            condition: isRejectedBefore,
            text: isRejectedBefore ? accepted : rejected,
          };
          break;
        }

        case 9: {
          let isNonPreferredProvider: boolean =
            fni?.hospitalDetails?.preferredPartnerList !== "True";

          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] = "If Provider is under non-preferred provider list";
          tempObj["result"] = "Non Preferred Provider";
          tempObj["acceptOrReject"] = {
            condition: isNonPreferredProvider,
            text: isNonPreferredProvider ? accepted : rejected,
          };
          break;
        }

        case 10:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] =
            "Chemotherapy/Radiotherapy/Haemodialysis- 1st Claim";
          tempObj["result"] = "Match- 1st Claim";
          tempObj["acceptOrReject"] = {
            condition:
              !!diagCode &&
              (chemotherapyFirst.includes(diagCode) ||
                radiotherapyFirst?.includes(diagCode)),
            text:
              !!diagCode && chemotherapyFirst.includes(diagCode)
                ? accepted
                : rejected,
          };
          break;

        case 11:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] = "Radiotherapy-1st  Claim";
          tempObj["result"] = "Diagnosis-Radiotherapy- 1st Claim";
          tempObj["acceptOrReject"] = {
            condition: !!diagCode && radiotherapyFirst.includes(diagCode),
            text:
              !!diagCode && radiotherapyFirst.includes(diagCode)
                ? accepted
                : rejected,
          };
          break;

        case 12:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] = "MHD- 1st Claim";
          tempObj["result"] = "Diagnosis-MHD- 1st Claim";
          tempObj["acceptOrReject"] = {
            condition: !!diagCode && mhdFirst.includes(diagCode),
            text:
              !!diagCode && mhdFirst.includes(diagCode) ? accepted : rejected,
          };
          break;

        case 13:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] = "If chemo/radio/mhd- 2nd and subsequent claim";
          tempObj["result"] =
            "Diagnosis-Chemo/Radio/MHD- 2nd/subsequent Claim- earlier claim investigated - genuine/query/other";
          tempObj["acceptOrReject"] = {
            condition:
              (!!diagCode2 && !bothDiag.includes(diagCode2)) ||
              (!!diagCode3 && !bothDiag.includes(diagCode3)),
            text:
              (!!diagCode2 && bothDiag.includes(diagCode2)) ||
              (!!diagCode3 && bothDiag.includes(diagCode3))
                ? rejected
                : accepted,
          };
          break;

        case 14: {
          tempObj["variable"] = "Demography";
          tempObj["logic"] =
            "Fraud & Cautious Geography- Yes- De-dupe in Master";
          tempObj["result"] = "F&C Geography";
          tempObj["acceptOrReject"] = {
            condition: false, // TODO: Need to set this condition
            text: true ? accepted : rejected,
          };
          break;
        }
        case 15:
          tempObj["variable"] = "Claim Decision";
          tempObj["logic"] = "Discharged- final approval given";
          tempObj["result"] = "Final approved";
          tempObj["acceptOrReject"] = {
            condition: claimStatus !== "Paid",
            text: claimStatus === "Paid" ? rejected : accepted,
          };
          break;

        default:
          null;
      }
    } else {
      switch (i) {
        case 0:
          tempObj["variable"] = "Claim Behavior";
          tempObj["logic"] =
            "De-Dupe in Repeat Claim Master/Logic built in system";
          tempObj["result"] = "Match- Repeat claim flag";
          tempObj["acceptOrReject"] = {
            condition: hasHistory,
            text: hasHistory ? accepted : rejected,
          };
          break;

        case 1:
          tempObj["variable"] = "Claim Behavior";
          tempObj["logic"] =
            "If previous claim of same member/same contract rejected under Fraud/Misrepresentation";
          tempObj["result"] =
            "Doubtful Customer- Previous claim rejected- Member/Contract";
          tempObj["acceptOrReject"] = {
            condition: !fraudIsNone,
            text: fraudIsNone ? rejected : accepted,
          };
          break;

        case 2:
          tempObj["variable"] = "Request Amount";
          tempObj["logic"] = "Request Amount";
          tempObj["result"] =
            fni?.claimDetails?.claimAmount > 199000
              ? "High Value"
              : fni?.claimDetails?.claimAmount <= 5000
              ? "Low Value"
              : "";
          tempObj["acceptOrReject"] = {
            condition:
              fni?.claimDetails?.claimAmount > 199000 ||
              fni?.claimDetails?.claimAmount < 5000,
            text:
              fni?.claimDetails?.claimAmount > 5000
                ? accepted
                : fni?.claimDetails?.claimAmount <= 5000
                ? rejected
                : "",
          };
          break;

        case 3: {
          const admissionDate = dayjs(
            fni?.hospitalizationDetails.dateOfAdmission,
            "DD-MMM-YYYY"
          );
          const policyStartDate = dayjs(
            fni?.contractDetails?.NBHIPolicyStartDate
          );

          const isWithinOneYear = admissionDate.isBefore(
            policyStartDate.add(1, "year")
          );

          tempObj["variable"] = "Proximity";
          tempObj["logic"] = "Difference between DOA and Policy Start";
          tempObj["result"] = "Early Claim";
          tempObj["acceptOrReject"] = {
            condition: isWithinOneYear,
            text: isWithinOneYear ? accepted : rejected,
          };
          break;
        }

        // TODO: Data dump is pending for this.
        case 4:
          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] = "If  provider is newly added to NBHI network";
          tempObj["result"] = "New Provider";
          tempObj["acceptOrReject"] = {
            condition: false,
            text: rejected,
          };
          break;

        case 5:
          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] = "If Provider is under Fraud and Caution List";
          tempObj["result"] = "F&C Provider";
          tempObj["acceptOrReject"] = {
            condition: fni?.hospitalDetails?.coutionList !== null,
            text:
              fni?.hospitalDetails?.coutionList !== null ? accepted : rejected,
          };
          break;

        case 6:
          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] =
            "If previous claim rejected under fraud/misrepresentation";
          tempObj["result"] =
            "Doubtful provider- previous claims rejected under Fraud/Misrepresentation";
          tempObj["acceptOrReject"] = {
            condition: !fraudIsNone,
            text: fraudIsNone ? rejected : accepted,
          };
          break;

        case 7:
          const isOnWeekend =
            !!fni?.hospitalizationDetails?.dateOfAdmission &&
            isWeekend(fni?.hospitalizationDetails?.dateOfAdmission);
          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] =
            "If Date of Admission is on weekly holiday- Saturdays/Sunday";
          tempObj["result"] = "Doubtful provider";
          tempObj["acceptOrReject"] = {
            condition: isOnWeekend,
            text: isOnWeekend ? accepted : rejected,
          };
          break;

        case 8:
          const preAuthInwardDate = dayjs(
            fni?.claimDetails.receivedAt,
            "DD-MMM-YYYY"
          );
          const admissionDate = dayjs(
            fni?.hospitalizationDetails.dateOfAdmission,
            "DD-MMM-YYYY"
          );
          const isAfter = preAuthInwardDate.isAfter(admissionDate);

          tempObj["variable"] = "Provider Behavior";
          tempObj["logic"] =
            "Date of Pre-Auth inward is after Date of Admission";
          tempObj["result"] = isAfter
            ? "Date of Pre-Auth inward is after Date of Admission"
            : "";
          tempObj["acceptOrReject"] = {
            condition: isAfter,
            text: isAfter ? accepted : rejected,
          };
          break;

        case 9:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] =
            "Chemotherapy/Radiotherapy/Haemodialysis- 1st Claim";
          tempObj["result"] = "Match- 1st Claim";
          tempObj["acceptOrReject"] = {
            condition: !!diagCode && chemotherapyFirst.includes(diagCode),
            text:
              !!diagCode && chemotherapyFirst.includes(diagCode)
                ? accepted
                : rejected,
          };
          break;

        case 10:
          tempObj["variable"] = "Diagnosis";
          tempObj["logic"] =
            "Chemotherapy/Radiotherapy/Haemodialysis - 2nd and subsequent claim";
          tempObj["result"] = "Earlier Claim Investigated and Fraud Proven";
          tempObj["acceptOrReject"] = {
            condition:
              (!!diagCode2 && !bothDiag.includes(diagCode2)) ||
              (!!diagCode3 && !bothDiag.includes(diagCode3)),
            text:
              (!!diagCode2 && !bothDiag.includes(diagCode2)) ||
              (!!diagCode3 && !bothDiag.includes(diagCode3))
                ? "Investigation Accepted"
                : "Investigation Rejected",
          };
          break;

        default:
          return null;
      }
    }
    triagingTable.push(tempObj);
  }

  let triageStatus: "Accepted" | "Rejected" = "Accepted";
  if (
    triagingTable &&
    triagingTable?.length > 0 &&
    triagingTable?.some((el) => el.acceptOrReject.condition)
  ) {
    triageStatus = "Accepted";
  } else triageStatus = "Rejected";

  await captureCaseEvent({
    claimId: fni?.claimId,
    intimationDate:
      fni?.intimationDate ||
      dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
    eventName:
      triageStatus === "Accepted"
        ? EventNames.PRE_QC_ACCEPTED
        : EventNames.PRE_QC_REJECTED,
    stage: NumericStage.PENDING_FOR_PRE_QC,
    eventRemarks: triageStatus,
    userName: "FNI System",
  });

  return { triage: triagingTable, triageStatus };
};

export const performSystemPreQc = async (
  data: Document & IDashboardData,
  fniManager: IAutoPreQC | null
) => {
  try {
    if (!data?._id) throw new Error("Id is required for system pre qc");
    if (data) {
      const result = await runTriage(data);
      await captureCaseEvent({
        claimId: data?.claimId,
        intimationDate:
          data?.intimationDate ||
          dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
        eventName: EventNames.SYSTEM_PRE_QC,
        stage: NumericStage.PENDING_FOR_PRE_QC,
        userName: "FNI System",
      });

      if (result?.triage) data.triageSummary = result?.triage;

      if (
        fniManager &&
        fniManager.autoPreQC &&
        result?.triageStatus === "Accepted"
      )
        runPreQCAutoAllocation(data);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
