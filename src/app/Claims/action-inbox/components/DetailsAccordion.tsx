import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  Suspense,
  useState,
} from "react";
import { Accordion, Box, Button, Divider, Text, Title } from "@mantine/core";
import { Spin } from "antd";
import {
  CaseDetail,
  CaseState,
  IDashboardData,
  IShowElement,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import dynamic from "next/dynamic";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import { useLocalStorage } from "@mantine/hooks";

const TriageSummary = dynamic(
  () => import("@/components/ClaimsComponents/TriageSummary")
);
const FraudIndicatorTable = dynamic(
  () => import("@/components/ClaimsComponents/FraudIndicators")
);
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
const TasksAndDocsButtons = dynamic(
  () => import("./InboxDetail/TasksAndDocsButtons")
);
const CompleteDocuments = dynamic(
  () => import("./InboxDetail/CompleteDocuments")
);
const InvestigationRejectionDetails = dynamic(
  () => import("./InboxDetail/InvestigationRejectionDetails")
);
const WDMSDocuments = dynamic(() => import("./InboxDetail/WDMSDocuments"));
const ClaimTypeDetails = dynamic(
  () => import("./InboxDetail/ClaimTypeDetails")
);
const DownloadAssignmentSummary = dynamic(
  () => import("./InboxDetail/DownloadAssignmentSummary")
);

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  skipInvestigationRoleCheck: boolean;
  showElement: IShowElement;
  setData: Dispatch<SetStateAction<IDashboardData | null>>;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const DetailsAccordion = ({
  data,
  caseDetail,
  skipInvestigationRoleCheck,
  showElement,
  setData,
  setCaseDetail,
  setShowElement,
}: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [caseState, setCaseState] = useState<CaseState>(CaseState.ACCEPTED);
  const [value, setValue] = useState<string | null>(null);

  const accordionItems = [
    ...(data?.claimType === "PreAuth"
      ? [
          {
            value: "Pre-Auth Details",
            content:
              value === "Pre-Auth Details" ? (
                <GeneralContent data={data} />
              ) : null,
          },
        ]
      : []),
    {
      value: "Contract Details",
      content:
        value === "Contract Details" ? (
          <ContractDetailsContent data={data} />
        ) : null,
    },
    ...(data?.stage &&
    [NumericStage.POST_QC, NumericStage.CLOSED].includes(data?.stage)
      ? [
          {
            value: "Tasks and Documents Assigned",
            content:
              value === "Tasks and Documents Assigned" ? (
                <TasksAndDocumentsContent
                  tasks={caseDetail?.tasksAssigned || []}
                  documents={caseDetail?.documents as any}
                />
              ) : null,
          },
          {
            value: "Investigation Findings",
            content:
              value === "Investigation Findings" ? (
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
              ) : null,
          },
          {
            value: "Investigation Recommendation",
            content:
              value === "Investigation Recommendation" ? (
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
                )
              ) : null,
          },
          ...([Role.ADMIN, Role.POST_QA].includes(user?.activeRole) &&
          data?.stage === NumericStage.POST_QC &&
          origin === "inbox"
            ? [
                {
                  value: "Change investigation findings",
                  content:
                    value === "Change investigation findings" ? (
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
                      )
                    ) : null,
                },
              ]
            : []),
        ]
      : []),
    ...(data?.claimType !== "PreAuth"
      ? [
          {
            value: "Insured Details",
            content:
              value === "Insured Details" ? (
                <InsuredDetailsContent data={data} />
              ) : null,
          },
          {
            value: "Claim Details",
            content:
              value === "Claim Details" ? (
                <ClaimDetailsContent data={data} />
              ) : null,
          },
          {
            value: "Hospital Details & Hospitalization Details",
            content:
              value === "Hospital Details & Hospitalization Details" ? (
                <HospitalDetailsContent data={data} />
              ) : null,
          },
          {
            value: "Members",
            content:
              value === "Members" ? (
                <MembersTable members={data?.members || []} />
              ) : null,
          },
          {
            value: "Claim Type Detail",
            content:
              value === "Claim Type Detail" ? (
                <ClaimTypeDetails data={data} setData={setData} />
              ) : null,
          },
          {
            value: "Download Assignment Summary",
            content:
              value === "Download Assignment Summary" ? (
                <DownloadAssignmentSummary data={data} caseData={caseDetail} />
              ) : null,
          },
        ]
      : []),
    {
      value: "Historical Claim",
      content:
        value === "Historical Claim" ? (
          <HistoricalClaimTable data={data} />
        ) : null,
    },
    {
      value: "WDMS Document",
      content:
        value === "WDMS Document" ? (
          <WDMSDocuments dashboardData={data} />
        ) : null,
    },
    {
      value: "Triggers (Triaging Summary)",
      content:
        value === "Triggers (Triaging Summary)" ? (
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
        ) : null,
    },
    ...(skipInvestigationRoleCheck &&
    data?.stage === NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING &&
    origin === "consolidated"
      ? [
          {
            value: "Complete investigation",
            content:
              value === "Complete investigation" ? (
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
              ) : null,
          },
        ]
      : []),
    ...(skipInvestigationRoleCheck &&
    data?.stage === NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING &&
    origin === "consolidated"
      ? [
          {
            value: "Re-Assign The Case",
            content:
              value === "Re-Assign The Case" ? (
                <Allocation
                  caseState={caseState}
                  setCaseState={setCaseState}
                  dashboardData={data}
                  caseDetail={caseDetail}
                />
              ) : null,
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
            content:
              value === "Allocation Feed" ? (
                <Fragment>
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
                </Fragment>
              ) : null,
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

  return (
    <Accordion variant="contained" value={value} onChange={setValue}>
      {items}
    </Accordion>
  );
};

export default DetailsAccordion;