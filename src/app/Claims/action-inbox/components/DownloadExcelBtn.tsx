import React, { useState } from "react";
import { Button } from "@mantine/core";
import { IoCloudDownloadOutline } from "react-icons/io5";
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import axios from "axios";
import {
  DashboardFilters,
  IDashboardData,
  ResponseType,
  SortOrder,
} from "@/lib/utils/types/fniDataTypes";
import { EndPoints } from "@/lib/utils/types/enums";
import { getStageLabel, removeEmptyProperties, showError } from "@/lib/helpers";

type PropTypes = {
  filters: DashboardFilters;
  sort: {
    [x: string]: SortOrder;
  } | null;
  searchTerm: string;
};

const DownloadExcelBtn = ({ filters, sort, searchTerm }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    let stageValue: any = undefined;
    if (filters?.stage && filters?.stage?.length > 0)
      stageValue = { $in: filters?.stage?.map((st) => parseInt(st)) };

    const payload = {
      ...filters,
      sort: sort || undefined,
      claimId: searchTerm || undefined,
      benefitType:
        filters?.benefitType && filters?.benefitType?.length > 0
          ? { $in: filters?.benefitType }
          : undefined,
      filterApplied: true,
      pagination: { limit: 10000, page: 1 },
    };
    delete payload?.moreFilters;
    try {
      const { data } = await axios.post<ResponseType<IDashboardData>>(
        EndPoints.DASHBOARD_DATA,
        payload
      );
      await handleExport(data?.data);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (data: IDashboardData[]) => {
    const updatedData = data?.map((el) =>
      removeEmptyProperties({
        ...el,
        stage: getStageLabel(el?.stage),
        lossType: el?.lossType || "-",
        benefitType: el?.benefitType || "-",
        intimationDate: dayjs(el.intimationDate).format(
          "DD-MMM-YYYY hh:mm:ss a"
        ),
        isReInvestigated: el?.isReInvestigated ? "Yes" : "No",
        dateOfOS: el.dateOfOS
          ? dayjs(el.dateOfOS).format("DD-MMM-YYYY hh:mm:ss a")
          : "-",
        invReportReceivedDate:
          el.caseId &&
          typeof el?.caseId === "object" &&
          el.caseId.invReportReceivedDate
            ? dayjs(el.caseId.invReportReceivedDate).format(
                "DD-MMM-YYYY hh:mm:ss a"
              )
            : "-",
        dateOfClosure: el.dateOfClosure
          ? dayjs(el.dateOfClosure).format("DD-MMM-YYYY hh:mm:ss a")
          : "-",
        triageSummary: undefined,
        teamLead:
          el?.teamLead &&
          Array.isArray(el?.teamLead) &&
          el?.teamLead?.length > 0
            ? el?.teamLead?.map((tl) => tl.name)?.join(", ")
            : "-",
        postQa:
          el?.postQa && typeof el?.postQa !== "string" ? el?.postQa?.name : "-",
        finalOutcome:
          el?.caseId &&
          typeof el?.caseId === "object" &&
          !!el?.caseId.postQARecommendation?.frcuRecommendationOnClaims?.value
            ? el?.caseId?.postQARecommendation?.frcuRecommendationOnClaims
                ?.value
            : "-",
        investigatorRecommendation:
          el?.caseId &&
          typeof el?.caseId === "object" &&
          !!el?.caseId?.investigationFindings?.recommendation?.value
            ? el?.caseId?.investigationFindings?.recommendation?.value
            : "-",
        clusterManager:
          el?.clusterManager && typeof el?.clusterManager !== "string"
            ? el?.clusterManager?.name
            : "-",
        claimInvestigators:
          el?.claimInvestigators?.length > 0
            ? el?.claimInvestigators?.map((ci) => ci?.name)?.join(", ")
            : "-",
        allocationType: el?.allocationType || "Not Allocated",
        __v: undefined,
        rowColor: undefined,
        encryptedClaimId: undefined,
        _id: undefined,
        contractDetails: undefined,
        members: undefined,
        insuredDetails: undefined,
        claimDetails: undefined,
        hospitalDetails: undefined,
        hospitalizationDetails: undefined,
        fraudIndicators: undefined,
        actionsTaken: undefined,
        expedition: undefined,
        locked: undefined,
        dateOfFallingIntoReInvestigation: undefined,
        dateOfFallingIntoAllocationBucket: undefined,
        caseId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        cataractOrDayCareProcedure: undefined,
        rejectionReasons: undefined,
        historicalClaim: undefined,
        insuredName: el?.insuredDetails?.insuredName,
        insuredType: el?.insuredDetails?.insuredType,
        insuredAddress: el?.insuredDetails?.address,
        insuredCity: el?.insuredDetails?.city,
        insuredState: el?.insuredDetails?.state,
        insuredAge: el?.insuredDetails?.age,
        insuredContactNo: el?.insuredDetails?.contactNo,
        insuredEmail: el?.insuredDetails?.emailId,
        insuredGender: el?.insuredDetails?.gender,
        providerName: el?.hospitalDetails?.providerName,
        providerType: el?.hospitalDetails?.providerType,
        providerNumber: el?.hospitalDetails?.providerNo,
        providerAddress: el?.hospitalDetails?.providerAddress,
        providerCity: el?.hospitalDetails?.providerCity,
        providerState: el?.hospitalDetails?.providerState,
        providerPinCode: el?.hospitalDetails?.pinCode,
        contractNo: el?.contractDetails?.contractNo,
        policyNo: el?.contractDetails?.policyNo,
        policyStartDate: el?.contractDetails?.policyStartDate
          ? dayjs(el?.contractDetails?.policyStartDate).format(
              "DD-MMM-YYYY hh:mm:ss a"
            )
          : "-",
        policyEndDate: el?.contractDetails?.policyEndDate
          ? dayjs(el?.contractDetails?.policyEndDate).format(
              "DD-MMM-YYYY hh:mm:ss a"
            )
          : "-",
        dateOfFallingIntoPostQaBucket: el?.dateOfFallingIntoPostQaBucket
          ? dayjs(el?.dateOfFallingIntoPostQaBucket).format(
              "DD-MMM-YYYY hh:mm:ss a"
            )
          : "-",
        agentName: el?.contractDetails?.agentName,
        agentCode: el?.contractDetails?.agentCode,
        currentStatus: el?.contractDetails?.currentStatus,
        product: el?.contractDetails?.product,
        sourcing: el?.contractDetails?.sourcing,
        previousInsuranceCompany: el?.contractDetails?.prevInsuranceCompany,
        claimAmount: el?.claimDetails?.claimAmount,
        billedAmount: el?.claimDetails?.billedAmount,
        deductibleAmount: el?.claimDetails?.deductibleAmount,
        claimStatus: el?.claimDetails?.claimStatus,
        diagnosis: el?.claimDetails?.diagnosis,
        admissionType: el?.hospitalizationDetails?.admissionType,
        memberNo: el?.claimDetails?.memberNo,
      })
    );

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(updatedData);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Action Inbox");
    xlsx.writeFile(wb, "Action-Inbox.xlsx");
  };

  return (
    <Button
      size="compact-md"
      color="cyan"
      rightSection={<IoCloudDownloadOutline />}
      onClick={fetchData}
      loading={loading}
      disabled={loading}
    >
      Export Excel
    </Button>
  );
};

export default DownloadExcelBtn;
