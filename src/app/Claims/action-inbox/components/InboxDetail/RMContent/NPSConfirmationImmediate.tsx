import React from "react";
import { CaseDetail } from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";
import { Box, Grid } from "@mantine/core";
import { INPSVerification } from "@/lib/utils/types/rmDataTypes";
import KeyValueContainer from "../KeyValueContainer";
import dayjs from "dayjs";
import { AccordionItem, CustomAccordion } from "@/components/CustomAccordion";

const NPSConfirmationImmediate = ({
  caseDetail,
}: {
  caseDetail: CaseDetail;
}) => {
  const { rmFindings, rmFindingsHospital } = getTasksAndDocs({
    claimType: "Reimbursement",
    claimCase: caseDetail,
  });

  return (
    <Box>
      {caseDetail?.allocationType === "Single" ? (
        <Values values={rmFindings?.["NPS Confirmation"]} />
      ) : (
        <CustomAccordion>
          <AccordionItem title="Insured Part">
            <Values values={rmFindings?.["NPS Confirmation"]} />
          </AccordionItem>
          <AccordionItem title="Hospital Part">
            <Values values={rmFindingsHospital?.["NPS Confirmation"]} />
          </AccordionItem>
        </CustomAccordion>
      )}
    </Box>
  );
};

export default NPSConfirmationImmediate;

function Values({ values }: { values?: INPSVerification | null }) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Visit"
          value={values?.insuredVisit || "-"}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Mobile Number"
          value={values?.insuredMobileNo || "-"}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <KeyValueContainer
          label="Insured Visit"
          value={
            !!values?.insuredVisitDate
              ? dayjs(values?.insuredVisitDate).format("DD-MMM-YYYY")
              : "-"
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <KeyValueContainer
          label="Updated At"
          value={
            !!values?.updatedAt
              ? dayjs(values?.updatedAt).format("DD-MMM-YYYY")
              : "-"
          }
        />
      </Grid.Col>
    </Grid>
  );
}
