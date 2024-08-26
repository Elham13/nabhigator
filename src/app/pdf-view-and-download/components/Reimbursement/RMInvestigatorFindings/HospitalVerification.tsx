import React from "react";
import { IHospitalVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";
import dayjs from "dayjs";

type PropTypes = {
  values: IHospitalVerification;
};

const HospitalVerification = ({ values }: PropTypes) => {
  const habits =
    values?.personalOrSocialHabits && values?.personalOrSocialHabits?.length > 0
      ? values?.personalOrSocialHabits?.flatMap((habit, ind) => [
          {
            title: `Personal/Social Habits ${ind + 1}`,
            key: "Habit",
            value: habit?.habit || "-",
          },
          {
            key: `Frequency`,
            value: habit?.frequency || "-",
          },
          {
            key: `Quantity`,
            value: habit?.quantity || "-",
          },
          {
            key: `Duration`,
            value: habit?.duration || "-",
          },
        ])
      : [];

  const data = [
    {
      key: "Date of visit to hospital",
      value: values?.dateOfVisitToHospital
        ? dayjs(values?.dateOfVisitToHospital).format("MM-DDD-YYYY")
        : "-",
    },
    {
      key: "Time of visit to hospital",
      value: values?.timeOfVisitToHospital
        ? dayjs(values?.timeOfVisitToHospital).format("hh:mm:ss a")
        : "-",
    },
    {
      key: "Provider Co-operation",
      value: values?.providerCooperation || "-",
    },
    ...(values?.providerCooperation === "No"
      ? [
          {
            key: "Reason for provider not cooperating",
            value: values?.reasonOfProviderNotCooperating || "-",
          },
        ]
      : []),
    {
      key: "Hospital Infrastructure",
      value: values?.hospitalInfrastructure?.value || "-",
    },
    ...(["Poor Setup", "Primary Care"].includes(
      values?.hospitalInfrastructure?.value
    )
      ? [
          {
            key: "No of beds",
            value: values?.hospitalInfrastructure?.noOfBeds || "0",
          },
          {
            key: "OT",
            value: values?.hospitalInfrastructure?.OT || "_",
          },
          {
            key: "ICU",
            value: values?.hospitalInfrastructure?.ICU || "_",
          },
          {
            key: "Specialty",
            value: values?.hospitalInfrastructure?.specialty || "_",
          },
          {
            key: "Round the clock RMO",
            value: values?.hospitalInfrastructure?.roundOfClockRMO || "_",
          },
          {
            key: "Pharmacy",
            value: values?.hospitalInfrastructure?.pharmacy || "_",
          },
          {
            key: "Pathology",
            value: values?.hospitalInfrastructure?.pathology || "_",
          },
          {
            key: "Hospital Operations",
            value: values?.hospitalInfrastructure?.hospitalOperations || "_",
          },
          {
            key: "Patient Lifts Available?",
            value:
              values?.hospitalInfrastructure?.patientLifts?.available || "_",
          },
          {
            key: "Is Patient Lifts Operational",
            value:
              values?.hospitalInfrastructure?.patientLifts?.operational || "_",
          },
          {
            key: "Hospital Registration",
            value:
              values?.hospitalInfrastructure?.hospitalRegistration
                ?.registered || "_",
          },
          ...(values?.hospitalInfrastructure?.hospitalRegistration
            ?.registered === "Yes"
            ? [
                {
                  key: "Registered From",
                  value: values?.hospitalInfrastructure?.hospitalRegistration
                    ?.registeredFrom
                    ? dayjs(
                        values?.hospitalInfrastructure?.hospitalRegistration
                          ?.registeredFrom
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
                {
                  key: "Registered To",
                  value: values?.hospitalInfrastructure?.hospitalRegistration
                    ?.registeredTo
                    ? dayjs(
                        values?.hospitalInfrastructure?.hospitalRegistration
                          ?.registeredTo
                      ).format("DD-MMM-YYYY")
                    : "-",
                },
              ]
            : []),
          {
            key: "Record Keeping available?",
            value: values?.hospitalInfrastructure?.recordKeeping?.value || "-",
          },
          ...(values?.hospitalInfrastructure?.recordKeeping?.value === "Yes"
            ? [
                {
                  key: "Record Keeping Type",
                  value:
                    values?.hospitalInfrastructure?.recordKeeping?.type || "-",
                },
              ]
            : []),
        ]
      : []),
    {
      key: "Remarks/Observations",
      value: values?.remarks || "-",
    },
    {
      key: "ICPs Collected?",
      value: values?.icpsCollected?.value || "-",
    },
    ...(["No", "No Records", "Not Shared"].includes(
      values?.icpsCollected?.value!
    )
      ? [
          {
            key: "ICPs Collected Remarks",
            value: values?.icpsCollected?.remark || "-",
          },
        ]
      : []),
    {
      key: "Indoor Entry",
      value: values?.indoorEntry?.value || "-",
    },
    ...(values?.indoorEntry?.value === "Verified"
      ? [
          {
            key: "Period of Hospitalization Matching",
            value: values?.indoorEntry?.periodOfHospitalizationMatching || "-",
          },
        ]
      : []),
    {
      key: "Old records checked?",
      value: values?.oldRecordCheck?.value || "-",
    },
    {
      key: "Remarks",
      value: values?.oldRecordCheck?.remark || "-",
    },
    {
      key: "Bill Verification",
      value: values?.billVerification || "-",
    },
    {
      key: "Payment Receipts",
      value: values?.paymentReceipts || "-",
    },
    ...habits,
  ];

  return <ThreeSectionView data={data} topic="Hospital Verification" />;
};

export default HospitalVerification;
