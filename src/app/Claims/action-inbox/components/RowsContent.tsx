import React from "react";
import { Anchor, Badge, Table } from "@mantine/core";
import dayjs from "dayjs";
import LockView from "./InboxDetail/LockView";
import TableCell from "./TableCell";
import { useLocalStorage } from "@mantine/hooks";
import ClaimIdCell from "./ClaimIdCell";
import { IDashboardData, Role } from "@/lib/utils/types/fniDataTypes";
import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import {
  convertToIndianFormat,
  getStageLabel,
  getStatusColor,
} from "@/lib/helpers";

type PropTypes = {
  data: IDashboardData[];
  fetchData: () => void;
  handleView: (id: string) => void;
};

const RowsContent = ({ data, fetchData, handleView }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });

  return (
    <>
      {data?.map((el) => {
        return (
          <Table.Tr key={el?._id as string}>
            <TableCell
              columnName="claimId"
              style={{ backgroundColor: el.rowColor, color: "#fff" }}
              value={
                <ClaimIdCell
                  data={el}
                  onClick={() => handleView(el?._id as string)}
                />
              }
            />
            <TableCell columnName="claimType" value={el?.claimType} />
            <TableCell
              columnName="claimSubType"
              value={el?.claimSubType || "-"}
            />
            <TableCell columnName="lossType" value={el?.lossType || "-"} />
            <TableCell
              columnName="benefitType"
              value={el?.benefitType || "-"}
            />
            <TableCell
              columnName="stage"
              value={
                <Badge color={getStatusColor(el?.stage)}>
                  {getStageLabel(el?.stage)}
                </Badge>
              }
            />
            <TableCell
              columnName="claimDetails.claimAmount"
              value={
                el?.claimDetails?.claimAmount
                  ? convertToIndianFormat(el?.claimDetails?.claimAmount)
                  : 0
              }
            />
            <TableCell
              columnName="insuredDetails.insuredName"
              value={el?.insuredDetails?.insuredName}
            />
            <TableCell
              columnName="hospitalDetails.providerName"
              value={el?.hospitalDetails?.providerName}
            />
            <TableCell
              columnName="hospitalDetails.providerCity"
              value={el?.hospitalDetails?.providerCity}
            />
            <TableCell
              columnName="hospitalDetails.providerState"
              value={el?.hospitalDetails?.providerState}
            />
            <TableCell
              columnName="hospitalizationDetails.dateOfAdmission"
              value={
                el?.hospitalizationDetails?.dateOfAdmission
                  ? dayjs(el?.hospitalizationDetails?.dateOfAdmission).format(
                      "DD-MMM-YYYY"
                    )
                  : "-"
              }
            />
            <TableCell
              columnName="intimationDate"
              value={
                el?.intimationDate
                  ? dayjs(el?.intimationDate).format("DD-MMM-YYYY")
                  : "-"
              }
            />
            <TableCell
              columnName="dateOfOS"
              value={
                el?.dateOfOS ? dayjs(el?.dateOfOS).format("DD-MMM-YYYY") : "-"
              }
            />
            <TableCell
              columnName="dateOfFallingIntoPostQaBucket"
              value={
                el?.dateOfFallingIntoPostQaBucket
                  ? dayjs(el?.dateOfFallingIntoPostQaBucket).format(
                      "DD-MMM-YYYY"
                    )
                  : "-"
              }
            />
            <TableCell
              columnName="invReportReceivedDate"
              value={
                el?.caseId &&
                typeof el?.caseId === "object" &&
                el?.caseId?.invReportReceivedDate
                  ? dayjs(el?.caseId?.invReportReceivedDate).format(
                      "DD-MMM-YYYY"
                    )
                  : "-"
              }
            />
            <TableCell
              columnName="dateOfClosure"
              value={
                el?.dateOfClosure
                  ? dayjs(el?.dateOfClosure).format("DD-MMM-YYYY")
                  : "-"
              }
            />
            <TableCell
              columnName="teamLead"
              value={
                el?.teamLead?.length > 0
                  ? el?.teamLead?.map((tl) => tl.name)?.join(", ")
                  : "-"
              }
            />
            <TableCell
              columnName="clusterManager"
              value={
                el?.clusterManager && typeof el?.clusterManager !== "string"
                  ? el?.clusterManager?.name
                  : "-"
              }
            />
            <TableCell
              columnName="postQa"
              value={
                el?.postQa && typeof el?.postQa !== "string"
                  ? el?.postQa?.name
                  : "-"
              }
            />
            <TableCell
              columnName="frcuRecommendationOnClaims"
              value={
                el?.caseId &&
                typeof el?.caseId === "object" &&
                !!el?.caseId.postQARecommendation?.frcuRecommendationOnClaims
                  ?.value
                  ? el?.caseId?.postQARecommendation?.frcuRecommendationOnClaims
                      ?.value
                  : "-"
              }
            />
            <TableCell
              columnName="investigationFindings.recommendation"
              value={
                el?.caseId &&
                typeof el?.caseId === "object" &&
                !!el?.caseId?.investigationFindings?.recommendation?.value
                  ? el?.caseId?.investigationFindings?.recommendation?.value
                  : "-"
              }
            />
            <TableCell
              columnName="claimInvestigators"
              value={
                el?.claimInvestigators?.length > 0
                  ? el?.claimInvestigators?.map((ci) => ci?.name)?.join(", ")
                  : "-"
              }
            />
            <TableCell
              columnName="allocationType"
              value={el?.allocationType || "-"}
            />
            <TableCell columnName="openTAT" value={el?.openTAT || 0} />
            <TableCell columnName="closureTAT" value={el?.closureTAT || 0} />
            <TableCell
              columnName="actions"
              value={
                <div className="flex items-center gap-x-2">
                  <Anchor
                    component="button"
                    onClick={() => handleView(el?._id as string)}
                  >
                    View
                  </Anchor>
                  {[Role.ADMIN, Role.CLUSTER_MANAGER, Role.TL].includes(
                    user?.activeRole
                  ) && <LockView data={el} onSuccess={fetchData} />}
                </div>
              }
            />
          </Table.Tr>
        );
      })}
    </>
  );
};

export default RowsContent;
