import React from "react";
import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { TDocType } from "../page";
import AssignmentSummary from "./AssignmentSummary";
import AuthorizationLetter from "./AuthorizationLetter";
import FieldInvestigationReport from "./FieldInvestigationReport";
import FinalInvestigationReport from "./FinalInvestigationReport";
import NoData from "./NoData";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 40,
    fontSize: 12,
    fontFamily: "Roboto",
  },
});

type PropTypes = {
  docType: TDocType;
  dashboardData: IDashboardData | null;
  caseData: CaseDetail | null;
  invType?: "Internal" | "External";
};

const DocumentsContainer = ({
  docType,
  dashboardData,
  caseData,
  invType,
}: PropTypes) => {
  return (
    <Document>
      <Page size={[1450, 1900]} style={styles.page}>
        {docType === "assignment" ? (
          <AssignmentSummary
            data={dashboardData}
            caseData={caseData}
            docType={docType}
            title="Assignment Summary"
          />
        ) : docType === "authorization-letter" ? (
          <AuthorizationLetter dashboardData={dashboardData} />
        ) : docType === "investigation" ? (
          <FieldInvestigationReport
            dashboardData={dashboardData}
            caseData={caseData}
            docType={docType}
          />
        ) : docType === "final-investigation-report" ? (
          <FinalInvestigationReport
            dashboardData={dashboardData}
            caseData={caseData}
            docType={docType}
            invType={invType}
          />
        ) : (
          <NoData />
        )}
      </Page>
    </Document>
  );
};

export default DocumentsContainer;
