import React, { useEffect, useState } from "react";
import {
  Document,
  Font,
  PDFDownloadLink,
  Page,
  StyleSheet,
} from "@react-pdf/renderer";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";
import AssignmentSummary from "@/app/pdf-view-and-download/components/AssignmentSummary";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `/navigator-admin/fonts/Roboto/Roboto-Regular.ttf`,
    },
    {
      src: `/navigator-admin/fonts/Roboto/Roboto-Bold.ttf`,
      fontWeight: "bold",
    },
    {
      src: `/navigator-admin/fonts/Roboto/Roboto-Italic.ttf`,
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: `/navigator-admin/fonts/Roboto/Roboto-BoldItalic.ttf`,
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

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
  data: IDashboardData | null;
  caseData: CaseDetail | null;
};

const DownloadableDoc = ({ data, caseData }: PropTypes) => {
  return (
    <Document>
      <Page size={[1450, 1900]} style={styles.page}>
        <AssignmentSummary
          data={data}
          caseData={caseData}
          docType="assignment"
          title="Assignment Summary"
        />
      </Page>
    </Document>
  );
};

const DownloadAssignmentSummary = ({ data, caseData }: PropTypes) => {
  const [isClient, setIsClient] = useState(false);

  // had to be done so as to make it client side.
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div>
      <PDFDownloadLink
        className="bg-blue-600 text-white p-2 rounded-md text-center mt-4"
        document={<DownloadableDoc data={data} caseData={caseData} />}
        fileName={`${data?.claimId}assignment.pdf`}
      >
        Download Assignment Summary
      </PDFDownloadLink>
    </div>
  ) : null;
};

export default DownloadAssignmentSummary;
