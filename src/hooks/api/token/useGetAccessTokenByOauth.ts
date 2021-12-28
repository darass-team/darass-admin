import { QUERY } from "@/constants";
import { AlertError } from "@/utils/alertError";
import { axiosBearerOption } from "@/utils/customAxios";
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
    axiosBearerOption.clear();
    axiosBearerOption.setAccessToken(accessToken);

    setLocalStorage("refreshToken", refreshToken);

    return accessToken;
  } catch (error) {
    axiosBearerOption.clear();
    if (!axios.isAxiosError(error)) {
      throw new AlertError("알 수 없는 에러입니다.");
    }

    throw new AlertError("로그아웃에 실패하였습니다.");
  }
};

interface Props extends GetAccessTokenByOauthProps {}

export const useGetAccessTokenByOauth = (props: Props) => {
  const { data, error, refetch } = useQuery<string>({
    query: () => getAccessTokenByOauth(props),
    enabled: false
  });

  return {
    accessToken: data,
    error,
    refetch
  };
};
