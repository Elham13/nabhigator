import { SetStateAction, Dispatch } from "react";
import axios from "axios";
import {
  DistResponse,
  IDType,
  ILoadings,
  INewCityMaster,
  INewPinCodeMaster,
  IZoneStateMaster,
  ResponseType,
} from "../utils/types/fniDataTypes";
import { EndPoints } from "../utils/types/enums";
import { buildUrl, showError } from ".";

interface IGetStateDistricts {
  returnType: "states" | "districts";
  stateSearchValue?: string | null;
  distSearchValue?: string | null;
  stateValue?: string[];
  limit?: number;
  setStateOptions?: Dispatch<SetStateAction<IDType[]>>;
  setLoadings: Dispatch<SetStateAction<ILoadings>>;
  setDistrictOptions?: Dispatch<SetStateAction<DistResponse[]>>;
}

interface IGetState {
  stateName?: string | string[];
  stateCode?: string | string[];
  zoneId?: string | string[];
  limit?: number;
  getOptions: (options: IZoneStateMaster[]) => void;
  getLoading: (status: boolean) => void;
}

interface IGetDistricts {
  stateCode?: string | string[];
  districtName?: string;
  limit?: number;
  getOptions: (options: IDType[]) => void;
  getLoading: (status: boolean) => void;
}

export const getStatesOrDistricts = async ({
  returnType,
  stateSearchValue,
  distSearchValue,
  stateValue,
  limit,
  setLoadings,
  setStateOptions,
  setDistrictOptions,
}: IGetStateDistricts) => {
  setLoadings((prev) => ({
    ...prev,
    state: returnType === "states",
    district: returnType === "districts",
  }));
  try {
    if (returnType === "states") {
      const { data } = await axios.get<ResponseType<IDType>>(
        buildUrl(EndPoints.GET_DISTRICTS, {
          limit: limit || 10,
          stateSearchValue,
          returnType,
        })
      );
      setStateOptions && setStateOptions(data?.data);
    } else if (returnType === "districts") {
      const { data } = await axios.get<ResponseType<DistResponse>>(
        buildUrl(EndPoints.GET_DISTRICTS, {
          limit: limit || 50,
          returnType: "districts",
          districtSearchValue: distSearchValue,
          stateSearchValue:
            stateValue && stateValue?.length > 0 ? stateValue : null,
        })
      );
      setDistrictOptions && setDistrictOptions(data?.data);
    }
  } catch (error: any) {
    showError(error);
  } finally {
    setLoadings((prev) => ({ ...prev, state: false, district: false }));
  }
};

export const getStates = async ({
  stateName,
  stateCode,
  zoneId,
  limit,
  getOptions,
  getLoading,
}: IGetState) => {
  try {
    getLoading(true);
    const payload: Record<string, any> = {};

    if (limit) payload["limit"] = limit;
    if (zoneId) payload["zoneId"] = zoneId;
    if (stateCode) payload["stateCode"] = stateCode;
    if (stateName) payload["stateName"] = stateName;

    const { data } = await axios.post<ResponseType<IZoneStateMaster>>(
      EndPoints.ZONE_STATE_MASTER,
      payload
    );

    getOptions(data?.data);
  } catch (error: any) {
    showError(error);
  } finally {
    getLoading(false);
  }
};

export const getDistricts = async ({
  stateCode,
  districtName,
  limit,
  getOptions,
  getLoading,
}: IGetDistricts) => {
  try {
    getLoading(true);
    const payload: Record<string, any> = {};

    if (limit) payload["limit"] = limit;
    if (stateCode) payload["stateCode"] = stateCode;
    if (districtName) payload["districtName"] = districtName;

    const { data } = await axios.post<ResponseType<IDType>>(
      EndPoints.GET_DISTRICTS,
      payload
    );

    getOptions(data?.data);
  } catch (error: any) {
    showError(error);
  } finally {
    getLoading(false);
  }
};

interface IGetCities {
  cityName?: string;
  stateCode?: string | string[];
  limit?: number;
  getOptions: (options: INewCityMaster[]) => void;
  getLoading: (status: boolean) => void;
}

export const getCities = async ({
  cityName,
  stateCode,
  limit,
  getOptions,
  getLoading,
}: IGetCities) => {
  getLoading(true);
  try {
    const payload: Record<string, any> = {};

    if (limit) payload["limit"] = limit;
    if (stateCode) payload["stateCode"] = stateCode;
    if (cityName) payload["cityName"] = cityName;

    const { data } = await axios.post<ResponseType<INewCityMaster>>(
      EndPoints.NEW_CITY_MASTER,
      payload
    );

    getOptions(data?.data);
  } catch (error) {
    showError(error);
  } finally {
    getLoading(false);
  }
};

interface IGetPinCodes {
  cityCode?: string[] | string;
  limit?: number;
  getOptions: (options: INewPinCodeMaster[]) => void;
  getLoading: (status: boolean) => void;
}

export const getPinCodes = async ({
  cityCode,
  limit,
  getLoading,
  getOptions,
}: IGetPinCodes) => {
  getLoading(true);

  try {
    const payload: Record<string, any> = {};

    if (limit) payload["limit"] = limit;
    if (cityCode) payload["cityCode"] = cityCode;

    const { data } = await axios.post<ResponseType<INewPinCodeMaster>>(
      EndPoints.NEW_PIN_CODE_MASTER,
      payload
    );
    getOptions(data?.data);
  } catch (error) {
    showError(error);
  } finally {
    getLoading(false);
  }
};
