import React, { Dispatch, SetStateAction, useState } from "react";
import KeyValueContainer from "./KeyValueContainer";
import dayjs from "dayjs";
import { ActionIcon, Flex, Grid, GridCol } from "@mantine/core";
import {
  IDashboardData,
  SingleResponseType,
} from "@/lib/utils/types/fniDataTypes";
import { convertToIndianFormat, getStageLabel, showError } from "@/lib/helpers";
import { IoReload } from "react-icons/io5";
import axios from "axios";
import { EndPoints } from "@/lib/utils/types/enums";
import { toast } from "react-toastify";

type PropTypes = {
  data: IDashboardData | null;
  setData: Dispatch<SetStateAction<IDashboardData | null>>;
};

const GeneralContent = ({ data, setData }: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateClaimStatus = async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.post<
        SingleResponseType<IDashboardData>
      >(EndPoints.UPDATE_FNI_DYNAMIC_FIELDS, {
        fieldToUpdate: "claimStatusUpdated",
        claimId: data?.claimId,
        claimType: data?.claimType,
        membershipId: data?.insuredDetails?.memberId,
      });
      toast.success(res?.message);
      setData(res?.data);
    } catch (error: any) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid>
      {/* <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer label="Referral Type" value={data?.claimDetails?.claimTrigger} />
      </GridCol> */}
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Sourcing"
          value={data?.claimDetails?.claimTrigger}
        />
      </GridCol>
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label={data?.claimType === "PreAuth" ? "Pre-Auth Number" : "Claim ID"}
          value={data?.claimId}
        />
      </GridCol>
      {data?.claimType === "PreAuth" ? (
        <>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured Name"
              value={data?.insuredDetails?.insuredName}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured DOB"
              value={dayjs(data?.insuredDetails?.dob).format("DD-MMM-YYYY")}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured Age"
              value={data?.insuredDetails?.age}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Relation"
              value={data?.insuredDetails?.insuredType}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured Address"
              value={data?.insuredDetails?.address}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured City"
              value={data?.insuredDetails?.city}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured State"
              value={data?.insuredDetails?.state}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Insured Mobile Number"
              value={data?.insuredDetails?.contactNo}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Provider Name"
              value={data?.hospitalDetails?.providerName}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Provider Code"
              value={data?.hospitalDetails?.providerNo}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Provider Address"
              value={data?.hospitalDetails?.providerAddress}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Provider City"
              value={data?.hospitalDetails?.providerCity}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Provider State"
              value={data?.hospitalDetails?.providerState}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Pre-Auth Status Original"
              value={data?.claimDetails?.claimStatus}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <Flex gap={10} justify="space-between">
              <KeyValueContainer
                label="Pre-Auth Status Updated"
                value={data?.claimDetails?.claimStatusUpdated}
              />
              <ActionIcon size="md" onClick={updateClaimStatus}>
                <IoReload className={`${loading ? "animate-spin" : ""}`} />
              </ActionIcon>
            </Flex>
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Diagnosis"
              value={data?.claimDetails?.diagnosis}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Treatment Type"
              value={data?.claimDetails?.claimType}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Request Amount"
              value={
                data?.claimDetails?.billedAmount
                  ? convertToIndianFormat(
                      parseInt(data?.claimDetails?.billedAmount)
                    )
                  : "0"
              }
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Treating Doctor Name"
              value={data?.hospitalizationDetails?.treatingDoctorName || "-"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Admission Original"
              value={data?.hospitalizationDetails?.dateOfAdmission}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Admission Updated"
              value={data?.hospitalizationDetails?.dateOfAdmissionUpdated}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Discharge Original"
              value={data?.hospitalizationDetails?.dateOfDischarge}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Date of Discharge Updated"
              value={data?.hospitalizationDetails?.dateOfDischargeUpdated}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Pre-Auth Received Date"
              value={data?.claimDetails?.receivedAt}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Exclusion Remarks"
              value={data?.claimDetails?.exclusionRemark}
            />
          </GridCol>
        </>
      ) : (
        <>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer label="Claim Type" value={data?.claimType} />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Claim SubType"
              value={data?.claimSubType}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Allocation Type"
              value={data?.allocationType}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer label="Benefit Type" value={data?.benefitType} />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Stage"
              value={getStageLabel(data?.stage || 1)}
            />
          </GridCol>
          {data?.dateOfOS && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Date of OS"
                value={dayjs(data?.dateOfOS).format("DD-MMM-YYYY hh:mm a")}
              />
            </GridCol>
          )}
          {data?.dateOfClosure && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Date of closure"
                value={dayjs(data?.dateOfClosure).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {data?.lossDate && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Loss date"
                value={dayjs(data?.lossDate).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {data?.updatedAt && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Updated At"
                value={dayjs(data?.updatedAt).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {data?.createdAt && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer
                label="Created At"
                value={dayjs(data?.createdAt).format("DD-MMM-YYYY")}
              />
            </GridCol>
          )}
          {data?.sumInsured && (
            <GridCol span={{ sm: 12, md: 6 }}>
              <KeyValueContainer label="Sum Insured" value={data?.sumInsured} />
            </GridCol>
          )}
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Is Re-Investigated?"
              value={data?.isReInvestigated ? "Yes" : "No"}
            />
          </GridCol>
          <GridCol span={{ sm: 12, md: 6 }}>
            <KeyValueContainer
              label="Investigation Count"
              value={data?.investigationCount}
            />
          </GridCol>
        </>
      )}
      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Intimation Date & Time"
          value={
            data?.intimationDate
              ? dayjs(data?.intimationDate).format("DD-MMM-YYYY hh:mm a")
              : "-"
          }
        />
      </GridCol>

      <GridCol span={{ sm: 12, md: 6 }}>
        <KeyValueContainer
          label="Admission Type"
          value={data?.hospitalizationDetails?.admissionType}
        />
      </GridCol>
    </Grid>
  );
};

export default GeneralContent;
