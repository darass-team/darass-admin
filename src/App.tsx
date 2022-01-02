import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Nav from "./components/organisms/Nav";
import About from "./components/pages/About";
import {
  LoadableHome,
  LoadableManage,
  LoadableMyProject,
  LoadableNewProject,
  LoadableNotification,
  LoadableProjectDetail,
  LoadableScriptPublishing,
  LoadableStatistics,
  LoadableUserProfile
} from "./components/pages/Loadable";
import Login from "./components/pages/Login";
import OAuth from "./components/pages/OAuth";
import { QUERY, ROUTE } from "./constants";
import { RecentlyAlarmContentContext } from "./context/recentlyAlarmContentContext";
import { UserContext } from "./context/userContext";
import { useRecentlyAlarmWebSocket, useUser } from "./hooks";
import { useDeleteAccessToken } from "./hooks/api/token/useDeleteAccessToken";
import { AlertError } from "./utils/alertError";
import { axiosBearerOption } from "./utils/customAxios";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "./utils/localStorage";
import { request } from "./utils/request";

const nonAuthorizedRoute = [
  { path: ROUTE.NON_AUTHORIZED.OAUTH, component: OAuth },
  { path: ROUTE.NON_AUTHORIZED.LOGIN, component: Login }
];

const authorizedRoute = [
  { path: ROUTE.AUTHORIZED.USER_PROFILE, component: LoadableUserProfile },
  { path: ROUTE.AUTHORIZED.NOTIFICATION, component: LoadableNotification },
  { path: ROUTE.AUTHORIZED.SCRIPT_PUBLISHING, component: LoadableScriptPublishing },
  { path: ROUTE.AUTHORIZED.NEW_PROJECT, component: LoadableNewProject },
  { path: ROUTE.AUTHORIZED.PROJECT_MANAGE, component: LoadableManage },
  { path: ROUTE.AUTHORIZED.STATISTICS, component: LoadableStatistics },
  { path: ROUTE.AUTHORIZED.PROJECT_DETAIL, component: LoadableProjectDetail },
  { path: ROUTE.AUTHORIZED.MY_PROJECT, component: LoadableMyProject }
];

const App = () => {
  const { user, refetchUser, isLoading, isSuccess, setUser, isFetched } = useUser();
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const isActiveAccessToken = !!getLocalStorage("active");

  const { deleteMutation } = useDeleteAccessToken({
    onSuccess: () => {
      setAccessToken(undefined);
      axiosBearerOption.clear();
    }
  });

  const { recentlyAlarmContent, hasNewAlarmOnRealTime, setHasNewAlarmOnRealTime } = useRecentlyAlarmWebSocket({ user });

  const getAccessTokenByRefreshToken = async (refreshToken: string) => {
    try {
      const response = await request.post(QUERY.LOGIN_REFRESH, { refreshToken });

      const { accessToken } = response.data;
      axiosBearerOption.clear();
      axiosBearerOption.setAccessToken(accessToken);

      return accessToken;
    } catch (error) {
      axiosBearerOption.clear();
      if (!axios.isAxiosError(error)) {
        logout();
        throw new AlertError("알 수 없는 에러입니다.");
      }

      throw new Error("액세스 토큰 재발급에 실패하셨습니다.");
    }
  };

  const refetchAccessToken = async () => {
    const refreshToken = getLocalStorage("refreshToken");
    const accessToken = await getAccessTokenByRefreshToken(refreshToken);

    setAccessToken(accessToken);

    await refetchUser();
  };

  const removeAccessToken = () => {
    deleteMutation();
    removeLocalStorage("active");
    removeLocalStorage("refreshToken");
  };

  const logout = () => {
    removeAccessToken();
    setUser(undefined);
  };

  useEffect(() => {
    if (isActiveAccessToken) refetchAccessToken();
  }, [isActiveAccessToken]);

  useEffect(() => {
    LoadableHome.preload();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        refetchUser,
        refetchAccessToken,
        accessToken,
        isLoadingUserRequest: isLoading,
        isSuccessUserRequest: isSuccess,
        setUser,
        isActiveAccessToken,
        isUserFetched: isFetched
      }}
    >
      <RecentlyAlarmContentContext.Provider
        value={{ recentlyAlarmContent, hasNewAlarmOnRealTime, setHasNewAlarmOnRealTime }}
      >
        <Nav />
        <Switch>
          <Route exact path={ROUTE.COMMON.HOME} component={LoadableHome} />
          <Route exact path={ROUTE.COMMON.ABOUT} component={About} />
          {isActiveAccessToken &&
            authorizedRoute.map(({ path, component }) => {
              return <Route exact key={path} path={path} component={component} />;
            })}
          {!isActiveAccessToken &&
            nonAuthorizedRoute.map(({ path, component }) => {
              return <Route exact key={path} path={path} component={component} />;
            })}
          <Redirect to={isActiveAccessToken ? ROUTE.AUTHORIZED.MY_PROJECT : ROUTE.COMMON.HOME} />
        </Switch>
      </RecentlyAlarmContentContext.Provider>
    </UserContext.Provider>
  );
};
export default App;
