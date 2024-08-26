import React, { Fragment } from "react";
import { IChemistVerification } from "@/lib/utils/types/rmDataTypes";
import SectionHeading from "../../SectionHeading";
import KeyValueView from "../../KeyValueView";

type PropTypes = {
  values: IChemistVerification;
};
const ChemistVerification = ({ values }: PropTypes) => {
  return (
    <Fragment>
      <SectionHeading>Chemist Verification</SectionHeading>
      {values?.chemists &&
        values?.chemists?.length > 0 &&
        values?.chemists?.map((chemist, ind) => {
          return (
            <Fragment key={ind}>
              <KeyValueView
                left="Name of Chemist"
                right={chemist?.name || "-"}
              />
              <KeyValueView left="Address" right={chemist?.address || "-"} />
              <KeyValueView left="City" right={chemist?.city || "-"} />
              <KeyValueView left="State" right={chemist?.state || "-"} />
              <KeyValueView
                left="Bills Verified?"
                right={chemist?.billsVerified || "-"}
              />
            </Fragment>
          );
        })}
      <KeyValueView
        left="Verification Summary"
        right={values?.verificationSummary || "-"}
      />
    </Fragment>
  );
};

export default ChemistVerification;
