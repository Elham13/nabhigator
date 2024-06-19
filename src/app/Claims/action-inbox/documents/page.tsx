import React from "react";
import { S3 } from "aws-sdk";
import { isImageUrl } from "@/lib/helpers";
import Image from "next/image";

let docUrl =
  "https://beta-aem-uat-assets.s3.ap-south-1.amazonaws.com/fni-docs/policykit.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZ2KPLGNDISJP34EB%2F20240103%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240103T100440Z&X-Amz-Expires=216000&X-Amz-Signature=5b0b418c39576c30d0a33c4b8232bb49d5f28f025c90150f743a381ad9f4b6a2&X-Amz-SignedHeaders=host";
let docUrl2 =
  "https://beta-aem-uat-assets.s3.ap-south-1.amazonaws.com/fni-docs/NCO-codes5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZ2KPLGNDISJP34EB%2F20240103%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240103T132351Z&X-Amz-Expires=216000&X-Amz-Signature=c00e86a9b4ef6165b2de9add09526f647d031c238bb523ca8d19c4be1b9902f4&X-Amz-SignedHeaders=host";
let imgUrl =
  "https://beta-aem-uat-assets.s3.ap-south-1.amazonaws.com/fni-docs/welcome-to-IPFS.4ab0c1f9.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZ2KPLGNDISJP34EB%2F20240103%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240103T115536Z&X-Amz-Expires=216000&X-Amz-Signature=cd14592648dafffccd83ad5eb514300211449e767446ff3c99a3856599b931d9&X-Amz-SignedHeaders=host";

type TSearchParams = {
  url: string;
  name: string;
};

type PropTypes = {
  params: Record<string, any>;
  searchParams: TSearchParams;
};

const Documents = async ({ searchParams }: PropTypes) => {
  const { url, name } = searchParams;

  const s3 = new S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID_UAT,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY_ID_UAT,
    region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION_UAT,
  });

  const bucketName =
    process.env.NEXT_PUBLIC_CONFIG == "LOCAL"
      ? process.env.NEXT_PUBLIC_S3_BUCKET_NAME_UAT
      : process.env.NEXT_PUBLIC_S3_BUCKET_NAME_PROD;

  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: url,
    Expires: 60 * 60 * 60,
  });

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-2xl font-semibold">{name}</h1>
      {!!signedUrl ? (
        isImageUrl(signedUrl?.split("?")[0]) ? (
          <Image
            src={signedUrl}
            className="h-[90vh] block w-auto"
            height={100}
            width={100}
            alt="Uploaded Image"
            unoptimized
          />
        ) : (
          <iframe src={signedUrl} className="h-[90vh] w-[70vw]"></iframe>
        )
      ) : (
        <div>No content</div>
      )}
    </div>
  );
};

export default Documents;
