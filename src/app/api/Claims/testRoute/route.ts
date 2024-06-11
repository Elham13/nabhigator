import ClaimCase from "@/lib/Models/claimCase";
import connectDB from "@/lib/db/dbConnectWithMongoose";
import { Databases } from "@/lib/utils/types/enums";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import DashboardData from "@/lib/Models/dashboardData";
import { HydratedDocument } from "mongoose";
import {
  EventNames,
  IDashboardData,
  IUser,
  IZoneStateMaster,
  NumericStage,
  Role,
} from "@/lib/utils/types/fniDataTypes";
import ClaimInvestigator from "@/lib/Models/claimInvestigator";
import User from "@/lib/Models/user";
import NewPinCodeMaster from "@/lib/Models/newPinCodeMaster";
import NewStateDistrictMaster from "@/lib/Models/newStateDistrictMaster";
import ZoneStateMaster from "@/lib/Models/zoneStateMaster";
import ZoneMaster from "@/lib/Models/zoneMaster";
import CaseEvent from "@/lib/Models/caseEvent";

// dayjs.extend(utc);
// dayjs.extend(timezone);

const router = createEdgeRouter<NextRequest, {}>();

const addClaimAmountManually = async () => {
  try {
    const data = await DashboardData.find({}).lean();

    for (let doc of data) {
      await DashboardData.findByIdAndUpdate(doc._id, {
        $set: {
          // "claimDetails.claimAmount": Math.floor(
          //   Math.random() * 10000000 + 10000
          // ).toString(),
          referralType: "API",
        },
      });
    }
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const filterDataBasedOnTimeRange = async () => {
  try {
    // Example time range: greater than 5 am and less than 6 pm in UTC
    const twoHoursBeforeNow = dayjs.utc().subtract(2, "hours");

    const data = await DashboardData.find({
      $expr: {
        $and: [
          {
            $lte: [
              {
                $hour: {
                  date: "$intimationDate",
                  timezone: "UTC",
                },
              },
              dayjs().utc().hour(),
            ],
          },
          {
            $gt: [
              {
                $hour: {
                  date: "$intimationDate",
                  timezone: "UTC",
                },
              },
              dayjs(twoHoursBeforeNow).utc().hour(),
            ],
          },
        ],
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const addHospitalDetailsToDashboardData = async () => {
  try {
    const hospitals = [
      {
        providerNo: "20348 ",
        providerName: "YASHODA SUPER SPECIALITY HOSPITAL, Ranga Reddy",
        providerType: "Not Found!",
        providerAddress: "Rajbhavan Road, Somajiguda Ranga Reddy Dist.  ",
        providerState: "Telangana",
        providerCity: "HYDERABAD",
        pinCode: "500082",
      },
      {
        providerNo: "20007 ",
        providerName: "Max Hospital.",
        providerType: "Not Found!",
        providerAddress: "W-3, Sector -1, Vaishali   ",
        providerState: "Uttar Pradesh",
        providerCity: "GHAZIABAD",
        pinCode: "201001",
      },
      {
        providerNo: "20007 ",
        providerName: "Max Hospital.",
        providerType: "Not Found!",
        providerAddress: "W-3, Sector -1, Vaishali   ",
        providerState: "Uttar Pradesh",
        providerCity: "GHAZIABAD",
        pinCode: "201001",
      },
      {
        providerNo: "20004 ",
        providerName: "CENTRE FOR SIGHT, SAFDARJUNG ENCLAVE",
        providerType: "Not Found!",
        providerAddress: "B 5/24, SAFDARJUNG ENCLAVE   ",
        providerState: "Delhi",
        providerCity: "SOUTH WEST DELHI",
        pinCode: "110029",
      },
      {
        providerNo: "20115 ",
        providerName: "Max Super Specialty- Patparganj",
        providerType: "Not Found!",
        providerAddress:
          "108 A  Sanchar Apartments  Indraprastha Extension Extn  Patparganj   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20743 ",
        providerName: "Sai Krishna Hi-Tech Hospital and Research Centre",
        providerType: "Not Found!",
        providerAddress: "Radhan Pur Road, Swaminarayan Circle   ",
        providerState: "Gujarat",
        providerCity: "MAHESANA",
        pinCode: "384002",
      },
      {
        providerNo: "20235 ",
        providerName: "Fortis Hospital, Noida",
        providerType: "Not Found!",
        providerAddress: "B-22, Sector-62   ",
        providerState: "Uttar Pradesh",
        providerCity: "GAUTAM BUDDHA NAGAR",
        pinCode: "201301",
      },
      {
        providerNo: "20115 ",
        providerName: "Max Super Specialty- Patparganj",
        providerType: "Not Found!",
        providerAddress:
          "108 A  Sanchar Apartments  Indraprastha Extension Extn  Patparganj   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20119 ",
        providerName: "MAX HOSPITAL  GURGAON",
        providerType: "Not Found!",
        providerAddress: "Block - B  Sushant Lok  Phase I  Gurgaon   ",
        providerState: "Haryana",
        providerCity: "GURGAON",
        pinCode: "122001",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20115 ",
        providerName: "Max Super Specialty- Patparganj",
        providerType: "Not Found!",
        providerAddress:
          "108 A  Sanchar Apartments  Indraprastha Extension Extn  Patparganj   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20003 ",
        providerName: "CENTRE FOR SIGHT, PREET VIHAR",
        providerType: "Not Found!",
        providerAddress: "F-19 MAIN VIKAS MARG PREET VIHAR   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
      {
        providerNo: "20115 ",
        providerName: "Max Super Specialty- Patparganj",
        providerType: "Not Found!",
        providerAddress:
          "108 A  Sanchar Apartments  Indraprastha Extension Extn  Patparganj   ",
        providerState: "Delhi",
        providerCity: "EAST DELHI",
        pinCode: "110092",
      },
    ];

    let ind = 0;

    const data = await DashboardData.find({}).lean();
    for (let doc of data) {
      await DashboardData.findByIdAndUpdate(doc._id, {
        $set: {
          hospitalDetails: hospitals[ind],
        },
      });
      ind += 1;
    }
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

const createClaimCase = async () => {
  const data: any = await ClaimCase.find({}).lean();

  for (let doc of data) {
    await ClaimCase.findByIdAndUpdate(doc?._id, {
      $set: { reInvestigationDocuments: doc?.documents },
    });
  }

  return data;
};

const cloneDashboardData = async () => {
  const data: HydratedDocument<IDashboardData> | null =
    await DashboardData.findOne({
      claimId: 48458,
    }).lean();

  if (data) {
    return await DashboardData.create({
      ...data,
      claimId: data?.claimId + 1,
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
  }
};

const updateInvestigators = async () => {
  // TODO: Run this also in production
  try {
    const investigators: any = await ClaimInvestigator.find({}).lean();

    for (let el of investigators) {
      // await ClaimInvestigator.findByIdAndUpdate(el?._id, {
      //   $set: {
      //     dailyThreshold: el?.dailyThreshold ? parseInt(el?.dailyThreshold) : 0,
      //     monthlyThreshold: el?.monthlyThreshold
      //       ? parseInt(el?.monthlyThreshold)
      //       : 0,
      //     dailyAssign: el?.dailyAssign ? parseInt(el?.dailyAssign) : 0,
      //     monthlyAssigned: el?.monthlyAssigned
      //       ? parseInt(el?.monthlyAssigned)
      //       : 0,
      //     hitRate: el?.hitRate ? parseInt(el?.hitRate) : 0,
      //     TAT: el?.TAT ? parseInt(el?.TAT) : 0,
      //     performance: el?.performance ? parseInt(el?.performance) : 0,
      //     activeFrom: null,
      //   },
      // });
      await ClaimInvestigator.findByIdAndUpdate(el?._id, {
        $set: {
          email: el?.email ? [el?.email] : [],
        },
      });
    }

    // const investigators: any = await ClaimInvestigator.find({
    //   assignmentPreferred: "Cashless",
    // }).lean();

    // for (let el of investigators) {
    //   let preference = el?.assignmentPreferred;
    //   preference = preference?.map((item) =>
    //     item === "Cashless" ? "PreAuth" : item
    //   );
    //   await ClaimInvestigator.findByIdAndUpdate(el?._id, {
    //     assignmentPreferred: preference,
    //   });
    // }

    // for (let el of investigators) {
    //   const pinCodeData = {
    //     name: el?.pincodeData?.name || el?.investigatorName,
    //     pinCodes: el?.pincodes?.pincodes || [],
    //   };
    //   const pinCodes = el?.pincodes || [];
    //   const cityData = {
    //     name: el?.cityData?.name || el?.investigatorName,
    //     cities: el?.cityData?.pincodes || [],
    //   };
    //   const cities = el?.cities || [];
    //   const stateData = {
    //     name: el?.stateData?.name || el?.investigatorName,
    //     states: el?.stateData?.pincodes || [],
    //   };
    //   const states = el?.states || [];
    //   const providerData = {
    //     name: el?.providerData?.name || el?.investigatorName,
    //     providers: el?.providerData?.pincodes || [],
    //   };
    //   const providers = el?.provider || [];

    //   await ClaimInvestigator.findByIdAndUpdate(el?._id, {
    //     $set: {
    //       pinCodeData,
    //       pinCodes,
    //       cityData,
    //       cities,
    //       stateData,
    //       states,
    //       providerData,
    //       providers,
    //     },
    //     $unset: {
    //       "Unnamed: 9": 1,
    //       "Unnamed: 10": 1,
    //       pincodeData: 1,
    //       pincodes: 1,
    //       provider: 1,
    //     },
    //   });
    // }
    return {};
  } catch (error: any) {
    throw new Error(error);
  }
};

const convertDocUrlToArray = async () => {
  const caseDetails = await ClaimCase.find({}).lean();

  for (let cCase of caseDetails) {
    let documents = cCase?.documents;

    for (const key in documents) {
      if (Object.hasOwnProperty.call(documents, key)) {
        const arr = documents[key];

        documents[key] = arr.map((obj: any) => {
          obj.docUrl = obj.docUrl
            ? typeof obj?.docUrl === "string"
              ? [obj.docUrl]
              : obj?.docUrl
            : [];
          return obj;
        });
      }
    }

    await ClaimCase.findByIdAndUpdate(cCase?._id, {
      $set: { documents: documents },
    });
  }
};

const addPostQaName = async () => {
  const dashboardData = await DashboardData.find({}).lean();

  for (let data of dashboardData) {
    const claimCase = await ClaimCase.findOne({ dashboardDataId: data?._id });
    if (claimCase && claimCase.qaBy) {
      const qa = await User.findOne({ name: claimCase.qaBy });
      if (qa) {
        await DashboardData.findByIdAndUpdate(data?._id, {
          $set: { postQa: qa?._id },
        });
      }
    }
  }
};

const updateDashboardData = async () => {
  // TODO: Run this function on prod deployment
  const dashboardData = await DashboardData.find({}).lean();

  for (const data of dashboardData) {
    await DashboardData.findByIdAndUpdate(data?._id, {
      $set: {
        // dateOfOS: data?.dateOfOS || null,
        // dateOfClosure: data?.dateOfClosure || null,
        intimationDate: !!data?.intimationDate
          ? dayjs(data?.intimationDate)
              .tz("Asia/Kolkata")
              .format("DD-MMM-YYYY hh:mm:ss A")
          : dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
      },
    });
  }
};

const updateStage = async () => {
  // TODO: Run this function on prod deployment
  const dashboardData = await DashboardData.find({}).lean();

  enum OldStage {
    PENDING_FOR_PRE_QC = 1,
    PENDING_FOR_ALLOCATION = 3,
    IN_FIELD_FRESH = 4,
    POST_QC = 5,
    IN_FIELD_REINVESTIGATION = 7,
    CLOSED = 12,
    REJECTED = 13,
    INVESTIGATION_ACCEPTED = 14,
    INVESTIGATION_SKIPPED = 15,
    IN_FIELD_REWORK = 16,
  }

  const getUpdatedStage = (stage: OldStage) => {
    switch (stage) {
      case OldStage.PENDING_FOR_PRE_QC:
        return NumericStage.PENDING_FOR_PRE_QC;
      case OldStage.PENDING_FOR_ALLOCATION:
        return NumericStage.PENDING_FOR_ALLOCATION;
      case OldStage.IN_FIELD_FRESH:
        return NumericStage.IN_FIELD_FRESH;
      case OldStage.POST_QC:
        return NumericStage.POST_QC;
      case OldStage.IN_FIELD_REWORK:
        return NumericStage.IN_FIELD_REWORK;
      case OldStage.IN_FIELD_REINVESTIGATION:
        return NumericStage.IN_FIELD_REINVESTIGATION;
      case OldStage.CLOSED:
        return NumericStage.CLOSED;
      case OldStage.REJECTED:
        return NumericStage.REJECTED;
      case OldStage.INVESTIGATION_ACCEPTED:
        return NumericStage.INVESTIGATION_ACCEPTED;
      case OldStage.IN_FIELD_REWORK:
        return NumericStage.IN_FIELD_REWORK;
      case OldStage.INVESTIGATION_SKIPPED:
        return NumericStage.INVESTIGATION_SKIPPED_AND_COMPLETING;
    }
  };

  for (const data of dashboardData) {
    await DashboardData.findByIdAndUpdate(data?._id, {
      $set: {
        stage: getUpdatedStage(data?.stage),
      },
    });
  }
};

const gettingGeographies = async () => {
  const pinCodes = await NewPinCodeMaster.aggregate([
    {
      $lookup: {
        from: "zonestatemasters",
        localField: "STATE_CODE",
        foreignField: "State_code",
        as: "state",
      },
    },
    {
      $lookup: {
        from: "newcitymasters",
        localField: "CITY_CODE",
        foreignField: "City_code",
        as: "city",
      },
    },
    {
      $limit: 10,
    },
  ]);

  const districts = await NewStateDistrictMaster.aggregate([
    {
      $lookup: {
        from: "zonestatemasters",
        localField: "State_code",
        foreignField: "State_code",
        as: "state",
      },
    },
    {
      $limit: 10,
    },
  ]);

  const states = await ZoneStateMaster.aggregate([
    {
      $lookup: {
        from: "zonemasters",
        localField: "zoneId",
        foreignField: "zoneId",
        as: "zone",
      },
    },
    {
      $unwind: { path: "$zone", preserveNullAndEmptyArrays: true },
    },
  ]);

  const zones = await ZoneMaster.find({});
};

const addTLAndClusterManager = async () => {
  // TODO: Run this function on prod deployment
  const data: IDashboardData[] = await DashboardData.find({}).lean();
  const teamLeads: IUser[] = await User.find({ role: Role.TL }).lean();

  const clusterManagers: IUser[] = await User.find({
    role: Role.CLUSTER_MANAGER,
  }).lean();
  const zonalStates: IZoneStateMaster[] = await ZoneStateMaster.find({}).lean();

  for (const el of data) {
    // if (!el?.teamLead || !el?.clusterManager) {
      const foundTL = teamLeads?.find((tl) => {
        if (!tl?.state || tl?.state?.includes("All") || tl?.state?.length < 1) {
          if (tl?.zone?.length < 1) return false;
          let returnType = false;
          for (const tlz of tl?.zone) {
            const found = zonalStates?.find(
              (state) =>
                state?.Zone === tlz &&
                state?.State === el?.hospitalDetails?.providerState
            );
            if (found) returnType = true;
          }
          return returnType;
        } else return tl?.state?.includes(el?.hospitalDetails?.providerState);
      });

      const foundCM = clusterManagers?.find((cm) => {
        if (!cm?.state || cm?.state?.includes("All") || cm?.state?.length < 1) {
          if (cm?.zone?.length < 1) return false;
          let returnType = false;
          for (const cmz of cm?.zone) {
            const found = zonalStates?.find(
              (state) =>
                state?.Zone === cmz &&
                state?.State === el?.hospitalDetails?.providerState
            );
            if (found) returnType = true;
          }
          return returnType;
        } else return cm?.state?.includes(el?.hospitalDetails?.providerState);
      });

      await DashboardData.findByIdAndUpdate(el?._id, {
        $set: {
          teamLead: foundTL ? foundTL?._id : el?.teamLead,
          clusterManager: foundCM ? foundCM?._id : el?.clusterManager,
        },
      });
    // }
  }
};

const addDateOfFallingIntoAllocationBucket = async () => {
  const data: IDashboardData[] = await DashboardData.find({}).lean();

  for (const el of data) {
    const event = await CaseEvent.findOne({
      claimId: el?.claimId,
      eventName: {
        $in: [
          EventNames.INVESTIGATION_REJECTED,
          EventNames.INVESTIGATION_SKIPPED_AND_RE_ASSIGNING,
          EventNames.MOVE_TO_ALLOCATION_BUCKET,
        ],
      },
    });

    if (event) {
      await DashboardData.findByIdAndUpdate(el?._id, {
        $set: { dateOfFallingIntoAllocationBucket: event?.createdAt },
      });
    }
  }
};

router.post(async (req) => {
  const {} = await req?.json();

  try {
    await connectDB(Databases.FNI);
    addTLAndClusterManager();
    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: { date: dayjs().format("hh:mm:ss") },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        data: null,
      },
      { status: error?.statusCode || 500 }
    );
  }
});

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx) as Promise<void>;
}
