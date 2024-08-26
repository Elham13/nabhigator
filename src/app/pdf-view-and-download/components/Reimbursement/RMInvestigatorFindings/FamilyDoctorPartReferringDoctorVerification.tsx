import React, { Fragment } from "react";
import { IFamilyDoctorOrReferringDoctorVerification } from "@/lib/utils/types/rmDataTypes";
import SectionHeading from "../../SectionHeading";
import KeyValueView from "../../KeyValueView";

type PropTypes = {
  values: IFamilyDoctorOrReferringDoctorVerification;
};

const FamilyDoctorPartReferringDoctorVerification = ({ values }: PropTypes) => {
  return (
    <Fragment>
      <SectionHeading>
        Family Doctor Part / Referring Doctor Verification
      </SectionHeading>
      {values?.doctors &&
        values?.doctors?.length > 0 &&
        values?.doctors?.map((doctor) => (
          <Fragment key={doctor?._id}>
            <KeyValueView left="Name of doctor" right={doctor?.name || "-"} />
            <KeyValueView
              left="Qualifications"
              right={doctor?.qualification || "-"}
            />
            <KeyValueView
              left="Registration No"
              right={doctor?.registrationNo?.value || "-"}
            />
            {doctor?.registrationNo?.remark && (
              <KeyValueView
                left="Registration No Remarks"
                right={doctor?.registrationNo?.remark || "-"}
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

export default FamilyDoctorPartReferringDoctorVerification;
