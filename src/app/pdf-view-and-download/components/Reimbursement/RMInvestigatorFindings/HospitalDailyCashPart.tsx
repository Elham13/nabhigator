import React from "react";
import { IHospitalDailyCashPart } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";
import dayjs from "dayjs";

type PropTypes = {
  values: IHospitalDailyCashPart;
};

const HospitalDailyCashPart = ({ values }: PropTypes) => {
  const data = [
    {
      title: "Insured Visit Summary",
      key: "Insured Visited?",
      value: values?.insuredVisit || "-",
    },
    ...(values.insuredVisit === "Yes"
      ? [
          {
            key: "Insured Cooperating?",
            value: values?.insuredCooperation || "-",
          },
          ...(values?.insuredCooperation === "No"
            ? [
                {
                  key: "Remarks on insured not cooperating",
                  value: values?.insuredNotCooperatingReason || "-",
                },
              ]
            : values?.insuredCooperation === "Yes"
            ? [
                {
                  key: "Date of visit to insured",
                  value: values?.insuredCooperationDetail?.dateOfVisitToInsured
                    ? dayjs(
                        values?.insuredCooperationDetail?.dateOfVisitToInsured
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Time of visit to insured",
                  value: values?.insuredCooperationDetail?.timeOfVisitToInsured
                    ? dayjs(
                        values?.insuredCooperationDetail?.timeOfVisitToInsured
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Name of insured (System Fetch)",
                  value:
                    values?.insuredCooperationDetail?.nameOfInsuredSystem ||
                    "-",
                },
                {
                  key: "Name of insured (User Feed)",
                  value:
                    values?.insuredCooperationDetail?.nameOfInsuredUser || "-",
                },
                {
                  key: "Date of Admission (System Fetch)",
                  value: values?.insuredCooperationDetail?.dateOfAdmissionSystem
                    ? dayjs(
                        values?.insuredCooperationDetail?.dateOfAdmissionSystem
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Date of Admission (User Feed)",
                  value: values?.insuredCooperationDetail?.dateOfAdmissionUser
                    ? dayjs(
                        values?.insuredCooperationDetail?.dateOfAdmissionUser
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Time of Discharge (System Fetch)",
                  value: values?.insuredCooperationDetail?.timeOfDischargeSystem
                    ? dayjs(
                        values?.insuredCooperationDetail?.timeOfDischargeSystem
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Time of Discharge (User Feed)",
                  value: values?.insuredCooperationDetail?.timeOfDischargeUser
                    ? dayjs(
                        values?.insuredCooperationDetail?.timeOfDischargeUser
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Number of days and hours of Hospitalization (System Fetch)",
                  value:
                    values?.insuredCooperationDetail
                      ?.durationOfHospitalizationSystem || "-",
                },
                {
                  key: "Number of days and hours of Hospitalization (User Feed)",
                  value:
                    values?.insuredCooperationDetail
                      ?.durationOfHospitalizationUser || "-",
                },
                {
                  key: "Diagnosis",
                  value: values?.insuredCooperationDetail?.diagnosis || "-",
                },
                {
                  key: "Class of accommodation",
                  value:
                    values?.insuredCooperationDetail?.classOfAccommodation ||
                    "-",
                },
                {
                  key: "Discrepancies Observed",
                  value:
                    values?.insuredCooperationDetail?.discrepanciesObserved ||
                    "-",
                },
              ]
            : []),
        ]
      : []),
    {
      title: "Hospital Visit Summary",
      key: "Hospital Visited?",
      value: values?.hospitalVisit || "-",
    },
    ...(values?.hospitalVisit === "Yes"
      ? [
          {
            key: "Hospital Cooperating?",
            value: values?.hospitalCooperation || "-",
          },
          ...(values?.hospitalCooperation === "No"
            ? [
                {
                  key: "Remarks on hospital not cooperating",
                  value: values?.hospitalNotCooperatingReason || "-",
                },
              ]
            : values?.hospitalCooperation === "Yes"
            ? [
                {
                  key: "Date of visit to hospital",
                  value: values?.hospitalCooperationDetail
                    ?.dateOfVisitToHospital
                    ? dayjs(
                        values?.hospitalCooperationDetail?.dateOfVisitToHospital
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Time of visit to hospital",
                  value: values?.hospitalCooperationDetail
                    ?.timeOfVisitToHospital
                    ? dayjs(
                        values?.hospitalCooperationDetail?.timeOfVisitToHospital
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Date of Admission (System Fetch)",
                  value: values?.hospitalCooperationDetail
                    ?.dateOfAdmissionSystem
                    ? dayjs(
                        values?.hospitalCooperationDetail?.dateOfAdmissionSystem
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Date of Admission (User Feed)",
                  value: values?.hospitalCooperationDetail?.dateOfAdmissionUser
                    ? dayjs(
                        values?.hospitalCooperationDetail?.dateOfAdmissionUser
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Time of Discharge (System Fetch)",
                  value: values?.hospitalCooperationDetail
                    ?.timeOfDischargeSystem
                    ? dayjs(
                        values?.hospitalCooperationDetail?.timeOfDischargeSystem
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Time of Discharge (User Feed)",
                  value: values?.hospitalCooperationDetail?.timeOfDischargeUser
                    ? dayjs(
                        values?.hospitalCooperationDetail?.timeOfDischargeUser
                      ).format("hh:mm:ss a")
                    : "-",
                },
                {
                  key: "Number of days and hours of Hospitalization (System Fetch)",
                  value:
                    values?.hospitalCooperationDetail
                      ?.durationOfHospitalizationSystem || "-",
                },
                {
                  key: "Number of days and hours of Hospitalization (User Feed)",
                  value:
                    values?.hospitalCooperationDetail
                      ?.durationOfHospitalizationUser || "-",
                },
                {
                  key: "Diagnosis",
                  value: values?.hospitalCooperationDetail?.diagnosis || "-",
                },
                {
                  key: "Class of accommodation",
                  value:
                    values?.hospitalCooperationDetail?.classOfAccommodation ||
                    "-",
                },
                {
                  key: "Discrepancies Observed",
                  value:
                    values?.hospitalCooperationDetail?.discrepanciesObserved ||
                    "-",
                },
              ]
            : []),
        ]
      : []),
    {
      key: "Final Observation",
      value: values?.finalObservation || "-",
    },
  ];
  return <ThreeSectionView topic="Hospital Daily Cash" data={data} />;
};

export default HospitalDailyCashPart;
