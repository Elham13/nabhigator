import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { showError } from "../helpers";

type PropTypes<T> = {
  config: AxiosRequestConfig<any>;
  hideError?: boolean;
  trigger?: boolean;
  dependencyArr: any[];
  isMutation?: boolean;
  onDone?: (data: T, payload?: Record<string, any>) => void;
};

type ReturnType<T> = {
  loading: boolean;
  data?: T;
  error?: string;
  refetch: (payload?: Record<string, any>) => void;
};

export const useAxios = <T>({
  config,
  hideError,
  trigger = true,
  dependencyArr,
  isMutation = false,
  onDone,
}: PropTypes<T>): ReturnType<T> => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>("");

  const sendRequest = async (payload?: Record<string, any>) => {
    setLoading(true);

    if (!!payload) config.data = payload;

    try {
      const { data: res } = await axios(config);
      setError("");
      setData(res);
      !!onDone && onDone(res, config?.data);
    } catch (error: any) {
      if (!hideError) showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trigger && !isMutation) sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencyArr]);

  return { loading, data, error, refetch: sendRequest };
};
