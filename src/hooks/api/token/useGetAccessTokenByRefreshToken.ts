import { QUERY } from "@/constants";
import { TOKEN_REFETCH_TIMER } from "@/constants/timer";
import { AlertError } from "@/utils/alertError";
import { axiosBearerOption } from "@/utils/customAxios";
import { request } from "@/utils/request";
import axios from "axios";
import { useQuery } from "simple-react-query";

export const getAccessTokenByRefreshToken = async () => {
  try {
    const response = await request.post(QUERY.LOGIN_REFRESH, {});
    const { accessToken } = response.data;
    axiosBearerOption.clear();
    axiosBearerOption.setAccessToken(accessToken);

    return accessToken;
  } catch (error) {
    axiosBearerOption.clear();
    if (!axios.isAxiosError(error)) {
      throw new AlertError("알 수 없는 에러입니다.");
    }

    throw new Error("액세스 토큰 재발급에 실패하셨습니다.");
  }
};

export const useGetAccessTokenByRefreshToken = () => {
  const {
    data: accessToken,
    refetch: refetchAccessToken,
    error: accessTokenError,
    setData: setAccessToken,
    clearRefetchInterval
  } = useQuery<string | undefined>({
    query: getAccessTokenByRefreshToken,
    enabled: false,
    refetchInterval: TOKEN_REFETCH_TIMER
  });

  return {
    accessToken,
    refetchAccessToken,
    accessTokenError,
    setAccessToken,
    clearRefetchInterval
  };
};
