import { toast } from "react-toastify";
import {
  CaseDetail,
  DocumentData,
  ITasksAndDocuments,
  NumericStage,
  RevisedInvestigationFindings,
  Task,
  TValueCode,
} from "../utils/types/fniDataTypes";
import { DateInputProps } from "@mantine/dates";
import {
  FRCUGroundOfRepudiationOptions,
  FRCUGroundOfRepudiationProdOptions,
  FRCUOptions,
  FRCUProdOptions,
  QAFRCUGroundOfRepudiationOptions,
  QAFRCUGroundOfRepudiationProdOptions,
  recommendationOptions,
  recommendationProdOptions,
  rmMainObjectOptionsMap,
} from "../utils/constants/options";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IRMFindings } from "../utils/types/rmDataTypes";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const showError = (error: any) => {
  let message = error.response ? error.response.data.message : error.message;

  toast.error(message || "Something went wrong");
};

export function camelCaseToProperCase(input: string) {
  let result = "";
  let prevChar = ""; // Keep track of the previous character

  for (let i = 0; i < input.length; i++) {
    const currentChar = input[i];

    // If the current character is uppercase and not the first character
    if (currentChar === currentChar.toUpperCase() && i !== 0) {
      result += " "; // Add a space before the uppercase character
    }

    result += i === 0 ? currentChar.toUpperCase() : currentChar.toLowerCase();
    prevChar = currentChar;
  }

  return result;
}

export const getStageLabel = (stage: NumericStage) => {
  switch (stage) {
    case NumericStage.PENDING_FOR_PRE_QC:
      return "Pending for Pre-QC";
    case NumericStage.PENDING_FOR_ALLOCATION:
      return "Pending for Allocation";
    case NumericStage.PENDING_FOR_RE_ALLOCATION:
      return "Pending for Re-Allocation";
    case NumericStage.REJECTED:
      return "Rejected";
    case NumericStage.IN_FIELD_FRESH:
      return "In Field-Fresh";
    case NumericStage.IN_FIELD_REINVESTIGATION:
      return "In Field-Re-investigation";
    case NumericStage.CLOSED:
      return "Closed";
    case NumericStage.POST_QC:
      return "Post QA";
    case NumericStage.INVESTIGATION_ACCEPTED:
      return "Investigation Accepted";
    case NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING:
      return "Investigation Skipped And Completing";
    case NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING:
      return "Investigation Skipped And Re-Assigning";
    case NumericStage.IN_FIELD_REWORK:
      return "In Field Rework";
    default:
      return "";
  }
};

export const getStatusColor = (stage: NumericStage) => {
  if (stage === NumericStage.REJECTED) return "red";
  if (stage === NumericStage.PENDING_FOR_PRE_QC) return "green";
  if (stage === NumericStage.PENDING_FOR_ALLOCATION) return "cyan";
  if (stage === NumericStage.PENDING_FOR_RE_ALLOCATION) return "orange";
  if (stage === NumericStage.POST_QC) return "violet";
  if (stage === NumericStage.CLOSED) return "gray";
  if (stage === NumericStage.INVESTIGATION_ACCEPTED) return "indigo";
  if (stage === NumericStage.IN_FIELD_REWORK) return "lime";
  if (stage === NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING)
    return "pink";
  if (stage === NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING)
    return "grape";
  return "blue";
};

export const removeEmptyProperties = <T extends Record<string, any>>(
  obj: T
): T => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    const value = newObj[key];
    if (value === null || value === undefined || value === "") {
      delete newObj[key];
    }
  });
  return newObj;
};

export const dateParser: DateInputProps["dateParser"] = (input) => {
  if (input === "WW2") {
    return new Date(1939, 8, 1);
  }
  return new Date(input);
};

export const convertToIndianFormat = (amount: number, hideSymbol?: boolean) => {
  if (amount >= 100000)
    return `${!hideSymbol ? "₹ " : "Rs"}${(amount / 100000).toFixed(2)} L`;
  return `${!hideSymbol ? "₹ " : "Rs"}${new Intl.NumberFormat("en-US").format(
    amount
  )}`;
};

export const getSelectOption = (name: string) => {
  let env: "UAT" | "PROD" = "UAT";
  if (process.env.NEXT_PUBLIC_CONFIG === "PROD") env = "PROD";

  type OptionsType = Record<string, any>;

  const options: OptionsType = {
    FRCU: env === "UAT" ? FRCUOptions : FRCUProdOptions,
    FRCUGroundOfRep:
      env === "UAT"
        ? FRCUGroundOfRepudiationOptions
        : FRCUGroundOfRepudiationProdOptions,
    FRCUGroundOfRepQa:
      env === "UAT"
        ? QAFRCUGroundOfRepudiationOptions
        : QAFRCUGroundOfRepudiationProdOptions,
    recommendations:
      env === "UAT" ? recommendationOptions : recommendationProdOptions,
  };
  return options[name] || ([] as any[]);
};

export const getFinalOutcomeCode = (
  rec: TValueCode,
  groundOfRep: TValueCode[]
) => {
  if (rec?.value === "Repudiation") {
    if (groundOfRep && groundOfRep?.length > 0) {
      let found = groundOfRep?.find((el) => ["FC", "FP"].includes(el?.code));
      if (found) return found.code;

      found = groundOfRep?.find((el) => ["DM", "PE"].includes(el?.code));
      if (found) return found.code;

      found = groundOfRep?.find((el) => ["DN", "NC"].includes(el?.code));
      if (found) return found.code;

      return "";
    } else return "";
  } else {
    return rec.code;
  }
};

export const isImageUrl = (url: string) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|tif|tiff)$/i;
  return imageExtensions.test(url);
};

export const numberToOrdinal = (number: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = number % 100;

  // Check if the number falls within the special range where "th" is used
  const suffix =
    suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];

  return number + suffix;
};

export const buildUrl = (url: string, params: Record<string, any> = {}) => {
  const newUrl = new URL("http://localhost:3000/" + url);

  for (let k in params) {
    const value = params[k];
    if (!!value || value === 0) newUrl.searchParams.set(k, value);
  }

  let finalUrl = newUrl?.toString()?.split("?")[1];
  finalUrl = url + "?" + finalUrl;
  return finalUrl;
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str || str?.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

dayjs.extend(customParseFormat);
export const disableFuture = (current: Dayjs) => current > dayjs().endOf("day");

export const documentName = (url: string) => {
  if (url) {
    const urlArr = url?.split("/");
    let name = urlArr?.[urlArr?.length - 1];
    name = name?.replaceAll("%20", "")?.slice(0, 35);
    return name;
  }
  return "";
};

export const compareArrOfObjBasedOnProp = (
  arr1: Record<string, any>[],
  arr2: Record<string, any>[],
  prop1: string,
  prop2: string
) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i][prop1] !== arr2[i][prop2]) return false;
  }
  return true;
};

export const isWeekend = (date: string | Date) => {
  if (!date) return false;
  const dayOfWeek = dayjs(date).day();
  return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
};

export const flattenObject = (
  obj: Record<string, any>,
  parent: string = "",
  res: Record<string, any> = {}
) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
};

interface IConfigureRMTasks {
  claimSubType?: string;
  part?: "Insured" | "Hospital" | "None";
}

export const configureRMTasksAndDocuments = ({
  claimSubType,
  part,
}: IConfigureRMTasks) => {
  const newDocs = new Map<string, DocumentData[]>();
  const newTasks: Task[] = [];

  if (claimSubType === "In-patient Hospitalization") {
    for (const el of rmMainObjectOptionsMap) {
      let tempTasks = [
        "Insured Verification",
        "NPS Confirmation",
        "Vicinity Verification",
        "Hospital Verification",
        "Lab Part/Pathologist Verification",
        "Chemist Verification",
      ];

      if (part === "Insured") {
        tempTasks = [
          "Insured Verification",
          "NPS Confirmation",
          "Vicinity Verification",
        ];
      } else if (part === "Hospital") {
        tempTasks = [
          "Hospital Verification",
          "Lab Part/Pathologist Verification",
          "Chemist Verification",
        ];
      }

      if (tempTasks.includes(el?.name)) {
        const tempDocs = el?.options?.map((op) => ({
          name: op?.value,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }));
        newTasks?.push({ name: el?.name, completed: false, comment: "" });
        newDocs?.set(el?.name, tempDocs);
      }
    }
  } else if (claimSubType === "Pre-Post") {
    const tempOption = rmMainObjectOptionsMap?.find(
      (op) => op?.name === "Pre-Post Verification"
    );
    if (tempOption) {
      newTasks?.push({
        name: tempOption?.name,
        completed: false,
        comment: "",
      });
      newDocs.set(
        tempOption?.name,
        tempOption?.options?.map((op) => ({
          name: op?.value,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    }
  } else if (claimSubType === "Hospital Daily Cash") {
    const tempOption = rmMainObjectOptionsMap?.find(
      (op) => op?.name === "Hospital Daily Cash Part"
    );
    if (tempOption) {
      newTasks?.push({
        name: tempOption?.name,
        completed: false,
        comment: "",
      });
      newDocs.set(
        tempOption?.name,
        tempOption?.options?.map((op) => ({
          name: op?.value,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    }
  } else if (claimSubType === "OPD") {
    const tempOption = rmMainObjectOptionsMap?.find(
      (op) => op?.name === "OPD Verification Part"
    );
    if (tempOption) {
      newTasks?.push({
        name: tempOption?.name,
        completed: false,
        comment: "",
      });
      newDocs.set(
        tempOption?.name,
        tempOption?.options?.map((op) => ({
          name: op?.value,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    }
  } else if (claimSubType === "AHC") {
    const tempOption = rmMainObjectOptionsMap?.find(
      (op) => op?.name === "AHC Verification Part"
    );
    if (tempOption) {
      newTasks?.push({
        name: tempOption?.name,
        completed: false,
        comment: "",
      });
      newDocs.set(
        tempOption?.name,
        tempOption?.options?.map((op) => ({
          name: op?.value,
          docUrl: [],
          hiddenDocUrls: [],
          replacedDocUrls: [],
          location: null,
        }))
      );
    }
  }

  if (part !== "Insured") {
    for (const el of rmMainObjectOptionsMap) {
      if (["Miscellaneous Verification"].includes(el?.name)) {
        const tempDocs = el?.options
          ?.filter((op) =>
            [
              "Miscellaneous Verification Documents",
              "Customer Feedback Form",
              "GPS Photo",
              "Call Recording",
              "AVR",
            ].includes(op?.value)
          )
          ?.map((op) => ({
            name: op?.value,
            docUrl: [],
            hiddenDocUrls: [],
            replacedDocUrls: [],
            location: null,
          }));
        newTasks.push({ name: el?.name, completed: false, comment: "" });
        newDocs.set(el?.name, tempDocs);
      }
    }
  }
  return { newDocs, newTasks };
};

interface IValidateTasksAndDocsArgs {
  tasksAndDocs: ITasksAndDocuments;
  partName: "Insured" | "Hospital" | "None";
}

export const validateTasksAndDocs = (args: IValidateTasksAndDocsArgs) => {
  const { tasksAndDocs, partName } = args;

  if (tasksAndDocs?.tasks && tasksAndDocs?.tasks?.length > 0) {
    for (const task of tasksAndDocs?.tasks) {
      if (["NPS Confirmation"].includes(task?.name)) continue;
      const documents = new Map(
        tasksAndDocs?.docs
          ? tasksAndDocs?.docs instanceof Map
            ? tasksAndDocs?.docs
            : Object.entries(tasksAndDocs?.docs)
          : []
      );
      const doc = documents?.get(task?.name);
      if (!doc || doc?.length < 1)
        throw new Error(
          `Select some documents for the task ${task?.name} ${
            partName !== "None" && `in ${partName} Part`
          }`
        );
    }
  } else
    throw new Error(
      `No tasks are selected ${partName !== "None" && `in ${partName} Part`}`
    );
};

type IFindFindingsArgs = {
  claimType?: "PreAuth" | "Reimbursement";
  claimCase: CaseDetail | null;
};

export const getTasksAndDocs = ({
  claimType,
  claimCase,
}: IFindFindingsArgs) => {
  interface IResult {
    tasksAndDocs: ITasksAndDocuments | null;
    tasksAndDocsHospital: ITasksAndDocuments | null;
    rmFindings: IRMFindings | null;
    rmFindingsHospital: IRMFindings | null;
    rmFindingsQA: IRMFindings | null;
    rmFindingsQAHospital: IRMFindings | null;
    preAuthFindings: RevisedInvestigationFindings | null;
    preAuthFindingsHospital: RevisedInvestigationFindings | null;
    preAuthFindingsQA: RevisedInvestigationFindings | null;
    preAuthFindingsQAHospital: RevisedInvestigationFindings | null;
  }

  const result: IResult = {
    tasksAndDocs: null,
    tasksAndDocsHospital: null,
    rmFindings: null,
    rmFindingsHospital: null,
    rmFindingsQA: null,
    rmFindingsQAHospital: null,
    preAuthFindings: null,
    preAuthFindingsHospital: null,
    preAuthFindingsQA: null,
    preAuthFindingsQAHospital: null,
  };

  const isSingleAllocation = claimCase?.allocationType === "Single";
  const isDualAllocation = claimCase?.allocationType === "Dual";

  if (claimType === "PreAuth" || claimType === "Reimbursement") {
    const tasksAndDocs = isSingleAllocation
      ? claimCase?.singleTasksAndDocs
      : isDualAllocation
      ? claimCase?.insuredTasksAndDocs
      : null;

    result.tasksAndDocs = tasksAndDocs;
    if (isDualAllocation) {
      result.tasksAndDocsHospital = claimCase?.hospitalTasksAndDocs;
    }

    if (claimType === "PreAuth") {
      result.preAuthFindings = tasksAndDocs?.preAuthFindings || null;
      result.preAuthFindingsHospital = isSingleAllocation
        ? tasksAndDocs?.preAuthFindings || null
        : result.tasksAndDocsHospital?.preAuthFindings || null;
      result.preAuthFindingsQA = tasksAndDocs?.preAuthFindingsPostQa || null;
      result.preAuthFindingsQAHospital = isSingleAllocation
        ? tasksAndDocs?.preAuthFindingsPostQa || null
        : result.tasksAndDocsHospital?.preAuthFindingsPostQa || null;
    } else if (claimType === "Reimbursement") {
      result.rmFindings = tasksAndDocs?.rmFindings || null;
      result.rmFindingsHospital = isSingleAllocation
        ? tasksAndDocs?.rmFindings || null
        : result.tasksAndDocsHospital?.rmFindings || null;
      result.rmFindingsQA = tasksAndDocs?.rmFindingsPostQA || null;
      result.rmFindingsQAHospital = isSingleAllocation
        ? tasksAndDocs?.rmFindingsPostQA || null
        : result.tasksAndDocsHospital?.rmFindingsPostQA || null;
    }
  }

  return result;
};

const hexToBytes = (hex?: string) => {
  if (!hex) return;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

export const decryptAppID = async (encryptedText: string) => {
  const IV = process.env.NEXT_PUBLIC_IV;
  const KEY = process.env.NEXT_PUBLIC_KEY;
  const salt = process.env.NEXT_PUBLIC_SALT || "";

  const decIV = hexToBytes(IV);
  const decKey = hexToBytes(KEY);

  try {
    if (!decKey || !decIV) throw new Error("decKey or decIV is undefined");
    const algorithm = { name: "AES-CBC", iv: decIV };
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      decKey,
      algorithm,
      false,
      ["decrypt"]
    );

    const encryptedArray = new Uint8Array(Buffer.from(encryptedText, "hex"));
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      algorithm,
      cryptoKey,
      encryptedArray
    );

    let decrypted = new TextDecoder().decode(decryptedArrayBuffer);
    const originalPlainText = decrypted?.slice(
      0,
      decrypted?.length - salt?.length
    );
    return originalPlainText;
  } catch (error) {
    // try base 64 decode.
    let bufferObj = Buffer.from(encryptedText, "base64");

    // Encode the Buffer as a utf8 string
    let decodedString = bufferObj.toString("utf8");
    return decodedString;
  }
};

export const encryptPlainText = async (plaintext: string): Promise<string> => {
  const fixedKey = process.env.NEXT_PUBLIC_KEY as string;
  const fixedIV = process.env.NEXT_PUBLIC_IV as string;
  const salt = process.env.NEXT_PUBLIC_SALT || ""; // generates a random 8-byte salt
  const strDecKey = hexToBytes(fixedKey);
  const strFixedIV = hexToBytes(fixedIV);

  if (!strDecKey || !strFixedIV) return "";
  const algorithm = { name: "AES-CBC", iv: strFixedIV };
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    strDecKey,
    algorithm,
    false,
    ["encrypt"]
  );

  const textToEncrypt = new TextEncoder().encode(plaintext + salt);
  const encryptedArrayBuffer = await crypto.subtle.encrypt(
    algorithm,
    cryptoKey,
    textToEncrypt
  );

  let encrypted = Buffer.from(encryptedArrayBuffer).toString("hex");
  return encrypted;
};

export const getEncryptClaimId = async (claimId?: number) => {
  if (!claimId) return "";
  const encryptedClaimId = await encryptPlainText(claimId?.toString());

  return encryptedClaimId;
};

export const getOpenAndClosureTAT = ({
  stage,
  dateOfClosure,
  intimationDate,
}: {
  stage?: NumericStage;
  dateOfClosure?: Date | null;
  intimationDate?: string | null;
}) => {
  return {
    openTAT:
      !!stage && [NumericStage.CLOSED, NumericStage.REJECTED].includes(stage)
        ? dateOfClosure
          ? dayjs(dateOfClosure).diff(dayjs(intimationDate), "days")
          : 0
        : dayjs().diff(dayjs(intimationDate), "days"),
    closureTAT:
      !!stage &&
      [NumericStage.CLOSED, NumericStage.REJECTED].includes(stage) &&
      dateOfClosure
        ? dayjs().diff(dayjs(dateOfClosure), "days")
        : 0,
  };
};

export const getSignedUrlHelper = async (url: string) => {
  try {
    if (!url) throw new Error("url is required");
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
    const command = new GetObjectCommand({ Bucket: bucketName, Key: url });
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error: any) {
    showError(error);
    return "";
  }
};
