import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box, Button, Flex, Modal, Text } from "@mantine/core";
import PostQaApproveForm from "./PostQaApproveForm";
import InvestigationSummary from "./InvestigationSummary";
import { toast } from "react-toastify";
import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  CaseDetail,
  IDashboardData,
  PostQaApproveFormValues,
  RevisedQaApproveFormValues,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import {
  getEncryptClaimId,
  getFinalOutcomeCode,
  getTasksAndDocs,
  showError,
} from "@/lib/helpers";

type PropTypes = {
  caseDetail: CaseDetail | null;
  data: IDashboardData | null;
  setCaseDetail: Dispatch<SetStateAction<CaseDetail | null>>;
  handleCancel: () => void;
};

const approvedValuesInitials: PostQaApproveFormValues = {
  summaryOfInvestigation: "",
  qaRemarks: "",
  frcuRecommendationOnClaims: "",
  claimsGroundOfRepudiation: [],
  frcuGroundOfRepudiation: [],
  queriesToRaise: "",
  providerRecommendation: "",
  policyRecommendation: "",
  sourcingRecommendation: "",
  regulatoryReportingRecommendation: "",
};

const PostQaApproveContent = ({
  data,
  caseDetail,
  setCaseDetail,
  handleCancel,
}: PropTypes) => {
  const router = useRouter();
  const [approvedValues, setApprovedValues] = useState<PostQaApproveFormValues>(
    approvedValuesInitials
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [stageUpdating, setStageUpdating] = useState<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  const recommendation = useMemo(() => {
    let value = "";
    let code = "";

    const {
      preAuthFindings,
      preAuthFindingsHospital,
      rmFindings,
      rmFindingsHospital,
    } = getTasksAndDocs({
      claimType: data?.claimType,
      claimCase: caseDetail,
    });

    if (data?.claimType === "PreAuth") {
      if (caseDetail?.allocationType === "Single") {
        value = preAuthFindings?.recommendation?.value || "";
        code = preAuthFindings?.recommendation?.code || "";
      } else if (caseDetail?.allocationType === "Dual") {
        value = preAuthFindingsHospital?.recommendation?.value || "";
        code = preAuthFindingsHospital?.recommendation?.code || "";
      }
    } else if (data?.claimType === "Reimbursement") {
      if (caseDetail?.allocationType === "Single") {
        value = rmFindings?.recommendation?.value || "";
        code = rmFindings?.recommendation?.code || "";
      } else if (caseDetail?.allocationType === "Dual") {
        value = rmFindingsHospital?.recommendation?.value || "";
        code = rmFindingsHospital?.recommendation?.code || "";
      }
    }

    if (value && !code) return value;
    if (!!value && !!code) return `${value}_${code}`;
    return "";
  }, [caseDetail, data?.claimType]);

  const checkIfCanClose = async () => {
    const {
      summaryOfInvestigation,
      qaRemarks,
      frcuRecommendationOnClaims,
      claimsGroundOfRepudiation,
      frcuGroundOfRepudiation,
      queriesToRaise,
      providerRecommendation,
      policyRecommendation,
      sourcingRecommendation,
      regulatoryReportingRecommendation,
      reInvestigationRemarks,
    } = approvedValues;

    if (!summaryOfInvestigation)
      return toast.warn("Fill Summary of investigation");
    if (!qaRemarks) return toast.warn("QA Remarks is required");
    if (!frcuRecommendationOnClaims)
      return toast.warn("Select FRCU Recommendation on Claims");
    if (frcuRecommendationOnClaims === "Repudiation") {
      if (!frcuGroundOfRepudiation || frcuGroundOfRepudiation?.length === 0)
        return toast.warn("Select FRCU Ground of Repudiation");
      if (!claimsGroundOfRepudiation || claimsGroundOfRepudiation?.length === 0)
        return toast.warn("Select Claims Ground of Repudiation");
    }
    if (
      ["Query to Raise_NC", "Query to Raise_QR"].includes(
        frcuRecommendationOnClaims
      ) &&
      !queriesToRaise
    )
      return toast.warn("Specify queries to raise");
    if (!providerRecommendation)
      return toast.warn("Select Provider Recommendation");
    if (!policyRecommendation)
      return toast.warn("Select Policy Recommendation");
    if (!sourcingRecommendation)
      return toast.warn("Select Sourcing Recommendation");
    if (!regulatoryReportingRecommendation)
      return toast.warn("Select Regulatory Recommendation");
    if (data?.isReInvestigated && !reInvestigationRemarks)
      return toast.warn("Re-Investigation Remarks is requiredl");

    if (
      recommendation !== frcuRecommendationOnClaims &&
      !caseDetail?.postQaOverRulingReason
    )
      return toast.warn("Please add over ruling reason");

    setModalVisible(true);
  };

  const updateStage = async () => {
    setStageUpdating(true);

    const rec = approvedValues?.frcuRecommendationOnClaims;
    const recVal = {
      value: rec?.split("_")[0] || "",
      code: rec?.split("_")[1] || "",
    };

    const preparedValues: RevisedQaApproveFormValues = {
      ...approvedValues,
      frcuRecommendationOnClaims: recVal,
      frcuGroundOfRepudiation: approvedValues?.frcuGroundOfRepudiation?.map(
        (el) => ({
          value: el?.split("_")[0] || "",
          code: el?.split("_")[1] || "",
        })
      ),
    };

    const encryptedClaimId = await getEncryptClaimId(data?.claimId);

    try {
      let reportLink = `/pdf-view-and-download?claimId=${encryptedClaimId}&docType=final-investigation-report`;

      const recommendation = {
        text: `${approvedValues?.qaRemarks}. This case is investigated at Nabhigator, Please refer the report link: `,
        link: reportLink,
      };

      const maximusPayload = {
        Claimdetail: {
          CLAIM_NO: data?.claimId?.toString(),
          CLAIM_TYPE: data?.claimType === "PreAuth" ? "P" : "R",
          POLICY_NUMBER: data?.contractDetails?.policyNo,
          SourceSystem: data?.sourceSystem,
        },
        Case_Assignment: {
          CASE_ASSIGNMENT_FLAG: "0",
          ASSIGN_TO: "",
          TO_EMAIL: "",
          CC_EMAIL: "",
          REMARKS: "",
          FRAUD_STATUS: "",
          STATUS_Updates: "",
          Line_Of_Investigation: {
            CA_Hospital_Visit: "0",
            CA_Treating_Doctor_Visit: "0",
            CA_Insured_Visit: "0",
            CA_Meeting_Family_Physician: "0",
            CA_Pathology: "0",
            CA_Chemist: "",
            CA_Relative: "0",
            CA_Neighbor: "0",
            CA_Vicinity: "0",
            CA_Employer_School_University: "0",
            CA_Other: "0",
            CA_OTHER_TEXT: "",
          },
        },
        Report_Sharing: {
          REPORT_SHARING_FLAG: "1",
          FINAL_OUTCOME: getFinalOutcomeCode(
            preparedValues?.frcuRecommendationOnClaims!,
            preparedValues?.frcuGroundOfRepudiation!
          ),
          FRAUD_STATUS: "C", // C => Case is closed, I => Assigned to investigator
          RPT_SEND_TO_EMAIL: `FIAllocation@nivabupa.com;Preauth.Team@nivabupa.com;${user?.email};`,
          EXECUTIVE_SUMMARY: "",
          RECOMMENDATION: "",
          quality_Check: {
            RS_Hospital_Visit: "1",
            RS_Treating_Doctor_Visit: "1",
            RS_Insured_Visit: "1",
            RS_Meeting_Family_Physician: "1",
            RS_Pathology: "1",
            RS_Chemist: "1",
            RS_Relative: "1",
            RS_Neighbor: "1",
            RS_Vicinity: "1",
            RS_Employer_School_University: "1",
            RS_Other: "0",
            RS_OTHER_TEXT: "",
          },
        },
        REPORT_Attachment: {
          file_name: "",
          fileURL: "",
          file_base64: "",
        },
      };

      const apiPayload = {
        payload: maximusPayload,
        recommendation,
        claimId: data?.claimId,
      };

      const payload = {
        id: data?._id,
        userId: user?._id,
        userName: user?.name,
        postQARecommendation: preparedValues,
      };

      let reverseRes: any = null;
      if (process.env.NEXT_PUBLIC_CONFIG !== "LOCAL") {
        const { data } = await axios.post(EndPoints.REVERSE_API, apiPayload);
        reverseRes = data;
      }

      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.POST_QA_SUBMIT, payload);

      toast.success(res.message);
      if (reverseRes) toast.success(reverseRes?.message);
      setModalVisible(false);
      router.replace("/Claims/action-inbox");
    } catch (error) {
      showError(error);
    } finally {
      setStageUpdating(false);
    }
  };

  useEffect(() => {
    let summary = "";
    if (data?.claimType === "PreAuth") {
      if (
        caseDetail?.allocationType === "Single" &&
        !!caseDetail?.singleTasksAndDocs?.preAuthFindings?.investigationSummary
      ) {
        summary =
          caseDetail?.singleTasksAndDocs?.preAuthFindings?.investigationSummary;
      } else if (
        caseDetail?.allocationType === "Single" &&
        !!caseDetail?.insuredTasksAndDocs?.preAuthFindings?.investigationSummary
      ) {
        summary =
          caseDetail?.insuredTasksAndDocs?.preAuthFindings
            ?.investigationSummary;
      }
    } else if (data?.claimType === "Reimbursement") {
      if (
        caseDetail?.allocationType === "Single" &&
        !!caseDetail?.singleTasksAndDocs?.rmFindings?.investigationSummary
      ) {
        summary =
          caseDetail?.singleTasksAndDocs?.rmFindings?.investigationSummary;
      } else if (
        caseDetail?.allocationType === "Single" &&
        !!caseDetail?.insuredTasksAndDocs?.rmFindings?.investigationSummary
      ) {
        summary =
          caseDetail?.insuredTasksAndDocs?.rmFindings?.investigationSummary;
      }
    }

    setApprovedValues((prev) => ({
      ...prev,
      summaryOfInvestigation:
        caseDetail?.postQARecommendation?.summaryOfInvestigation || summary,
      qaRemarks: caseDetail?.postQARecommendation?.qaRemarks || "",
      reInvestigationRemarks:
        caseDetail?.postQARecommendation?.reInvestigationRemarks || "",
      frcuRecommendationOnClaims:
        prev?.frcuRecommendationOnClaims || recommendation || "-",
      documents: caseDetail?.postQARecommendation?.documents || [],
    }));
  }, [caseDetail, data?.claimType, recommendation]);

  return (
    <Box className="mt-4">
      <PostQaApproveForm
        dashboardData={data}
        approvedValues={approvedValues}
        setApprovedValues={setApprovedValues}
        recommendation={recommendation}
        caseDetail={caseDetail}
        setCaseDetail={setCaseDetail}
      />
      <InvestigationSummary dashboardData={data} caseDetails={caseDetail} />
      <Button mt={12} color="green" onClick={checkIfCanClose}>
        Approve
      </Button>
      <Button mt={12} color="red" onClick={handleCancel} ml={8}>
        Cancel
      </Button>
      {modalVisible && (
        <Modal
          opened={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Approving the case"
          centered
          size="lg"
        >
          <Box mt={20}>
            <Box>
              <Text>This action will close the case.</Text>
              <Text>By clicking confirm the case will closed.</Text>
              <Text>Are you sure to proceed?</Text>
            </Box>
            <Flex columnGap={10} mt={50}>
              <Button
                loading={stageUpdating}
                disabled={stageUpdating}
                color="green"
                onClick={updateStage}
              >
                Confirm
              </Button>
              <Button
                disabled={stageUpdating}
                color="red"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default PostQaApproveContent;
