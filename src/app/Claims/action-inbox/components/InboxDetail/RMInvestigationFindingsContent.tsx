import React, { Fragment } from "react";
import { ActionIcon, Box, Grid, GridCol, Text, Title } from "@mantine/core";
import OPDTasks from "./RMContent/OPDTasks";
import NPSTasks from "./RMContent/NPSTasks";
import InsuredTasks from "./RMContent/InsuredTasks";
import VicinityTasks from "./RMContent/VicinityTasks";
import HospitalTasks from "./RMContent/HospitalTasks";
import LabOrPathologistTasks from "./RMContent/LabOrPathologistTasks";
import ChemistTasks from "./RMContent/ChemistTasks";
import MiscellaneousTasks from "./RMContent/MiscellaneousTasks";
import PrePostTasks from "./RMContent/PrePostTasks";
import HospitalDailyCashTasks from "./RMContent/HospitalDailyCashTasks";
import AHCTasks from "./RMContent/AHCTasks";
import ClaimTasks from "./RMContent/ClaimTasks";
import TreatingDoctorTasks from "./RMContent/TreatingDoctorTasks";
import FamilyDoctorTasks from "./RMContent/FamilyDoctorTasks";
import EmployerTasks from "./RMContent/EmployerTasks";
import RandomVicinityTasks from "./RMContent/RandomVicinityTasks";
import KeyValueContainer from "./KeyValueContainer";
import { BiLink } from "react-icons/bi";
import { IRMFindings } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  findings?: IRMFindings;
};

const RMInvestigationFindingsContent = ({ findings }: PropTypes) => {
  return (
    <Box>
      {findings ? (
        <>
          {findings?.["NPS Confirmation"] ? (
            <NPSTasks values={findings?.["NPS Confirmation"]} />
          ) : null}
          {findings?.["Insured Verification"] ? (
            <InsuredTasks values={findings?.["Insured Verification"]} />
          ) : null}
          {findings?.["Vicinity Verification"] ? (
            <VicinityTasks values={findings?.["Vicinity Verification"]} />
          ) : null}
          {findings?.["Hospital Verification"] ? (
            <HospitalTasks values={findings?.["Hospital Verification"]} />
          ) : null}
          {findings?.["Lab Part/Pathologist Verification"] ? (
            <LabOrPathologistTasks
              values={findings?.["Lab Part/Pathologist Verification"]}
            />
          ) : null}
          {findings?.["Chemist Verification"] ? (
            <ChemistTasks values={findings?.["Chemist Verification"]} />
          ) : null}
          {findings?.["Miscellaneous Verification"] ? (
            <MiscellaneousTasks
              values={findings?.["Miscellaneous Verification"]}
            />
          ) : null}
          {findings?.["Pre-Post Verification"] ? (
            <PrePostTasks values={findings?.["Pre-Post Verification"]} />
          ) : null}
          {findings?.["Hospital Daily Cash Part"] ? (
            <HospitalDailyCashTasks
              values={findings?.["Hospital Daily Cash Part"]}
            />
          ) : null}
          {findings?.["OPD Verification Part"] ? (
            <OPDTasks values={findings?.["OPD Verification Part"]} />
          ) : null}
          {findings?.["AHC Verification Part"] ? (
            <AHCTasks values={findings?.["AHC Verification Part"]} />
          ) : null}
          {findings?.["Claim Verification"] ? (
            <ClaimTasks values={findings?.["Claim Verification"]} />
          ) : null}
          {findings?.["Treating Doctor Verification"] ? (
            <TreatingDoctorTasks
              values={findings?.["Treating Doctor Verification"]}
            />
          ) : null}
          {findings?.["Family Doctor Part/Referring Doctor Verification"] ? (
            <FamilyDoctorTasks
              values={
                findings?.["Family Doctor Part/Referring Doctor Verification"]
              }
            />
          ) : null}
          {findings?.["Employer Verification"] ? (
            <EmployerTasks values={findings?.["Employer Verification"]} />
          ) : null}
          {findings?.[
            "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
          ] ? (
            <RandomVicinityTasks
              values={
                findings?.[
                  "Random Vicinity Hospital/Lab/Doctor/Chemist Verification"
                ]
              }
            />
          ) : null}
          <Grid>
            <GridCol span={{ sm: 12 }}>
              <Title order={3} c="cyan" my={10}>
                Common Tasks
              </Title>
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Investigation Summary"
                value={findings?.investigationSummary || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Discrepancies Or Irregularities Observed"
                value={findings?.discrepanciesOrIrregularitiesObserved || "-"}
              />
            </GridCol>
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Recommendation"
                value={findings?.recommendation?.value || "-"}
              />
            </GridCol>

            {findings?.recommendation?.value === "Repudiation" ? (
              <Fragment>
                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Ground of Repudiation"
                    value={
                      findings?.recommendation?.groundOfRepudiation &&
                      findings?.recommendation?.groundOfRepudiation?.length > 0
                        ? findings?.recommendation?.groundOfRepudiation?.join(
                            ", "
                          )
                        : "-"
                    }
                  />
                </GridCol>
                {findings?.recommendation?.groundOfRepudiation?.includes(
                  "Non Co-Operation"
                ) ? (
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Non Cooperation of"
                      value={findings?.recommendation?.nonCooperationOf || "-"}
                    />
                  </GridCol>
                ) : null}

                <GridCol span={{ sm: 12, md: 6 }}>
                  <KeyValueContainer
                    label="Has Evidence?"
                    value={findings?.recommendation?.hasEvidence || "-"}
                  />
                </GridCol>

                {findings?.recommendation?.hasEvidence === "Yes" ? (
                  findings?.recommendation?.evidences &&
                  findings?.recommendation?.evidences?.length > 0 ? (
                    findings?.recommendation?.evidences?.map(
                      (evidence, ind) => (
                        <ActionIcon
                          key={ind}
                          disabled={!evidence}
                          variant="light"
                          onClick={() => {
                            window.open(
                              `/Claims/action-inbox/documents?url=${evidence}&name=Evidence`,
                              "_blank"
                            );
                          }}
                        >
                          <BiLink />
                        </ActionIcon>
                      )
                    )
                  ) : null
                ) : findings?.recommendation?.hasEvidence === "No" ? (
                  <GridCol span={{ sm: 12, md: 6 }}>
                    <KeyValueContainer
                      label="Reason of evidence not available?"
                      value={
                        findings?.recommendation
                          ?.reasonOfEvidenceNotAvailable || "-"
                      }
                    />
                  </GridCol>
                ) : null}
              </Fragment>
            ) : findings?.recommendation?.value?.includes("Inconclusive") ? (
              <GridCol span={{ sm: 12, md: 6 }}>
                <KeyValueContainer
                  label="Inconclusive Remark"
                  value={findings?.recommendation?.inconclusiveRemark || "-"}
                />
              </GridCol>
            ) : null}

            {findings?.otherRecommendation &&
            findings?.otherRecommendation?.length > 0
              ? findings?.otherRecommendation?.map((el) => (
                  <Fragment key={el?._id}>
                    <GridCol span={{ sm: 12 }}>
                      <KeyValueContainer
                        label="Other Recommendation"
                        value={el?.value || "-"}
                      />
                    </GridCol>
                    {el?.recommendationFor && el?.recommendationFor?.length > 0
                      ? el?.recommendationFor?.map((rec, ind) => (
                          <Fragment key={ind}>
                            <GridCol span={{ sm: 12, md: 6 }}>
                              <KeyValueContainer
                                label="Recommendation For"
                                value={rec?.value || "-"}
                              />
                            </GridCol>
                            <GridCol span={{ sm: 12, md: 6 }}>
                              <KeyValueContainer
                                label={`Remarks of ${rec?.value}`}
                                value={rec?.remark || "-"}
                              />
                            </GridCol>
                          </Fragment>
                        ))
                      : null}
                  </Fragment>
                ))
              : null}
          </Grid>
        </>
      ) : (
        <Text ta="center" c="red">
          No Data
        </Text>
      )}
    </Box>
  );
};

export default RMInvestigationFindingsContent;
