import React, { useState, ChangeEvent } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Divider, Progress } from "antd";
import { toast } from "react-toastify";
import FileUploadFooter from "./FileUploadFooter";
import dayjs from "dayjs";
import { DocumentData } from "@/lib/utils/types/fniDataTypes";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

type PropType = {
  doc: DocumentData | Omit<DocumentData, "location">;
  docName: string;
  disabled: boolean;
  claimId: number;
  getUrl: (
    docId: string,
    docName: string,
    docUrl: string,
    action: "Add" | "Remove",
    docIndex?: number
  ) => void;
};

const FileUpload = ({ doc, docName, disabled, claimId, getUrl }: PropType) => {
  const [progress, setProgress] = useState(0);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || "";
    handleFileUpload(file || null);
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file || progress > 0) return;

    let bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UAT;

    if (process.env.NEXT_PUBLIC_CONFIG === "PROD")
      bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROD;

    try {
      const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_UAT;
      const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID_UAT;

      if (!accessKeyId || !secretAccessKey)
        throw new Error("Failed to get environment variables");

      const s3Client = new S3Client({
        region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION_UAT,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const params = {
        Bucket: bucketName || "",
        Key: `fni-docs/${claimId || "claimIdNotFound"}/${dayjs().unix()}-${
          file.name
        }`,
        Body: file,
        ContentType: file.type,
      };

      const upload = new Upload({
        client: s3Client,
        params,
        leavePartsOnError: false, // Optional, to clean up any parts if the upload fails
      });

      upload.on("httpUploadProgress", (p) => {
        const loaded = p?.loaded || 0;
        const total = p?.total || 0;
        const percent = Math.floor((loaded / total) * 100);

        setProgress(percent);
        if (percent >= 100) {
          setTimeout(() => setProgress(0), 1000);
        }
      });
      await upload.done();

      getUrl(doc._id as string, docName, params.Key, "Add");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemove = () => {
    getUrl(doc._id as string, docName, "", "Remove");
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div
          className={`text-xs cursor-pointer flex items-center gap-2 border border-opacity-30 w-fit rounded py-2 px-4 relative ${
            disabled && "bg-slate-600 opacity-50"
          }`}
        >
          <UploadOutlined />
          <span>Upload {doc.name}</span>
          <input
            type={disabled ? "submit" : "file"}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:bg-slate-300"
            onChange={uploadFile}
          />
        </div>
      </div>
      {doc.docUrl ? (
        typeof doc?.docUrl === "string" ? (
          <FileUploadFooter url={doc.docUrl} onDelete={handleRemove} />
        ) : (
          Array.isArray(doc?.docUrl) &&
          doc?.docUrl?.length > 0 &&
          doc?.docUrl?.map((url, ind) => (
            <FileUploadFooter
              key={ind}
              url={url}
              onDelete={() => {
                getUrl(doc._id as string, docName, "", "Remove", ind);
              }}
            />
          ))
        )
      ) : null}
      {progress > 0 ? <Progress percent={progress} /> : null}
      <Divider />
    </div>
  );
};

export default FileUpload;
