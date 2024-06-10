import { toast } from "react-toastify";
import { NumericStage, TValueCode } from "../utils/types/fniDataTypes";
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
} from "../utils/constants/options";
import { NextApiRequest } from "next";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AWS from "aws-sdk";

export const showError = (error: any) => {
  const message = error.response ? error.response.data.message : error.message;
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

export const uploadFile = async (file: File, claimId: number) => {
  try {
    const bucketName =
      process.env.NEXT_PUBLIC_CONFIG === "PROD"
        ? process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROD
        : process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UAT;

    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_UAT,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID_UAT,
      region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION_UAT,
    });

    const name = `${claimId || "claimIdNotFound"}/${dayjs().unix()}-${
      file?.name
    }`;

    const params = {
      Bucket: bucketName || "",
      Key: `fni-docs/${name}` || "",
      Body: file,
      ContentType: file.type,
    };

    await s3.upload(params).promise();
    return params?.Key;
  } catch (error) {
    showError(error);
    return "";
  }
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
