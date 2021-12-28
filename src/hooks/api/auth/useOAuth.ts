import { getLocalStorage } from "@/utils/localStorage";
import { useGetAccessTokenByOauth } from "../token/useGetAccessTokenByOauth";
import { useGetAccessTokenByRefreshToken } from "../token/useGetAccessTokenByRefreshToken";

interface Props {
  oauthProviderName: string;
  authorizationCode: string;
}

export const useOAuth = ({ oauthProviderName, authorizationCode }: Props) => {
  const refreshToken = getLocalStorage("refreshToken");

  const { refetch: refetchAccessTokenByOauth } = useGetAccessTokenByOauth({
    oauthProviderName,
    authorizationCode
  });

  const {} = useGetAccessTokenByRefreshToken({ refreshToken });
};
