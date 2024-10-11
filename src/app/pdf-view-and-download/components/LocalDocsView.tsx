import React, { Fragment } from "react";
import { Button, Menu } from "@mantine/core";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { CaseDetail, DocumentData } from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";
import { BiHide } from "react-icons/bi";

type PropTypes = {
  caseData: CaseDetail | null;
  claimType?: "PreAuth" | "Reimbursement";
};

const LocalDocsView = ({ caseData, claimType }: PropTypes) => {
  const { tasksAndDocs, preAuthFindings } = getTasksAndDocs({
    claimType,
    claimCase: caseData,
  });

  const docs: Record<string, DocumentData[]> = tasksAndDocs?.docs as any;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>Other documents</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Investigator&apos;s Uploads</Menu.Label>
        {docs &&
          Object.keys(docs)?.map((docKey, ind) => {
            const doc = docs[docKey];
            return (
              <Fragment key={ind}>
                <Menu.Label>Documents of {docKey}</Menu.Label>
                {doc?.length > 0 ? (
                  doc.map((el) =>
                    el?.docUrl?.map((d, i) => {
                      const isHidden =
                        el?.replacedDocUrls?.includes(d) ||
                        el?.hiddenDocUrls?.includes(d);

                      if (isHidden) return <BiHide key={i} />;
                      return (
                        <Menu.Item
                          key={i}
                          disabled={!d}
                          color={d ? "green" : "gray"}
                          onClick={() => {
                            window.open(
                              `/Claims/action-inbox/documents?url=${d}&name=${el.name}`,
                              "_blank"
                            );
                          }}
                        >
                          {el?.name} {i + 1}
                        </Menu.Item>
                      );
                    })
                  )
                ) : (
                  <Menu.Item color="red" rightSection={<MdDoNotDisturbAlt />}>
                    No Data
                  </Menu.Item>
                )}
              </Fragment>
            );
          })}
        <Menu.Divider />
        <Menu.Label>Post QA Uploads</Menu.Label>
        {caseData?.postQARecommendation?.documents &&
        caseData?.postQARecommendation?.documents?.length > 0 ? (
          caseData?.postQARecommendation?.documents?.map((el, ind) => (
            <Menu.Item
              key={ind}
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${el}&name=PostQADoc`,
                  "_blank"
                );
              }}
            >
              Doc {ind + 1}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item color="red" rightSection={<MdDoNotDisturbAlt />}>
            No Data
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Label>Evidences</Menu.Label>
        {/* TODO: Handle for RM */}
        {preAuthFindings?.evidenceDocs &&
        preAuthFindings?.evidenceDocs?.length > 0 ? (
          preAuthFindings?.evidenceDocs?.map((el, ind) => (
            <Menu.Item
              key={ind}
              onClick={() => {
                window.open(
                  `/Claims/action-inbox/documents?url=${el}&name=Evidence ${
                    ind + 1
                  }`,
                  "_blank"
                );
              }}
            >
              Evidence {ind + 1}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item color="red" rightSection={<MdDoNotDisturbAlt />}>
            No Data
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LocalDocsView;
