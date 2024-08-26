import React, { Fragment } from "react";
import { IEmployerVerification } from "@/lib/utils/types/rmDataTypes";
import SectionHeading from "../../SectionHeading";
import KeyValueView from "../../KeyValueView";
import dayjs from "dayjs";

type PropTypes = {
  values: IEmployerVerification;
};

const EmployerVerification = ({ values }: PropTypes) => {
  return (
    <Fragment>
      <SectionHeading>Employer Verification</SectionHeading>
      {values?.employers &&
        values?.employers?.length > 0 &&
        values?.employers?.map((employer) => (
          <Fragment key={employer?._id}>
            <KeyValueView
              left="Name of Employer"
              right={employer?.nameOfEmployer || "-"}
            />
            <KeyValueView left="Address" right={employer?.address || "-"} />
            <KeyValueView
              left="Date of Joining"
              right={
                employer?.dateOfJoining
                  ? dayjs(employer?.dateOfJoining).format("DD-MMM-YYYY")
                  : "-"
              }
            />
            <KeyValueView
              left="Any Group Health Policy?"
              right={employer?.anyGroupHealthPolicy || "-"}
            />
            {employer?.anyGroupHealthPolicy === "Yes" && (
              <KeyValueView
                left="Claim Details"
                right={employer?.claimDetails || "-"}
              />
            )}
          </Fragment>
        ))}
      <KeyValueView
        left="Verification Summary"
        right={values?.verificationSummary || "-"}
      />
    </Fragment>
  );
};

export default EmployerVerification;
