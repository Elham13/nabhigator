import React, { useState } from "react";
import { Box, Button, Menu } from "@mantine/core";
import axios from "axios";
import DocumentsTable from "./DocumentsTable";
import {
  IDashboardData,
  NumericStage,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import {
  IGetDocumentDetailRes,
  IGetDocumentDetailsDoc,
} from "@/lib/utils/types/maximusResponseTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { getEncryptClaimId, showError } from "@/lib/helpers";

type PropTypes = {
  dashboardData: IDashboardData | null;
};

const DocumentsMenu = ({ dashboardData }: PropTypes) => {
  const [open, setOpen] = useState<boolean>(false);
  const [docs, setDocs] = useState<IGetDocumentDetailsDoc[]>([]);

  const getWDMSDocs = async (type: "claim" | "policy") => {
    try {
      const { data } = await axios.post<
        SingleResponseType<IGetDocumentDetailRes>
      >(EndPoints.WDMS_DOC_DETAIL, {
        claimId:
          type === "claim"
            ? dashboardData?.claimId
            : dashboardData?.applicationId,
        claimType: type === "claim" ? dashboardData?.claimType : "AppID",
      });
      setDocs(data?.data?.Documents);
      setOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  let encryptedClaimId: string = "";

  getEncryptClaimId(dashboardData?.claimId)
    .then((str) => {
      console.log("str: ", str);
      encryptedClaimId = str;
    })
    .catch((err) => showError(err));

  let link = `/pdf-view-and-download?claimId=${encryptedClaimId}`;

  if (process.env.NEXT_PUBLIC_CONFIG === "PROD") {
    link = `https://www.nivabupa.com${link}`;
  } else {
    link = `https://appform.nivabupa.com${link}`;
  }

  console.log("link: ", link);
  console.log("dashboardData?.claimId: ", dashboardData?.claimId);
  console.log("process.env.NEXT_PUBLIC_KEY: ", process.env.NEXT_PUBLIC_KEY);
  console.log("process.env.NEXT_PUBLIC_IV: ", process.env.NEXT_PUBLIC_IV);
  console.log("process.env.NEXT_PUBLIC_SALT: ", process.env.NEXT_PUBLIC_SALT);
  console.log("encryptedClaimId: ", encryptedClaimId);

  return (
    <>
      <DocumentsTable
        open={open}
        setOpen={setOpen}
        claimId={dashboardData?.claimId}
        docs={docs}
      />
      <Box className="float-right flex flex-col gap-y-2" my={20}>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button>Check Documents</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Reports</Menu.Label>
            <Menu.Item
              color="blue"
              onClick={() => {
                window.open(`${link}&docType=assignment`, "_blank");
              }}
            >
              Assignment Report
            </Menu.Item>
            {dashboardData?.stage &&
              [
                NumericStage.POST_QC,
                NumericStage.CLOSED,
                NumericStage.IN_FIELD_REWORK,
              ].includes(dashboardData?.stage) && (
                <Menu.Item
                  color="cyan"
                  onClick={() => {
                    window.open(`${link}&docType=investigation`, "_blank");
                  }}
                >
                  Investigation Report
                </Menu.Item>
              )}
            {dashboardData?.stage &&
              dashboardData?.stage === NumericStage.CLOSED && (
                <Menu.Item
                  color="grape"
                  onClick={() => {
                    window.open(
                      `${link}&docType=final-investigation-report`,
                      "_blank"
                    );
                  }}
                >
                  Final Investigation Report
                </Menu.Item>
              )}
            <Menu.Divider />
            <Menu.Label>WDMS Documents</Menu.Label>
            <Menu.Item color="green" onClick={() => getWDMSDocs("claim")}>
              Claim Documents
            </Menu.Item>
            <Menu.Item color="orange" onClick={() => getWDMSDocs("policy")}>
              Policy Documents
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </>
  );
};

export default DocumentsMenu;
