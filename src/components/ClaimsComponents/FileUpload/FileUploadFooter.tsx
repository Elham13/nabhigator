import React, { useEffect, useState } from "react";
import { DeleteOutlined, EyeOutlined, LinkOutlined } from "@ant-design/icons";
import { Modal, Popconfirm } from "antd";
import Image from "next/image";
import axios from "axios";
import { documentName, isImageUrl, showError } from "@/lib/helpers";
import { SingleResponseType } from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";

type PropTypes = {
  url: string;
  onDelete: () => void;
};

const FileUploadFooter = ({ url, onDelete }: PropTypes) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [signedUrl, setSignedUrl] = useState<string>("");

  const docName = documentName(url) || "";

  useEffect(() => {
    const getUrl = async () => {
      try {
        const { data } = await axios.post<
          SingleResponseType<{ signedUrl: string }>
        >(EndPoints.GET_SIGNED_URL, { docKey: url });
        setSignedUrl(data?.data?.signedUrl);
      } catch (error: any) {
        showError(error);
      }
    };

    getUrl();
  }, [url]);

  return (
    <div className="flex items-center justify-between text-xs text-slate-300 group px-2 py-1 rounded hover:bg-slate-200">
      <p className="flex items-center gap-2">
        <LinkOutlined />
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
          <EyeOutlined />
        </button>
        <Popconfirm
          title="Confirm Delete"
          description="Are you sure you want to delete this file?"
          onConfirm={onDelete}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ style: { backgroundColor: "green" } }}
        >
          <button className="p-0 text-red-600 text-xl">
            <DeleteOutlined />
          </button>
        </Popconfirm>
      </div>
      {visible ? (
        <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
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
