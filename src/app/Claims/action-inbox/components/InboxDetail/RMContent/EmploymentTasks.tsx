import React, { Fragment } from "react";
import KeyValueContainer from "../KeyValueContainer";
import { Grid, GridCol, Title } from "@mantine/core";
import { IEmploymentAndEstablishmentVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  values: IEmploymentAndEstablishmentVerification;
};

const EmploymentTasks = ({ values }: PropTypes) => {
  return (
    <Grid>
      <GridCol span={{ sm: 12 }}>
        <Title order={3} c="cyan" my={10}>
          Employment & Establishment Verification
        </Title>
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Name of Establishment"
          value={values?.nameOfEstablishment || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Address" value={values?.address || "-"} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="City" value={values?.city || "-"} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="State" value={values?.state || "-"} />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Establishment Verification"
          value={values?.establishmentVerification?.value || "-"}
        />
      </GridCol>
      {values?.establishmentVerification?.value ===
      "Does Not Exist on the address as per contract" ? (
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Status"
            value={values?.establishmentVerification?.status?.value || "-"}
          />
        </GridCol>
      ) : null}

      {values?.establishmentVerification?.status?.value ===
      "Exists on another address" ? (
        <Fragment>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Address"
              value={values?.establishmentVerification?.status?.address || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="City"
              value={values?.establishmentVerification?.status?.city || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="State"
              value={values?.establishmentVerification?.status?.state || "-"}
            />
          </GridCol>
        </Fragment>
      ) : null}

      {values?.establishmentVerification?.value ===
        "Exist on the address as per contract" ||
      values?.establishmentVerification?.status?.value ===
        "Exists on another address" ? (
        <Fragment>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Type of Establishment"
              value={
                values?.establishmentVerification?.status
                  ?.typeOfEstablishments || "-"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Type of Establishment"
              value={
                values?.establishmentVerification?.status
                  ?.typeOfEstablishments || "-"
              }
            />
          </GridCol>
        </Fragment>
      ) : null}

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Nature of work"
          value={values.natureOfWork || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Total Number of Employees working"
          value={values?.totalNoOfEmployeesWorking || 0}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="List of working employees"
          value={values?.listOfWorkingEmployees || "-"}
        />
      </GridCol>

      {values?.listOfWorkingEmployees === "Collected" ? (
        <GridCol span={{ sm: 12, md: 6 }}>
          <KeyValueContainer
            label="Whether list of working employee matches with members enrolled"
            value={values?.listOfEmpMatchWithMembersEnrolled || "-"}
          />
        </GridCol>
      ) : null}
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Employee-Employer relationship"
          value={values?.employeeAndEmployerRelationship || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Employee ID Card"
          value={values?.employeeIdCard || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Salary Proof"
          value={values?.salaryProof || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Investigation Summary"
          value={values?.investigationSummary || "-"}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Discrepancies Observed"
          value={values?.discrepanciesObserved || "-"}
        />
      </GridCol>
    </Grid>
  );
};

export default EmploymentTasks;
