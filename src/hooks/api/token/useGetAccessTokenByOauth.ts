import { QUERY } from "@/constants";
import { AlertError } from "@/utils/alertError";
import { setLocalStorage } from "@/utils/localStorage";
import { request } from "@/utils/request";
import axios from "axios";
import { useQuery } from "simple-react-query";

interface GetAccessTokenByOauthProps {
  oauthProviderName: string;
  authorizationCode: string;
}

export const getAccessTokenByOauth = async (props: GetAccessTokenByOauthProps) => {
  try {
    const response = await request.post(QUERY.LOGIN, { ...props });
    const { accessToken, refreshToken } = response.data;

    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new AlertError("알 수 없는 에러입니다.");
    }

    throw new AlertError("로그아웃에 실패하였습니다.");
  }
};

export const useGetAccessTokenByOauth = () => {
  const { data, error } = useQuery<{
    accessToken: string;
    refreshToken: string;
  }>({
    query: getAccessTokenByOauth,
    enabled: false
  });

  const { accessToken, refreshToken } = data;

  setLocalStorage("accessToken", accessToken);
  setLocalStorage("refreshToken", refreshToken);

  return {
    data,
    error
  };
};
