"use server";

import { Document, HydratedDocument } from "mongoose";
import ClaimCase from "../Models/claimCase";
import {
  CaseDetail,
  DocumentMap,
  EventNames,
  IDashboardData,
} from "../utils/types/fniDataTypes";
import { captureCaseEvent } from "@/app/api/Claims/caseEvent/helpers";
import DashboardData from "../Models/dashboardData";
import dayjs from "dayjs";
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

type ArgsType = {
  action: "hide" | "unhide" | "replace";
  caseId: string;
  taskName: string;
  name: string;
  userName: string;
  docIndex: number;
  typeOfDoc: "single" | "insured" | "hospital";
  data?: FormData;
};

async function blobToUint8Array(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export const modifyDocument = async (args: ArgsType) => {
  const {
    action,
    caseId,
    taskName,
    name,
    userName,
    docIndex,
    typeOfDoc,
    data,
  } = args;
  let message = "Nothing changed";
  try {
    const claimCase: HydratedDocument<CaseDetail> | null =
      await ClaimCase.findById(caseId);

    if (!claimCase) throw new Error(`No case found with the id ${caseId}`);

    let documents: DocumentMap | null = null;
    let updatedData: CaseDetail | null = null;

    if (typeOfDoc === "single")
      documents = (claimCase?.singleTasksAndDocs?.docs as DocumentMap) || null;
    else if (typeOfDoc === "insured")
      documents = (claimCase?.insuredTasksAndDocs?.docs as DocumentMap) || null;
    else if (typeOfDoc === "hospital")
      documents =
        (claimCase?.hospitalTasksAndDocs?.docs as DocumentMap) || null;

    const dashboardData: HydratedDocument<IDashboardData> | null =
      await DashboardData.findOne({ caseId });

    if (!dashboardData) throw new Error("No data found");

    if (!!documents) {
      let docArray = documents.get(taskName);
      if (!docArray)
        throw new Error(`No documents found with the name ${taskName}`);

      let targetDocObj = docArray.find((el) => el?.name === name);

      if (!targetDocObj)
        throw new Error(`No documents found with the name ${name}`);

      if (["hide", "unhide"].includes(action)) {
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

        updatedData = await claimCase.save();
      } else if (action === "replace") {
        if (!data) throw new Error("Missing File content");
        let file: File | null = data.get("file") as unknown as File;

        const replacedDocUrls = targetDocObj?.replacedDocUrls || [];
        const targetUrl = targetDocObj?.docUrl[docIndex];
        if (!targetUrl)
          throw new Error(`No document url found at index ${docIndex}`);

        replacedDocUrls?.push(targetUrl);

        const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_UAT;
        const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID_UAT;
        const region = process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION_UAT;
        const bucketName =
          process.env.NEXT_PUBLIC_CONFIG === "PROD"
            ? process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROD
            : process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UAT;
        if (!accessKeyId) throw new Error("accessKeyId is required");
        if (!secretAccessKey) throw new Error("secretAccessKey is required");
        if (!region) throw new Error("region is required");
        if (!bucketName) throw new Error("bucketName is required");

        const client = new S3Client({
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          region,
        });

        const name = `${
          dashboardData?.claimId || "claimIdNotFound"
        }/${dayjs().unix()}-${file?.name}`;

        const input: PutObjectCommandInput = {
          Bucket: bucketName || "",
          Key: `fni-docs/${name}` || "",
          Body: await blobToUint8Array(file),
          ContentType: file.type,
        };

        const command = new PutObjectCommand(input);
        await client.send(command);

        targetDocObj?.docUrl?.splice(docIndex, 0, input?.Key as string);
        targetDocObj.replacedDocUrls = replacedDocUrls;

        docArray = docArray?.map((el) => {
          if (el?.name === name) return targetDocObj;
          return el;
        });

        documents.set(taskName, docArray);
        message = `Document replaced successfully`;

        await captureCaseEvent({
          eventName: EventNames.DOCUMENT_REPLACED,
          intimationDate:
            dashboardData?.intimationDate || new Date().toLocaleDateString(),
          stage: dashboardData?.stage,
          claimId: dashboardData?.claimId,
          eventRemarks: `The document replaced with ${input?.Key}`,
          userName,
        });

        updatedData = await claimCase.save();
      } else {
        throw new Error("Wrong action");
      }
    } else throw new Error("No documents found");
    return {
      success: true,
      message,
      updatedData: !!updatedData
        ? updatedData instanceof Document
          ? (updatedData?.toJSON() as CaseDetail)
          : updatedData
        : null,
    };
  } catch (error: any) {
    return { success: false, message: error?.message, updatedData: null };
  }
};
