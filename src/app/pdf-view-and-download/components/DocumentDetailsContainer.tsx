"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import DocumentsContainer from "./DocumentsContainer";
import { Font, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { TDocType } from "../page";
import LocalDocsView from "./LocalDocsView";
import { CaseDetail, IDashboardData } from "@/lib/utils/types/fniDataTypes";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: `/navigator-admin-images/fonts/Roboto/Roboto-Regular.ttf`,
    },
    {
      src: `/navigator-admin-images/fonts/Roboto/Roboto-Bold.ttf`,
      fontWeight: "bold",
    },
    {
      src: `/navigator-admin-images/fonts/Roboto/Roboto-Italic.ttf`,
      fontWeight: "normal",
      fontStyle: "italic",
    },
    {
      src: `/navigator-admin-images/fonts/Roboto/Roboto-BoldItalic.ttf`,
      fontWeight: "bold",
      fontStyle: "italic",
    },
  ],
});

type PropTypes = {
  docType: TDocType;
  caseData: CaseDetail | null;
  dashboardData: IDashboardData | null;
  invType?: "Internal" | "External";
};

const DocumentDetailsContainer = ({
  docType,
  caseData,
  dashboardData,
  invType,
}: PropTypes) => {
  const [isClient, setIsClient] = useState(false);

  // had to be done so as to make it client side.
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Box className="flex items-center gap-x-4">
        <PDFDownloadLink
          className="bg-orange-500 text-white p-4 rounded-lg w-48 text-center font-bold"
          document={
            <DocumentsContainer
              docType={docType}
              dashboardData={dashboardData}
              caseData={caseData}
              invType={invType}
            />
          }
          fileName={`${dashboardData?.claimId}${docType}.pdf`}
        >
          Click to download
        </PDFDownloadLink>
        {docType === "final-investigation-report" && (
          <LocalDocsView
            caseData={caseData}
            claimType={dashboardData?.claimType}
          />
        )}
      </Box>
      <PDFViewer showToolbar={false} style={{ width: "80vw", height: "100vh" }}>
        <DocumentsContainer
          docType={docType}
          dashboardData={dashboardData}
          caseData={caseData}
          invType={invType}
        />
      </PDFViewer>
    </div>
  ) : null;
};

export default DocumentDetailsContainer;
