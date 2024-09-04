import React from "react";
import { IEmployerVerification } from "@/lib/utils/types/rmDataTypes";
import dayjs from "dayjs";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IEmployerVerification;
};

const EmployerVerification = ({ values }: PropTypes) => {
  const employers =
    values?.employers && values?.employers?.length > 0
      ? values?.employers?.flatMap((employer, ind) => [
          {
            title: `Employer ${ind + 1}`,
            key: "Name of Employer",
            value: employer?.nameOfEmployer || "-",
            shouldWrap: true,
          },
          {
            key: "Address",
            value: employer?.address || "-",
          },
          {
            key: "Date of Joining",
            value: employer?.dateOfJoining
              ? dayjs(employer?.dateOfJoining).format("DD-MMM-YYYY")
              : "-",
          },
          {
            key: "Any Group Health Policy?",
            value: employer?.anyGroupHealthPolicy || "-",
          },
          ...(employer?.anyGroupHealthPolicy === "Yes"
            ? [
                {
                  key: "Claim Details",
                  value: employer?.claimDetails || "-",
                },
              ]
            : []),
        ])
      : [];
  const data = [
    ...employers,
    {
      key: "Verification Summary",
      value: values?.verificationSummary || "-",
      isLongText: true,
    },
  ];
  return <ThreeSectionView data={data} topic="Employer Verification" />;
};

export default EmployerVerification;
