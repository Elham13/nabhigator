import React from "react";
import { Col, FormInstance, Row } from "antd";
import FileUpload from "@/components/ClaimsComponents/FileUpload";
import { IInsuredVerification } from "@/lib/utils/types/rmDataTypes";

type PropTypes = {
  name?: number;
  claimId?: number;
  form: FormInstance<IInsuredVerification>;
  fieldNames?: string[];
  fieldName?: string | string[];
  label: string;
  remove?: (index: number | number[]) => void;
};

const UploadProof = ({
  name,
  claimId,
  form,
  fieldName,
  fieldNames,
  label,
  remove,
}: PropTypes) => {
  const fieldValue = fieldNames
    ? form?.getFieldValue([...fieldNames, name])
    : fieldName
    ? form?.getFieldValue(fieldName)
    : "";

  const doc = {
    docUrl: fieldValue,
    location: null,
    hiddenDocUrls: [],
    replacedDocUrls: [],
    name: "",
    _id: "",
  };

  const getUrl = (
    docId: string,
    docName: string,
    docUrl: string,
    action: "Add" | "Remove"
  ) => {
    if (action === "Add") {
      fieldNames
        ? form?.setFieldValue([...fieldNames, name], docUrl)
        : fieldName
        ? form?.setFieldValue(fieldName, docUrl)
        : null;
    } else {
      !!name && !!remove ? remove(name) : form?.setFieldValue(fieldName, "");
    }
  };

  return (
    <Row gutter={10}>
      <Col xs={24}>
        <label className="mb-4 text-base block">{label}</label>
        <FileUpload
          claimId={claimId || 0}
          docName=""
          disabled={false}
          doc={doc}
          getUrl={getUrl}
        />
      </Col>
    </Row>
  );
};

export default UploadProof;
