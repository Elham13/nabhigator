import React, { useState } from "react";
import { Button } from "@mantine/core";
import axios from "axios";
import {
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import DocumentsTable from "@/components/ClaimsComponents/documentsMenu/DocumentsTable";
import { showError } from "@/lib/helpers";
import {
  IGetDocumentDetailRes,
  IGetDocumentDetailsDoc,
} from "@/lib/utils/types/maximusResponseTypes";
import { EndPoints } from "@/lib/utils/types/enums";

type PropTypes = {
  dashboardData: IDashboardData | null;
};

const WDMSDocuments = ({ dashboardData }: PropTypes) => {
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

  return (
    <div>
      <DocumentsTable
        open={open}
        setOpen={setOpen}
        docs={docs}
        claimId={dashboardData?.claimId}
      />
      <Button variant="outline" fullWidth onClick={() => getWDMSDocs("claim")}>
        Claim Documents Check / Download
      </Button>
      <Button variant="outline" fullWidth onClick={() => getWDMSDocs("policy")}>
        Policy Documents Check / Download
      </Button>
    </div>
  );
};

export default WDMSDocuments;
