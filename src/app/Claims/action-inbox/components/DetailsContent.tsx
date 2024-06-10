"use client";

import React, { Fragment, Suspense, useEffect, useState } from "react";
import {
  Accordion,
  Box,
  Button,
  Center,
  Divider,
  Loader,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import axios from "axios";
import { useLocalStorage } from "@mantine/hooks";
import dynamic from "next/dynamic";
import {
  CaseDetail,
  CaseState,
  IDashboardData,
  IShowElement,
  NumericStage,
  Role,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { getStageLabel, showError } from "@/lib/helpers";
import CustomMarquee from "@/components/CustomMarquee";
import { Spin } from "antd";

const TriageSummary = dynamic(
  () => import("@/components/ClaimsComponents/TriageSummary")
);
const FraudIndicatorTable = dynamic(
  () => import("@/components/ClaimsComponents/FraudIndicators")
);
const PreQcFooter = dynamic(() => import("./InboxDetail/PreQcFooter"));
const GeneralContent = dynamic(() => import("./InboxDetail/GeneralContent"));
const ContractDetailsContent = dynamic(
  () => import("./InboxDetail/ContractDetailsContent")
);
const HistoricalClaimTable = dynamic(
  () => import("./InboxDetail/HistoricalClaimTable")
);
const TasksAndDocumentsContent = dynamic(
  () => import("./InboxDetail/TasksAndDocumentsContent")
);
const InvestigationFindingsContent = dynamic(
  () => import("./InboxDetail/InvestigationFindingsContent")
);
const InvestigationRecommendationContent = dynamic(
  () => import("./InboxDetail/InvestigationRecommendationContent")
);
const RMInvestigationRecommendationContent = dynamic(
  () => import("./InboxDetail/RMInvestigationRecommendationContent")
);
const RMInvestigationFindingsContent = dynamic(
  () => import("./InboxDetail/RMInvestigationFindingsContent")
);
const InvestigationFindings = dynamic(
  () => import("./InboxDetail/InvestigationFindings")
);
const RMInvestigationFindings = dynamic(
  () => import("./InboxDetail/RMInvestigationFindings")
);
const ClaimDetailsContent = dynamic(
  () => import("./InboxDetail/ClaimDetailsContent")
);
const InsuredDetailsContent = dynamic(
  () => import("./InboxDetail/InsuredDetailsContent")
);
const HospitalDetailsContent = dynamic(
  () => import("./InboxDetail/HospitalDetailsContent")
);
const MembersTable = dynamic(() => import("./InboxDetail/MembersTable"));
const Allocation = dynamic(() => import("./InboxDetail/Allocation"));
const PostQAFooter = dynamic(() => import("./InboxDetail/PostQAFooter"));
const TasksAndDocsButtons = dynamic(
  () => import("./InboxDetail/TasksAndDocsButtons")
);
const CompleteDocuments = dynamic(
  () => import("./InboxDetail/CompleteDocuments")
);
const InvestigationRejectionDetails = dynamic(
  () => import("./InboxDetail/InvestigationRejectionDetails")
);
const AllocationFooter = dynamic(
  () => import("./InboxDetail/AllocationFooter")
);
const SkipInvestigation = dynamic(
  () => import("./InboxDetail/SkipInvestigation")
);
const Expedite = dynamic(() => import("./InboxDetail/Expedite"));
const NotificationModal = dynamic(() => import("./NotificationModal"));
const WDMSDocuments = dynamic(() => import("./InboxDetail/WDMSDocuments"));
const ClaimTypeDetails = dynamic(
  () => import("./InboxDetail/ClaimTypeDetails")
);
const DownloadAssignmentSummary = dynamic(
  () => import("./InboxDetail/DownloadAssignmentSummary")
);

const showElementInitials: IShowElement = {
  changeTask: false,
  allocationAccept: false,
  allocationReject: false,
  postQaAccept: false,
  postQaReject: false,
  completeTasks: false,
  completeDocuments: false,
  preQCAccept: false,
  preQCReject: false,
};

type PropTypes = {
  dashboardDataId: string;
  origin: "consolidated" | "inbox";
};

const DetailsContent = ({ dashboardDataId, origin }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IDashboardData | null>(null);
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [caseState, setCaseState] = useState<CaseState>(CaseState.ACCEPTED);
  const [showElement, setShowElement] =
    useState<IShowElement>(showElementInitials);

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<SingleResponseType<IDashboardData>>(
        `${EndPoints.DASHBOARD_DATA}?id=${dashboardDataId}`
      );
      setData(data?.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dashboardDataId) {
      getData();

      const getCaseDetail = async () => {
        setLoading(true);
        try {
          const { data } = await axios.get<SingleResponseType<CaseDetail>>(
            `${EndPoints.CASE_DETAIL}?dashboardDataId=${dashboardDataId}`
          );
          setCaseDetail(data?.data);
        } catch (error) {
          showError(error);
        } finally {
          setLoading(false);
        }
      };
      getCaseDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardDataId]);

  const skipInvestigationRoleCheck = [
    Role.ADMIN,
    Role.CLUSTER_MANAGER,
    Role.TL,
    Role.PRE_QC,
    Role.ALLOCATION,
  ].includes(user?.activeRole);

  const accordionItems = [
    ...(data?.claimType === "PreAuth"
      ? [
          {
            value: "Pre-Auth Details",
            content: <GeneralContent data={data} />,
          },
        ]
      : []),
    {
      value: "Contract Details",
      content: <ContractDetailsContent data={data} />,
    },
    ...(data?.stage &&
    [NumericStage.POST_QC, NumericStage.CLOSED].includes(data?.stage)
      ? [
          {
            value: "Tasks and Documents Assigned",
            content: (
              <TasksAndDocumentsContent
                tasks={caseDetail?.tasksAssigned || []}
                documents={caseDetail?.documents as any}
              />
            ),
          },
          {
            value: "Investigation Findings",
            content: (
              <Box>
                <Box className="ml-auto w-fit mb-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `/pdf-view-and-download?claimId=${data?.encryptedClaimId}&docType=investigation`,
                        "_blank"
                      );
                    }}
                  >
                    Download
                  </Button>
                </Box>
                {data?.claimType === "PreAuth" ? (
                  <InvestigationFindingsContent
                    findings={caseDetail?.investigationFindings}
                  />
                ) : (
                  <RMInvestigationFindingsContent
                    findings={caseDetail?.rmFindings}
                  />
                )}
              </Box>
            ),
          },
          {
            value: "Investigation Recommendation",
            content:
              data?.claimType === "PreAuth" ? (
                <InvestigationRecommendationContent
                  findings={caseDetail?.investigationFindings}
                />
              ) : (
                <RMInvestigationRecommendationContent
                  recommendation={caseDetail?.rmFindings?.recommendation}
                  otherRecommendation={
                    caseDetail?.rmFindings?.otherRecommendation
                  }
                />
              ),
          },
          ...([Role.ADMIN, Role.POST_QA].includes(user?.activeRole) &&
          data?.stage === NumericStage.POST_QC &&
          origin === "inbox"
            ? [
                {
                  value: "Change investigation findings",
                  content:
                    data?.claimType === "PreAuth" ? (
                      <InvestigationFindings
                        caseDetail={caseDetail}
                        dashboardData={data}
                        onClose={() =>
                          setShowElement((prev) => ({
                            ...prev,
                            completeTasks: false,
                          }))
                        }
                      />
                    ) : (
                      <RMInvestigationFindings
                        dashboardData={data}
                        caseDetail={caseDetail}
                        setCaseDetail={setCaseDetail}
                      />
                    ),
                },
              ]
            : []),
        ]
      : []),
    ...(data?.claimType !== "PreAuth"
      ? [
          {
            value: "Insured Details",
            content: <InsuredDetailsContent data={data} />,
          },
          {
            value: "Claim Details",
            content: <ClaimDetailsContent data={data} />,
          },
          {
            value: "Hospital Details & Hospitalization Details",
            content: <HospitalDetailsContent data={data} />,
          },
          {
            value: "Members",
            content: <MembersTable members={data?.members || []} />,
          },
          {
            value: "Claim Type Detail",
            content: <ClaimTypeDetails data={data} setData={setData} />,
          },
          {
            value: "Download Assignment Summary",
            content: (
              <DownloadAssignmentSummary data={data} caseData={caseDetail} />
            ),
          },
        ]
      : []),
    {
      value: "Historical Claim",
      content: <HistoricalClaimTable data={data} />,
    },
    {
      value: "WDMS Document",
      content: <WDMSDocuments dashboardData={data} />,
    },
    {
      value: "Triggers (Triaging Summary)",
      content: (
        <div>
          <Title order={5} ta="center" c="green" my={4}>
            Triggers
          </Title>
          <Box>
            {caseDetail?.caseType &&
              caseDetail?.caseType?.length > 0 &&
              caseDetail?.caseType?.map((el, ind) => (
                <Text key={ind}>{el}</Text>
              ))}
          </Box>
          <Divider />
          <Title order={5} ta="center" c="green" my={4}>
            Triaging Summary
          </Title>
          <TriageSummary
            getCaseState={(status) => setCaseState(status)}
            id={data?._id as string}
            triageSummary={data?.triageSummary || []}
          />
          <Divider />
          <Title order={5} ta="center" c="green" my={4}>
            Model Fraud Indicator
          </Title>
          <FraudIndicatorTable
            data={data?.fraudIndicators?.indicatorsList}
            comments={data?.fraudIndicators?.remarks}
          />
        </div>
      ),
    },
    ...(skipInvestigationRoleCheck &&
    data?.stage === NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING &&
    origin === "consolidated"
      ? [
          {
            value: "Complete investigation",
            content: (
              <Fragment>
                {!showElement.completeTasks &&
                !showElement.completeDocuments ? (
                  <TasksAndDocsButtons setShowElement={setShowElement} />
                ) : showElement.completeTasks &&
                  !showElement.completeDocuments ? (
                  <InvestigationFindings
                    caseDetail={caseDetail}
                    dashboardData={data}
                    onClose={() =>
                      setShowElement((prev) => ({
                        ...prev,
                        completeTasks: false,
                      }))
                    }
                  />
                ) : showElement.completeDocuments &&
                  !showElement.completeTasks ? (
                  <CompleteDocuments
                    caseDetail={caseDetail}
                    claimId={data?.claimId}
                    setCaseDetail={setCaseDetail}
                    onClose={() =>
                      setShowElement((prev) => ({
                        ...prev,
                        completeDocuments: false,
                      }))
                    }
                  />
                ) : null}
              </Fragment>
            ),
          },
        ]
      : []),
    ...(skipInvestigationRoleCheck &&
    data?.stage === NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING &&
    origin === "consolidated"
      ? [
          {
            value: "Re-Assign The Case",
            content: (
              <Allocation
                caseState={caseState}
                setCaseState={setCaseState}
                dashboardData={data}
                caseDetail={caseDetail}
              />
            ),
          },
        ]
      : []),

    ...(data?.stage &&
    [
      NumericStage.PENDING_FOR_ALLOCATION,
      NumericStage.PENDING_FOR_RE_ALLOCATION,
    ].includes(data?.stage) &&
    showElement.allocationAccept
      ? [
          {
            value: "Allocation Feed",
            content: (
              <>
                {caseDetail?.investigationRejected
                  ?.investigationRejectedReason && (
                  <InvestigationRejectionDetails
                    rejectionInfo={caseDetail?.investigationRejected || null}
                  />
                )}
                <Allocation
                  caseState={caseState}
                  setCaseState={setCaseState}
                  dashboardData={data}
                  caseDetail={caseDetail}
                  onClose={() =>
                    setShowElement((prev) => ({
                      ...prev,
                      allocationAccept: false,
                      allocationReject: false,
                    }))
                  }
                />
              </>
            ),
          },
        ]
      : []),
  ];

  const items = accordionItems.map((el) => (
    <Accordion.Item key={el?.value} value={el.value}>
      <Accordion.Control icon="👉">
        <Title order={4} c="blue">
          {el?.value}
        </Title>
      </Accordion.Control>
      <Accordion.Panel>
        <Suspense fallback={<Spin />}>{el?.content}</Suspense>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  const intimationDate = dayjs(data?.intimationDate);
  const currentDate = dayjs();
  const hoursDifference = currentDate.diff(intimationDate, "hours");
  const daysDifference = currentDate.diff(intimationDate, "days");
  let caseTatStatus: string = "";
  if (data?.claimType == "PreAuth") {
    if (data?.hospitalizationDetails?.admissionType !== "Post Facto") {
      if (hoursDifference <= 24) {
        caseTatStatus = "Green";
      } else if (hoursDifference > 24 && hoursDifference <= 36) {
        caseTatStatus = "Amber";
      } else if (hoursDifference > 36) {
        caseTatStatus = "Red";
      }
    } else {
      if (daysDifference <= 5) {
        caseTatStatus = "Green";
      } else if (daysDifference > 5 && daysDifference <= 7) {
        caseTatStatus = "Amber";
      } else if (daysDifference > 36) {
        caseTatStatus = "Red";
      }
    }
  }

  return (
    <Fragment>
      {loading ? (
        <Center>
          <Loader type="dots" />
        </Center>
      ) : (
        <>
          {data?._id ? <NotificationModal data={data} /> : null}
          {data?.claimType === "PreAuth" && (
            <CustomMarquee
              text={
                caseTatStatus == "Red"
                  ? "Extremely urgent, kindly act since case is in Red state"
                  : caseTatStatus == "Amber"
                  ? "Urgent, kindly act since case is in Amber state"
                  : "Case is currently in Green state"
              }
            />
          )}
          <Box>
            <Box className="bg-blue-900 text-white rounded-t-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold">
                {data?.stage === NumericStage.PENDING_FOR_PRE_QC
                  ? "Pre-QC"
                  : data?.stage === NumericStage.POST_QC
                  ? "Investigation"
                  : data?.stage === NumericStage.PENDING_FOR_ALLOCATION
                  ? "Allocation"
                  : ""}{" "}
                Summary
              </h2>
              <h4 className="text-sm">
                {data?.claimType},{" "}
                <span className="text-orange-500">{data?.claimId}</span>,{" "}
                <span className="text-yellow-400">
                  {data?.stage && getStageLabel(data?.stage)}
                </span>
              </h4>
            </Box>
            <Accordion variant="contained">{items}</Accordion>

            {[Role.ADMIN, Role.PRE_QC, Role.ALLOCATION].includes(
              user?.activeRole
            ) &&
            data?.stage === NumericStage.PENDING_FOR_PRE_QC &&
            origin === "inbox" ? (
              <PreQcFooter
                data={data}
                caseDetail={caseDetail}
                showElement={showElement}
                setShowElement={setShowElement}
              />
            ) : null}

            {[Role.ADMIN, Role.ALLOCATION].includes(user?.activeRole) &&
            data?.stage &&
            [
              NumericStage.PENDING_FOR_ALLOCATION,
              NumericStage.PENDING_FOR_RE_ALLOCATION,
            ].includes(data?.stage) &&
            origin === "inbox" ? (
              <AllocationFooter
                data={data}
                showElement={showElement}
                setShowElement={setShowElement}
              />
            ) : null}

            {[Role.ADMIN, Role.POST_QA].includes(user?.activeRole) &&
            data?.stage === NumericStage.POST_QC &&
            origin === "inbox" ? (
              <PostQAFooter
                caseDetail={caseDetail}
                data={data}
                showElement={showElement}
                setShowElement={setShowElement}
              />
            ) : null}

            {skipInvestigationRoleCheck &&
            data?.stage &&
            [
              NumericStage.IN_FIELD_FRESH,
              NumericStage.IN_FIELD_REINVESTIGATION,
              NumericStage.INVESTIGATION_ACCEPTED,
              NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING,
            ].includes(data?.stage) &&
            origin === "consolidated" ? (
              <SkipInvestigation dashboardData={data} onDone={getData} />
            ) : null}

            {[Role.TL, Role.CLUSTER_MANAGER].includes(user?.activeRole) &&
            origin === "consolidated" &&
            ![NumericStage.CLOSED, NumericStage.REJECTED].includes(
              data?.stage as NumericStage
            ) ? (
              <Expedite dashboardData={data} />
            ) : null}
          </Box>
        </>
      )}
    </Fragment>
  );
};

export default DetailsContent;

// type PropTypes = {
//   dashboardDataId: string;
//   origin: "consolidated" | "inbox";
// };

// const DetailsContent = ({ dashboardDataId, origin }: PropTypes) => {
//   return <>Hi</>;
// };

// export default DetailsContent;
