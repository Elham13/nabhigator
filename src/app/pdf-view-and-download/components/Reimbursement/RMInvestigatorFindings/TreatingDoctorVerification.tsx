import React from "react";
import { ITreatingDoctorVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: ITreatingDoctorVerification;
};

const TreatingDoctorVerification = ({ values }: PropTypes) => {
  const doctors =
    values?.doctors && values?.doctors?.length > 0
      ? values?.doctors?.flatMap((doctor, ind) => [
          {
            title: `Doctor ${ind + 1}`,
            key: "Name of treating Doctor",
            value: doctor?.name || "-",
          },
          {
            key: "Qualification",
            value: doctor?.qualification || "-",
          },
          {
            key: "Registration Number",
            value: doctor?.registrationNo?.value || "-",
          },
          ...(!!doctor?.registrationNo?.value
            ? [
                {
                  key: "Remark",
                  value: doctor?.registrationNo?.remark || "-",
                },
              ]
            : []),
          {
            key: "Meeting Status",
            value: doctor?.meetingStatus || "-",
          },
          ...(doctor?.meetingStatus === "Untraceable"
            ? [
                {
                  key: "Remark",
                  value: doctor?.remarkForUntraceable || "-",
                },
              ]
            : doctor?.meetingStatus === "Traceable"
            ? [
                {
                  key: "Co-Operation",
                  value: doctor?.cooperation || "-",
                },
              ]
            : []),
        ])
      : [];

  const data = [
    ...doctors,
    { key: "Verification Summary", value: values?.verificationSummary || "-" },
  ];
  return <ThreeSectionView data={data} topic="Treating Doctor Verification" />;
};

export default TreatingDoctorVerification;
