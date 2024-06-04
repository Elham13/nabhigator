"use server";

import * as xlsx from "xlsx";
import DashboardData from "../Models/dashboardData";
import getFniData from "../helpers/getFniData";

interface IDataType {
  ClaimNo: number;
  ClaimType: "P" | "R";
}

const uploadDashboardData = async (data: FormData) => {
  try {
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      throw new Error("No file found");
    }

    const bytes = await file.arrayBuffer();
    const workbook = xlsx.read(bytes);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: IDataType[] = xlsx.utils.sheet_to_json(sheet, {
      blankrows: false,
    });

    if (!jsonData || jsonData?.length === 0)
      throw new Error("Please select a file which contains records");

    let inserted = 0;
    let skipped = 0;

    for (let obj of jsonData) {
      const claimId = obj.ClaimNo?.toString();
      const claimType = obj.ClaimType;

      const found = await DashboardData.findOne({
        claimId,
        claimType,
      });

      if (!found) {
        const res = await getFniData(claimId, claimType);

        if (res?.success) {
          await DashboardData.create({
            claimId,
            claimType,
            ...res?.data,
          });
          inserted += 1;
        } else skipped += 1;
      } else skipped += 1;
    }

    return { success: true };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default uploadDashboardData;
