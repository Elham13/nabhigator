"use server";

import { HydratedDocument } from "mongoose";
import ClaimCase from "../Models/claimCase";
import {
  CaseDetail,
  DocumentMap,
  EventNames,
  IDashboardData,
} from "../utils/types/fniDataTypes";
import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import DashboardData from "../Models/dashboardData";

type ArgsType = {
  action: "hide" | "unhide" | "replace";
  caseId: string;
  taskName: string;
  name: string;
  userName: string;
  docIndex: number;
  data?: FormData;
};

export const modifyDocument = async (args: ArgsType) => {
  const { action, caseId, taskName, name, userName, docIndex, data } = args;
  let message = "Nothing changed";
  try {
    if (["hide", "unhide"].includes(action)) {
      const claimCase: HydratedDocument<CaseDetail> | null =
        await ClaimCase.findById(caseId);

      if (!claimCase) throw new Error(`No case found with the id ${caseId}`);

      const documents = claimCase?.documents as DocumentMap;

      const dashboardData: HydratedDocument<IDashboardData> | null =
        await DashboardData.findOne({ caseId });

      if (!dashboardData) throw new Error("No data found");
      if (documents) {
        let docArray = documents.get(taskName);
        if (!docArray)
          throw new Error(`No documents found with the name ${taskName}`);

        let targetDocObj = docArray.find((el) => el?.name === name);

        if (!targetDocObj)
          throw new Error(`No documents found with the name ${name}`);

        let hiddenDocUrls = targetDocObj?.hiddenDocUrls || [];
        const targetUrl = targetDocObj?.docUrl[docIndex];

        if (!targetUrl)
          throw new Error(`No document url found at index ${docIndex}`);

        if (action === "hide") hiddenDocUrls.push(targetUrl);
        else hiddenDocUrls = hiddenDocUrls?.filter((url) => url !== targetUrl);

        docArray = docArray?.map((el) => {
          if (el?.name === name) return { ...el, hiddenDocUrls };
          return el;
        });

        documents.set(taskName, docArray);
        message = `${name} document ${
          action === "hide" ? "Deleted" : "Restored"
        } successfully`;

        claimCase.documents = documents;

        await captureCaseEvent({
          eventName:
            action === "hide"
              ? EventNames.DOCUMENT_DELETED
              : EventNames.DOCUMENT_RESTORED,
          intimationDate:
            dashboardData?.intimationDate || new Date().toLocaleDateString(),
          stage: dashboardData?.stage,
          claimId: dashboardData?.claimId,
          eventRemarks: `The "${name}" document is ${
            action === "hide" ? "deleted" : "restored"
          }`,
          userName,
        });

        await claimCase.save();
      }
    } else if (action === "replace") {
      if (!data) throw new Error("Missing File content");
      const file: File | null = data.get("file") as unknown as File;
    } else {
      throw new Error("Wrong action");
    }
    return { success: true, message };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};
