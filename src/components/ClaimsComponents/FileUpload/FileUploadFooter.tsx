import React, { useEffect, useState } from "react";
import Image from "next/image";
import { documentName, getSignedUrlHelper, isImageUrl } from "@/lib/helpers";
import { IoEyeOutline, IoLinkOutline } from "react-icons/io5";
import PopConfirm from "@/components/PopConfirm";
import { MdOutlineDelete } from "react-icons/md";
import { Button, Modal } from "@mantine/core";

type PropTypes = {
  url: string;
  onDelete: () => void;
};

const FileUploadFooter = ({ url, onDelete }: PropTypes) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<string>("");

  const docName = documentName(url) || "";

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = signedUrl;
    a.download = docName; // Optional
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    (async () => {
      if (!!url) {
        const str = await getSignedUrlHelper(url);
        if (str) setSignedUrl(str);
      }
    })();
  }, [url]);

  return (
    <div className="flex items-center justify-between text-xs text-slate-300 group px-2 py-1 rounded hover:bg-slate-200">
      <p className="flex items-center gap-2">
        <IoLinkOutline />
        {docName}
      </p>
      <div className="flex items-center gap-x-4">
        <button
          className="p-0 text-green-600 text-xl"
          type="button"
          onClick={() => {
            if (isImageUrl(url)) {
              setVisible(true);
            } else {
              window.open(signedUrl, "_black");
            }
          }}
        >
          <IoEyeOutline />
        </button>
        <PopConfirm
          title="Confirm Delete"
          description="Are you sure you want to delete this file?"
          onConfirm={onDelete}
        >
          <button className="p-0 text-red-600 text-xl" type="button">
            <MdOutlineDelete />
          </button>
        </PopConfirm>
      </div>
      {visible ? (
        <Modal opened={visible} onClose={() => setVisible(false)} size="xl">
          <p>{docName}</p>
          <div className="mt-4">
            <Button onClick={handleDownload}>Download</Button>
            {isImageUrl(url) ? (
              <Image
                alt="Uploaded Image"
                src={signedUrl}
                className="w-full h-auto"
                width={200}
                height={200}
                unoptimized
              />
            ) : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default FileUploadFooter;
