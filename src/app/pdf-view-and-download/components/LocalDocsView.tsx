"use client";
import React, { Fragment, useState } from "react";
import { Button, Menu } from "@mantine/core";
import {
  CaseDetail,
  DocumentData,
  IS3Url,
} from "@/lib/utils/types/fniDataTypes";
import { getSignedUrlHelper, getTasksAndDocs, showError } from "@/lib/helpers";
import { EndPoints } from "@/lib/utils/types/enums";
import dayjs from "dayjs";

type PropTypes = {
  caseData: CaseDetail | null;
  claimType?: "PreAuth" | "Reimbursement";
  claimId: number;
};

const LocalDocsView = ({ caseData, claimType, claimId }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
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

  const prepareDocUrls = async () => {
    const documents: IS3Url[] = [];

    if (!!docs && Object.keys(docs).length > 0) {
      Object.keys(docs).map((docKey) => {
        const doc = docs[docKey];
        if (!!doc && doc?.length > 0) {
          for (const el of doc) {
            if (el?.docUrl && el?.docUrl?.length > 0) {
              for (let i = 0; i < el?.docUrl?.length; i++) {
                documents.push({
                  url: el?.docUrl[i],
                  name: `${claimId}_${el?.name}_${i + 1}`,
                });
              }
            }
          }
        }
      });
    }

    if (
      caseData?.postQARecommendation?.documents &&
      caseData?.postQARecommendation?.documents?.length > 0
    ) {
      for (
        let i = 0;
        i < caseData?.postQARecommendation?.documents?.length;
        i++
      ) {
        documents.push({
          url: caseData?.postQARecommendation?.documents[i],
          name: `${claimId}_post_qa_upload_${i + 1}`,
        });
      }
    }

    if (claimType === "PreAuth") {
      if (caseData?.allocationType === "Single") {
        if (
          preAuthFindings?.evidenceDocs &&
          preAuthFindings?.evidenceDocs?.length > 0
        ) {
          for (let i = 0; i < preAuthFindings?.evidenceDocs?.length; i++) {
            documents.push({
              url: preAuthFindings?.evidenceDocs[i],
              name: `${claimId}_evidence_${i + 1}`,
            });
          }
        }
      } else if (caseData?.allocationType === "Dual") {
        if (
          preAuthFindings?.evidenceDocs &&
          preAuthFindings?.evidenceDocs?.length > 0
        ) {
          for (let i = 0; i < preAuthFindings?.evidenceDocs?.length; i++) {
            documents.push({
              url: preAuthFindings?.evidenceDocs[i],
              name: `${claimId}_insured_evidence_${i + 1}`,
            });
          }
        }
        if (
          preAuthFindingsHospital?.evidenceDocs &&
          preAuthFindingsHospital?.evidenceDocs?.length > 0
        ) {
          for (
            let i = 0;
            i < preAuthFindingsHospital?.evidenceDocs?.length;
            i++
          ) {
            documents.push({
              url: preAuthFindingsHospital?.evidenceDocs[i],
              name: `${claimId}_hospital_evidence_${i + 1}`,
            });
          }
        }
      }
    } else if (claimType === "Reimbursement") {
      if (caseData?.allocationType === "Single") {
        if (
          rmFindings?.recommendation?.evidences &&
          rmFindings?.recommendation?.evidences?.length > 0
        ) {
          for (
            let i = 0;
            i < rmFindings?.recommendation?.evidences?.length;
            i++
          ) {
            documents.push({
              url: rmFindings?.recommendation?.evidences[i],
              name: `${claimId}_evidence_${i + 1}`,
            });
          }
        }

        if (
          rmFindings?.["Insured Verification"]?.reasonOfInsuredNotVisit?.proof
        ) {
          const proof =
            rmFindings?.["Insured Verification"]?.reasonOfInsuredNotVisit
              ?.proof;
          if (proof?.length > 0) {
            for (let i = 0; i < proof?.length; i++) {
              documents.push({
                url: proof[i],
                name: `${claimId}_insured_not_visit_proof_${i + 1}`,
              });
            }
          }
        }

        if (!!rmFindings?.["Insured Verification"]?.prevInsurancePolicyCopy) {
          documents.push({
            url: rmFindings?.["Insured Verification"]?.prevInsurancePolicyCopy,
            name: `${claimId}_prevInsurancePolicyCopy`,
          });
        }

        if (
          !!rmFindings?.["Insured Verification"]
            ?.anyInsurancePolicyOtherThanNBHI?.documents
        ) {
          const tempDocs =
            rmFindings?.["Insured Verification"]
              ?.anyInsurancePolicyOtherThanNBHI?.documents;
          if (tempDocs?.length > 0) {
            for (let i = 0; i < tempDocs?.length; i++) {
              documents.push({
                url: tempDocs[i],
                name: `${claimId}_prevInsurancePolicyOtherThanNBHI_${i + 1}`,
              });
            }
          }
        }
      } else if (caseData?.allocationType === "Dual") {
        if (
          rmFindings?.recommendation?.evidences &&
          rmFindings?.recommendation?.evidences?.length > 0
        ) {
          for (
            let i = 0;
            i < rmFindings?.recommendation?.evidences?.length;
            i++
          ) {
            documents.push({
              url: rmFindings?.recommendation?.evidences[i],
              name: `${claimId}_insured_evidence_${i + 1}`,
            });
          }
        }

        if (
          rmFindings?.["Insured Verification"]?.reasonOfInsuredNotVisit?.proof
        ) {
          const proof =
            rmFindings?.["Insured Verification"]?.reasonOfInsuredNotVisit
              ?.proof;
          if (proof?.length > 0) {
            for (let i = 0; i < proof?.length; i++) {
              documents.push({
                url: proof[i],
                name: `${claimId}_insured_not_visit_proof_${i + 1}`,
              });
            }
          }
        }

        if (!!rmFindings?.["Insured Verification"]?.prevInsurancePolicyCopy) {
          documents.push({
            url: rmFindings?.["Insured Verification"]?.prevInsurancePolicyCopy,
            name: `${claimId}_prevInsurancePolicyCopy`,
          });
        }

        if (
          !!rmFindings?.["Insured Verification"]
            ?.anyInsurancePolicyOtherThanNBHI?.documents
        ) {
          const tempDocs =
            rmFindings?.["Insured Verification"]
              ?.anyInsurancePolicyOtherThanNBHI?.documents;
          if (tempDocs?.length > 0) {
            for (let i = 0; i < tempDocs?.length; i++) {
              documents.push({
                url: tempDocs[i],
                name: `${claimId}_prevInsurancePolicyOtherThanNBHI_${i + 1}`,
              });
            }
          }
        }

        if (
          rmFindingsHospital?.recommendation?.evidences &&
          rmFindingsHospital?.recommendation?.evidences?.length > 0
        ) {
          for (
            let i = 0;
            i < rmFindingsHospital?.recommendation?.evidences?.length;
            i++
          ) {
            documents.push({
              url: rmFindingsHospital?.recommendation?.evidences[i],
              name: `${claimId}_hospital_evidence_${i + 1}`,
            });
          }
        }
      }
    }

    let res: IS3Url[] = [];

    for (const doc of documents) {
      const url = await getSignedUrlHelper(doc?.url);
      const mimeType = doc?.url?.split(".").pop();
      res.push({ name: `${doc?.name}.${mimeType}`, url });
    }

    return res;
  };

  const downloadAllDocuments = async () => {
    setLoading(true);
    const documents = await prepareDocUrls();
    try {
      const response = await fetch(EndPoints.DOWNLOAD_ALL_DOCS_AS_ZIP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documents }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `files-${dayjs().format("DD-MMM-YYYY_hh-mm_a")}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Failed to create zip folder");
      }
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

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
                                `/Claims/action-inbox/documents?url=${encodeURIComponent(
                                  d
                                )}&name=${el.name}`,
                                "_blank"
                              );
                            }}
                          >
                            {`${claimId}_${el?.name}_${i + 1}`}
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
                      `/Claims/action-inbox/documents?url=${encodeURIComponent(
                        el
                      )}&name=PostQADoc`,
                      "_blank"
                    );
                  }}
                >
                  {`${claimId}_post_qa_upload_${ind + 1}`}
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
                        `/Claims/action-inbox/documents?url=${encodeURIComponent(
                          el
                        )}&name=Evidence ${ind + 1}`,
                        "_blank"
                      );
                    }}
                  >
                    {`${claimId}_evidence_${ind + 1}`}
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
                          `/Claims/action-inbox/documents?url=${encodeURIComponent(
                            el
                          )}&name=Evidence ${ind + 1}`,
                          "_blank"
                        );
                      }}
                    >
                      {`${claimId}_insured_evidence${ind + 1}`}
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
                          `/Claims/action-inbox/documents?url=${encodeURIComponent(
                            el
                          )}&name=Evidence ${ind + 1}`,
                          "_blank"
                        );
                      }}
                    >
                      {`${claimId}_hospital_evidence${ind + 1}`}
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
                        `/Claims/action-inbox/documents?url=${encodeURIComponent(
                          el
                        )}&name=Evidence ${ind + 1}`,
                        "_blank"
                      );
                    }}
                  >
                    {`${claimId}_evidence_${ind + 1}`}
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
                          `/Claims/action-inbox/documents?url=${encodeURIComponent(
                            el
                          )}&name=Evidence ${ind + 1}`,
                          "_blank"
                        );
                      }}
                    >
                      {`${claimId}_insured_evidence_${ind + 1}`}
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
                            `/Claims/action-inbox/documents?url=${encodeURIComponent(
                              el
                            )}&name=Evidence ${ind + 1}`,
                            "_blank"
                          );
                        }}
                      >
                        {`${claimId}_hospital_evidence_${ind + 1}`}
                      </Menu.Item>
                    )
                  )}
                </Fragment>
              ) : null}
            </Fragment>
          ) : null
        ) : null}

        <Button
          my="lg"
          className="mx-auto block"
          onClick={downloadAllDocuments}
          loading={loading}
          disabled={loading}
        >
          Download All
        </Button>
      </Menu.Dropdown>
    </Menu>
  );
};

export default LocalDocsView;
