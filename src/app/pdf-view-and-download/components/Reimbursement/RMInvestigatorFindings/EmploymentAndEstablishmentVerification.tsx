import React from "react";
import { IEmploymentAndEstablishmentVerification } from "@/lib/utils/types/rmDataTypes";
import ThreeSectionView from "../../ThreeSectionView";

type PropTypes = {
  values: IEmploymentAndEstablishmentVerification;
};

const EmploymentAndEstablishmentVerification = ({ values }: PropTypes) => {
  const data = [
    { key: "Name of Establishment", value: values?.nameOfEstablishment || "-" },
    { key: "Address", value: values?.address || "-" },
    { key: "City", value: values?.city || "-" },
    { key: "State", value: values?.state || "-" },
    {
      key: "Establishment Verification",
      value: values?.establishmentVerification?.value || "-",
    },
    ...(values?.establishmentVerification?.value ===
    "Does Not Exist on the address as per contract"
      ? [
          {
            key: "Status",
            value: values?.establishmentVerification?.status?.value || "-",
          },
        ]
      : []),
    ...(values?.establishmentVerification?.status?.value ===
    "Exists on another address"
      ? [
          {
            key: "Address",
            value: values?.establishmentVerification?.status?.address || "-",
          },
          {
            key: "City",
            value: values?.establishmentVerification?.status?.city || "-",
          },
          {
            key: "State",
            value: values?.establishmentVerification?.status?.state || "-",
          },
        ]
      : []),
    ...(values?.establishmentVerification?.value ===
      "Exist on the address as per contract" ||
    values?.establishmentVerification?.status?.value ===
      "Exists on another address"
      ? [
          {
            key: "Type of Establishment",
            value:
              values?.establishmentVerification?.status?.typeOfEstablishments ||
              "-",
          },
        ]
      : []),
    { key: "Nature of work", value: values?.natureOfWork || "-" },
    {
      key: "Total no of employees working",
      value: values?.totalNoOfEmployeesWorking || "-",
    },
  ];

  return (
    <ThreeSectionView
      data={data}
      topic="Employment And Establishment Verification"
    />
  );
};

export default EmploymentAndEstablishmentVerification;
