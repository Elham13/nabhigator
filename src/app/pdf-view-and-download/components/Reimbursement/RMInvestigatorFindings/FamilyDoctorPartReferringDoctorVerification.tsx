import React from "react";
import { IFamilyDoctorOrReferringDoctorVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IFamilyDoctorOrReferringDoctorVerification;
};

const FamilyDoctorPartReferringDoctorVerification = ({ values }: PropTypes) => {
  const doctors =
    values?.doctors && values?.doctors?.length > 0
      ? values?.doctors?.flatMap((doctor, ind) => [
          {
            title: `${ind + 1}`,
            key: "Name of doctor",
            value: doctor?.name || "-",
          },
          { key: "Qualifications", value: doctor?.qualification || "-" },
          {
            key: "Registration No",
            value: doctor?.registrationNo?.value || "-",
          },
          {
            key: "Registration No Remarks",
            value: doctor?.registrationNo?.remark || "-",
          },
        ])
      : [];
  const data = [
    ...doctors,
    { key: "Verification Summary", value: values?.verificationSummary || "-" },
  ];
  return (
    <ThreeSectionView
      data={data}
      topic="Family Doctor Part / Referring Doctor Verification"
    />
  );
};

export default FamilyDoctorPartReferringDoctorVerification;
