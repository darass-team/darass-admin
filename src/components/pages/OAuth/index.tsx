import { QUERY, ROUTE } from "@/constants";
import { useUserContext } from "@/hooks/context/useUserContext";
import { axiosBearerOption } from "@/utils/customAxios";
import { setLocalStorage } from "@/utils/localStorage";
import { request } from "@/utils/request";
import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import LoadingPage from "../LoadingPage";

const OAuth = () => {
  const location = useLocation();
  const history = useHistory();
  const { provider } = useParams<{ provider: string }>();
  const urlSearchParams = new URLSearchParams(location.search);
  const code = urlSearchParams.get("code");
  const { refetchUser, user } = useUserContext();

  useEffect(() => {
    if (!code) {
      history.replace(ROUTE.NON_AUTHORIZED.LOGIN);
    }

    const setAccessTokenAsync = async () => {
      try {
        const response = await request.post(QUERY.LOGIN, {
          oauthProviderName: provider,
          authorizationCode: code
        });

        const { accessToken, refreshToken } = response.data;

        axiosBearerOption.clear();
        axiosBearerOption.setAccessToken(accessToken);

        setLocalStorage("refreshToken", refreshToken);
        setLocalStorage("active", true);

        refetchUser();
      } catch (error) {
        console.error(error);
      }
    };

    setAccessTokenAsync();
  }, [code]);

  useEffect(() => {
    if (!user) return;

    history.replace(ROUTE.AUTHORIZED.MY_PROJECT);
  }, [user]);

  return <LoadingPage />;
};

export default OAuth;
