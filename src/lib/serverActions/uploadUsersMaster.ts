"use server";

import * as xlsx from "xlsx";
import { IUser } from "../utils/types/fniDataTypes";
import UsersMaster from "../Models/usersMaster";

const uploadUsersMaster = async (data: FormData) => {
  try {
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      throw new Error("No file found");
    }

    const bytes = await file.arrayBuffer();
    const workbook = xlsx.read(bytes);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: IUser[] = xlsx.utils.sheet_to_json(sheet, {
      blankrows: false,
    });

    if (!jsonData || jsonData?.length === 0)
      throw new Error("Please select a file which contains records");

    await UsersMaster.insertMany(jsonData);

    return { success: true };
  } catch (error: any) {
    throw new Error(error);
  }
};

export default uploadUsersMaster;
