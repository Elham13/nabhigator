import React from "react";
import { ILabOrPathologistVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: ILabOrPathologistVerification;
};

const LabOrPathologistVerification = ({ values }: PropTypes) => {
  const labs =
    values?.labs && values?.labs?.length > 0
      ? values?.labs?.flatMap((lab, ind) => [
          {
            title: `Lab ${ind + 1}`,
            key: "Name of the lab",
            value: lab?.name || "-",
          },
          { key: "Address", value: lab?.address || "-" },
          { key: "City", value: lab?.city || "-" },
          { key: "State", value: lab?.state || "-" },
          {
            key: "Reports signed by",
            value: lab?.reportsSigned || "-",
          },
          {
            key: "Lab Reports",
            value: lab?.labReports || "-",
          },
          {
            key: "Lab Bills",
            value: lab?.labBills || "-",
          },
          ...(lab?.reportsSigned === "Not signed"
            ? []
            : [
                {
                  title: "Pathologist Details",
                  key: "Name of Pathologist",
                  value: lab?.pathologistDetails?.name || "-",
                },
                {
                  key: "Qualification",
                  value: lab?.pathologistDetails?.qualification || "-",
                },
                {
                  key: "Registration Number",
                  value: lab?.pathologistDetails?.registrationNo || "-",
                },
                {
                  key: "Pathologist Meeting",
                  value: lab?.pathologistDetails?.meetingStatus || "-",
                },
                ...(lab?.pathologistDetails?.meetingStatus === "Untraceable"
                  ? [
                      {
                        key: "Reason for Untraceable",
                        value:
                          lab?.pathologistDetails?.reasonForUntraceable || "-",
                      },
                    ]
                  : lab?.pathologistDetails?.meetingStatus === "Traceable"
                  ? [
                      {
                        key: "Co-Operation",
                        value: lab?.pathologistDetails?.cooperation || "-",
                      },
                    ]
                  : []),
              ]),
        ])
      : [];

  const data = [
    ...labs,
    { key: "Verification Summary", value: values?.verificationSummary || "-" },
  ];
  return (
    <ThreeSectionView data={data} topic="Lab Part/Pathologist Verification" />
  );
};

export default LabOrPathologistVerification;
