import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Accordion, Box, Button, Divider, Text, Title } from "@mantine/core";
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
import Loading from "@/components/Loading";

const TriageSummary = dynamic(
  () => import("@/components/ClaimsComponents/TriageSummary"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const ConsolidatedDetail = dynamic(() => import("./ConsolidatedDetail"), {
  ssr: false,
  loading: () => <Loading />,
});
const FraudIndicatorTable = dynamic(
  () => import("@/components/ClaimsComponents/FraudIndicators"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const GeneralContent = dynamic(() => import("./InboxDetail/GeneralContent"), {
  ssr: false,
  loading: () => <Loading />,
});
const ContractDetailsContent = dynamic(
  () => import("./InboxDetail/ContractDetailsContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const HistoricalClaimTable = dynamic(
  () => import("./InboxDetail/HistoricalClaimTable"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const TasksAndDocumentsContent = dynamic(
  () => import("./InboxDetail/TasksAndDocumentsContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const InvestigationFindingsContent = dynamic(
  () => import("./InboxDetail/InvestigationFindingsContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const InvestigationRecommendationContent = dynamic(
  () => import("./InboxDetail/InvestigationRecommendationContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const RMInvestigationRecommendationContent = dynamic(
  () => import("./InboxDetail/RMInvestigationRecommendationContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const RMInvestigationFindingsContent = dynamic(
  () => import("./InboxDetail/RMInvestigationFindingsContent"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const InvestigationFindings = dynamic(
  () => import("./InboxDetail/InvestigationFindings"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const ChangeFindings = dynamic(() => import("./ChangeFindings"), {
  ssr: false,
  loading: () => <Loading />,
});

const MembersTable = dynamic(() => import("./InboxDetail/MembersTable"), {
  ssr: false,
  loading: () => <Loading />,
});
const Allocation = dynamic(() => import("./InboxDetail/Allocation"), {
  ssr: false,
  loading: () => <Loading />,
});
const TasksAndDocsButtons = dynamic(
  () => import("./InboxDetail/TasksAndDocsButtons"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const CompleteDocuments = dynamic(
  () => import("./InboxDetail/CompleteDocuments"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const InvestigationRejectionDetails = dynamic(
  () => import("./InboxDetail/InvestigationRejectionDetails"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const WDMSDocuments = dynamic(() => import("./InboxDetail/WDMSDocuments"), {
  ssr: false,
  loading: () => <Loading />,
});
const ClaimTypeDetails = dynamic(
  () => import("./InboxDetail/ClaimTypeDetails"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);
const DownloadAssignmentSummary = dynamic(
  () => import("./InboxDetail/DownloadAssignmentSummary"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

type PropTypes = {
  data: IDashboardData | null;
  caseDetail: CaseDetail | null;
  skipInvestigationRoleCheck: boolean;
  showElement: IShowElement;
  origin: "consolidated" | "inbox";
  setData: Dispatch<SetStateAction<IDashboardData | null>>;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const DetailsAccordion = ({
  data,
  caseDetail,
  skipInvestigationRoleCheck,
  showElement,
  origin,
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
            content: value === "Pre-Auth Details" && (
              <GeneralContent data={data} />
            ),
          },
        ]
      : []),
    {
      value: "Contract Details",
      content: value === "Contract Details" && (
        <ContractDetailsContent data={data} />
      ),
    },
    ...(data?.stage &&
    [NumericStage.POST_QC, NumericStage.CLOSED].includes(data?.stage)
      ? [
          {
            value: "Tasks and Documents Assigned",
            content: value === "Tasks and Documents Assigned" && (
              <TasksAndDocumentsContent
                caseDetail={caseDetail}
                dashboardData={data}
              />
            ),
          },
          {
            value: "Investigation Findings",
            content: value === "Investigation Findings" && (
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
                    findings={caseDetail?.rmFindingsPostQA}
                  />
                )}
              </Box>
            ),
          },
          {
            value: "Investigation Recommendation",
            content:
              value === "Investigation Recommendation" &&
              (data?.claimType === "PreAuth" ? (
                <InvestigationRecommendationContent
                  findings={caseDetail?.investigationFindings}
                />
              ) : (
                <RMInvestigationRecommendationContent
                  recommendation={caseDetail?.rmFindingsPostQA?.recommendation}
                  otherRecommendation={
                    caseDetail?.rmFindingsPostQA?.otherRecommendation
                  }
                />
              )),
          },
          ...([Role.ADMIN, Role.POST_QA].includes(user?.activeRole) &&
          data?.stage === NumericStage.POST_QC &&
          origin === "inbox"
            ? [
                {
                  value: "Change investigation findings",
                  content: value === "Change investigation findings" && (
                    <ChangeFindings />
                  ),
                },
              ]
            : []),
        ]
      : []),
    ...(data?.claimType !== "PreAuth"
      ? [
          {
            value: "Claim Details",
            content: value === "Claim Details" && (
              <ConsolidatedDetail data={data} />
            ),
          },
          {
            value: "Members",
            content: value === "Members" && (
              <MembersTable members={data?.members || []} />
            ),
          },
          {
            value: "Claim Type Detail",
            content: value === "Claim Type Detail" && (
              <ClaimTypeDetails data={data} setData={setData} />
            ),
          },
        ]
      : []),
    {
      value: "Historical Claim",
      content: value === "Historical Claim" && (
        <HistoricalClaimTable data={data} />
      ),
    },
    {
      value: "WDMS Document",
      content: (
        <Fragment>
          {value === "WDMS Document" && <WDMSDocuments dashboardData={data} />}
          {data?.claimType !== "PreAuth" &&
            value === "Download Assignment Summary" && (
              <DownloadAssignmentSummary data={data} caseData={caseDetail} />
            )}
        </Fragment>
      ),
    },
    {
      value: "Triggers (Triaging Summary)",
      content: value === "Triggers (Triaging Summary)" && (
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
            content: value === "Complete investigation" && (
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
    ...([Role.ALLOCATION].includes(user?.activeRole) &&
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
      NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
    ].includes(data?.stage) &&
    showElement.allocationAccept
      ? [
          {
            value: "Allocation Feed",
            content: value === "Allocation Feed" && (
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
      <Accordion.Panel>{el?.content}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion variant="contained" value={value} onChange={setValue}>
      {items}
    </Accordion>
  );
};

export default DetailsAccordion;
