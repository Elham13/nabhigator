import React from "react";
import { Title } from "@mantine/core";

type PropTypes = {
  params: Record<string, any>;
  searchParams: { pdfSrc: string };
};

const PDFViewer = ({ searchParams }: PropTypes) => {
  const pdfSrc = searchParams?.pdfSrc;

  if (!pdfSrc)
    return (
      <Title order={2} mt={20} ta="center" c="red">
        No file to View
      </Title>
    );

  return <iframe src={pdfSrc} width="100%" height="600px" title="PDF Viewer" />;
};

export default PDFViewer;
