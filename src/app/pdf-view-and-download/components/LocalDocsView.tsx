import React, { Fragment } from "react";
import { Button, Menu } from "@mantine/core";
import { CaseDetail, DocumentData } from "@/lib/utils/types/fniDataTypes";
import { getTasksAndDocs } from "@/lib/helpers";

type PropTypes = {
  caseData: CaseDetail | null;
  claimType?: "PreAuth" | "Reimbursement";
};

const LocalDocsView = ({ caseData, claimType }: PropTypes) => {
  const {
    tasksAndDocs,
    preAuthFindings,
    rmFindings,
    preAuthFindingsHospital,
    rmFindingsHospital,
  } = getTasksAndDocs({
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
            if (docKey === "NPS Confirmation") return null;
            return (
              <Fragment key={ind}>
                {!!doc && doc?.length > 0 && (
                  <Fragment>
                    <Menu.Label>Documents of {docKey}</Menu.Label>
                    {doc.map((el) =>
                      el?.docUrl?.map((d, i) => {
                        const isHidden =
                          el?.replacedDocUrls?.includes(d) ||
                          el?.hiddenDocUrls?.includes(d);

                        if (isHidden) return null;
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
                            Document: {i + 1}
                          </Menu.Item>
                        );
                      })
                    )}
                  </Fragment>
                )}
              </Fragment>
            );
          })}
        <Menu.Divider />
        {caseData?.postQARecommendation?.documents &&
          caseData?.postQARecommendation?.documents?.length > 0 && (
            <Fragment>
              <Menu.Label>Post QA Uploads</Menu.Label>
              {caseData?.postQARecommendation?.documents?.map((el, ind) => (
                <Menu.Item
                  key={ind}
                  c="green"
                  onClick={() => {
                    window.open(
                      `/Claims/action-inbox/documents?url=${el}&name=PostQADoc`,
                      "_blank"
                    );
                  }}
                >
                  Document: {ind + 1}
                </Menu.Item>
              ))}
            </Fragment>
          )}
        <Menu.Divider />
        {claimType === "PreAuth" ? (
          caseData?.allocationType === "Single" ? (
            preAuthFindings?.evidenceDocs &&
            preAuthFindings?.evidenceDocs?.length > 0 ? (
              <Fragment>
                <Menu.Label>Evidences</Menu.Label>
                {preAuthFindings?.evidenceDocs?.map((el, ind) => (
                  <Menu.Item
                    key={ind}
                    c="green"
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
                ))}
              </Fragment>
            ) : null
          ) : caseData?.allocationType === "Dual" ? (
            <Fragment>
              {preAuthFindings?.evidenceDocs &&
              preAuthFindings?.evidenceDocs?.length > 0 ? (
                <Fragment>
                  <Menu.Label>Insured Part Evidences</Menu.Label>
                  {preAuthFindings?.evidenceDocs?.map((el, ind) => (
                    <Menu.Item
                      key={ind}
                      c="green"
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
                  ))}
                </Fragment>
              ) : null}
              {preAuthFindingsHospital?.evidenceDocs &&
              preAuthFindingsHospital?.evidenceDocs?.length > 0 ? (
                <Fragment>
                  <Menu.Label>Hospital Part Evidences</Menu.Label>
                  {preAuthFindingsHospital?.evidenceDocs?.map((el, ind) => (
                    <Menu.Item
                      key={ind}
                      c="green"
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
                  ))}
                </Fragment>
              ) : null}
            </Fragment>
          ) : null
        ) : claimType === "Reimbursement" ? (
          caseData?.allocationType === "Single" ? (
            rmFindings?.recommendation?.evidences &&
            rmFindings?.recommendation?.evidences?.length > 0 ? (
              <Fragment>
                <Menu.Label>Evidences</Menu.Label>
                {rmFindings?.recommendation?.evidences?.map((el, ind) => (
                  <Menu.Item
                    key={ind}
                    c="green"
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
                ))}
              </Fragment>
            ) : null
          ) : caseData?.allocationType === "Dual" ? (
            <Fragment>
              {rmFindings?.recommendation?.evidences &&
              rmFindings?.recommendation?.evidences?.length > 0 ? (
                <Fragment>
                  <Menu.Label>Insured Part Evidences</Menu.Label>
                  {rmFindings?.recommendation?.evidences?.map((el, ind) => (
                    <Menu.Item
                      key={ind}
                      c="green"
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
                  ))}
                </Fragment>
              ) : null}
              {rmFindingsHospital?.recommendation?.evidences &&
              rmFindingsHospital?.recommendation?.evidences?.length > 0 ? (
                <Fragment>
                  <Menu.Label>Hospital Part Evidences</Menu.Label>
                  {rmFindingsHospital?.recommendation?.evidences?.map(
                    (el, ind) => (
                      <Menu.Item
                        key={ind}
                        c="green"
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
                    )
                  )}
                </Fragment>
              ) : null}
            </Fragment>
          ) : null
        ) : null}
      </Menu.Dropdown>
    </Menu>
  );
};

export default LocalDocsView;
