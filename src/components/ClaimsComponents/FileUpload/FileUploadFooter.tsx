import React, { useState } from "react";
import Image from "next/image";
import { documentName, getSignedUrlHelper, isImageUrl } from "@/lib/helpers";
import { IoEyeOutline, IoLinkOutline } from "react-icons/io5";
import PopConfirm from "@/components/PopConfirm";
import { MdOutlineDelete } from "react-icons/md";
import { Modal } from "@mantine/core";

type PropTypes = {
  url: string;
  onDelete: () => void;
};

const FileUploadFooter = ({ url, onDelete }: PropTypes) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<string>("");

  const docName = documentName(url) || "";

  getSignedUrlHelper(url).then((str) => setSignedUrl(str));

  return (
    <div className="flex items-center justify-between text-xs text-slate-300 group px-2 py-1 rounded hover:bg-slate-200">
      <p className="flex items-center gap-2">
        <IoLinkOutline />
        {docName}
      </p>
      <div className="flex items-center gap-x-4">
        <button
          className="p-0 text-green-600 text-xl"
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
          <button className="p-0 text-red-600 text-xl">
            <MdOutlineDelete />
          </button>
        </PopConfirm>
      </div>
      {visible ? (
        <Modal opened={visible} onClose={() => setVisible(false)} size="xl">
          <p>{docName}</p>
          <div className="mt-4">
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
