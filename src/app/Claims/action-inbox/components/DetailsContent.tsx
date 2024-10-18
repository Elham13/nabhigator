"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Box, Center, Loader } from "@mantine/core";
import dayjs from "dayjs";
import axios from "axios";
import { useLocalStorage } from "@mantine/hooks";
import dynamic from "next/dynamic";
import {
  CaseDetail,
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
import { BiCog } from "react-icons/bi";

const PreQcFooter = dynamic(() => import("./InboxDetail/PreQcFooter"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const PostQAFooter = dynamic(() => import("./InboxDetail/PostQAFooter"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const AllocationFooter = dynamic(
  () => import("./InboxDetail/AllocationFooter"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const SkipInvestigation = dynamic(
  () => import("./InboxDetail/SkipInvestigation"),
  {
    ssr: false,
    loading: () => <BiCog className="animate-spin" />,
  }
);
const Expedite = dynamic(() => import("./InboxDetail/Expedite"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const NotificationModal = dynamic(() => import("./NotificationModal"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const DetailsAccordion = dynamic(() => import("./DetailsAccordion"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const PostQaLeadFooter = dynamic(() => import("./PostQaLeadFooter"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});
const FrozenRibbon = dynamic(() => import("./InboxDetail/FrozenRibbon"), {
  ssr: false,
  loading: () => <BiCog className="animate-spin" />,
});

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
  assignToPostQA: false,
};

type PropTypes = {
  dashboardDataId: string;
  origin: "consolidated" | "inbox";
};

const DetailsContent = ({ dashboardDataId, origin }: PropTypes) => {
  const [user] = useLocalStorage<IUserFromSession>({ key: StorageKeys.USER });
  const isFirstRender = useRef<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IDashboardData | null>(null);
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
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
    if (dashboardDataId && isFirstRender.current) {
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
      isFirstRender.current = false;
    }
  }, [dashboardDataId, isFirstRender.current]);

  const skipInvestigationRoleCheck = [
    Role.ADMIN,
    Role.CLUSTER_MANAGER,
    Role.TL,
    Role.PRE_QC,
    Role.ALLOCATION,
  ].includes(user?.activeRole);

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
          {data?._id ? <NotificationModal data={data} user={user} /> : null}
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
              <h1 className="text-xl font-bold">{data?.claimId}</h1>
              <h2 className="text-lg font-semibold">
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
                <span className="text-yellow-400">
                  {data?.stage && getStageLabel(data?.stage)}
                </span>
              </h4>
            </Box>
            {data?.claimType === "Reimbursement" && (
              <FrozenRibbon data={data} />
            )}

            <DetailsAccordion
              {...{
                data,
                caseDetail,
                skipInvestigationRoleCheck,
                showElement,
                origin,
                setData,
                setCaseDetail,
                setShowElement,
              }}
            />

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
              NumericStage.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
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

            {user?.activeRole === Role.POST_QA_LEAD && origin === "inbox" ? (
              <PostQaLeadFooter
                {...{
                  showElement,
                  setShowElement,
                  claimId: data?.claimId || 0,
                }}
              />
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
