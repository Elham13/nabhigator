import React, { useEffect, useState } from "react";
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
  NumericStage,
  PostQaApproveFormValues,
  RevisedQaApproveFormValues,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { EndPoints, StorageKeys } from "@/lib/utils/types/enums";
import { getFinalOutcomeCode, showError } from "@/lib/helpers";

type PropTypes = {
  caseDetail: CaseDetail | null;
  data: IDashboardData | null;
  handleCancel: () => void;
};

const approvedValuesInitials: PostQaApproveFormValues = {
  summaryOfInvestigation: "",
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
  handleCancel,
}: PropTypes) => {
  const router = useRouter();
  const [approvedValues, setApprovedValues] = useState<PostQaApproveFormValues>(
    approvedValuesInitials
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [stageUpdating, setStageUpdating] = useState<boolean>(false);
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const [overRulingReason, setOverRulingReason] = useState<string>("");

  const recommendation =
    data?.claimType === "PreAuth"
      ? `${caseDetail?.investigationFindings?.recommendation?.value}${
          caseDetail?.investigationFindings?.recommendation?.code
            ? `_${caseDetail?.investigationFindings?.recommendation?.code}`
            : ""
        }`
      : data?.claimType === "Reimbursement"
      ? caseDetail?.rmFindings?.recommendation?.value || ""
      : "";

  const saveOverRuling = async () => {
    try {
      await axios.post(EndPoints.UPDATE_CASE_DETAIL, {
        id: caseDetail?._id,
        action: "AddOverRulingReason",
        postQaOverRulingReason: overRulingReason,
      });
    } catch (error: any) {
      showError(error);
    }
  };

  const handleClose = async () => {
    const {
      summaryOfInvestigation,
      frcuRecommendationOnClaims,
      claimsGroundOfRepudiation,
      frcuGroundOfRepudiation,
      queriesToRaise,
      providerRecommendation,
      policyRecommendation,
      sourcingRecommendation,
      regulatoryReportingRecommendation,
    } = approvedValues;
    if (!summaryOfInvestigation)
      return toast.warn("Fill Summary of investigation");
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

    if (recommendation !== frcuRecommendationOnClaims && !overRulingReason)
      return toast.warn("Please add over ruling reason");
    else if (recommendation !== frcuRecommendationOnClaims && overRulingReason)
      await saveOverRuling();

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

    try {
      let reportLink = `/pdf-view-and-download?claimId=${data?.encryptedClaimId}&docType=final-investigation-report`;

      const recommendation = {
        text: `${approvedValues?.summaryOfInvestigation}. This case is investigated at Nabhigator, Please refer the report link: `,
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
            preparedValues?.frcuRecommendationOnClaims,
            preparedValues?.frcuGroundOfRepudiation
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
        action: "changeStage",
        stage: NumericStage.CLOSED,
        userId: user?._id,
        userName: user?.name,
        postQARecommendation: preparedValues,
      };

      const { data: reverseRes } = await axios.post(
        EndPoints.REVERSE_API,
        apiPayload
      );

      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.UPDATE_DASHBOARD_DATA, payload);

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
    if (data?.claimType === "PreAuth") {
      if (caseDetail?.investigationFindings?.investigationSummary) {
        setApprovedValues((prev) => ({
          ...prev,
          summaryOfInvestigation:
            caseDetail?.investigationFindings?.investigationSummary || "",
          frcuRecommendationOnClaims: recommendation || "-",
        }));
      }
    } else if (data?.claimType === "Reimbursement") {
      if (caseDetail?.rmFindings?.investigationSummary) {
        setApprovedValues((prev) => ({
          ...prev,
          summaryOfInvestigation:
            caseDetail?.rmFindings?.investigationSummary || "",
          frcuRecommendationOnClaims: recommendation || "-",
        }));
      }
    }
  }, [
    caseDetail?.investigationFindings?.investigationSummary,
    caseDetail?.rmFindings?.investigationSummary,
    data?.claimType,
    recommendation,
  ]);

  return (
    <Box className="mt-4">
      <PostQaApproveForm
        approvedValues={approvedValues}
        setApprovedValues={setApprovedValues}
        overRulingReason={overRulingReason}
        setOverRulingReason={setOverRulingReason}
        recommendation={recommendation}
      />
      <InvestigationSummary dashboardData={data} caseDetails={caseDetail} />
      <Button mt={12} color="green" onClick={handleClose}>
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
