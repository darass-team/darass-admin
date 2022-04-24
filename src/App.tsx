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
import Notice from "./components/pages/Notice";
import OAuth from "./components/pages/OAuth";
import { QUERY, ROUTE } from "./constants";
import { RecentlyAlarmContentContext } from "./context/recentlyAlarmContentContext";
import { UserContext } from "./context/userContext";
import { useRecentlyAlarmWebSocket, useUser } from "./hooks";
import { useDeleteAccessToken } from "./hooks/api/token/useDeleteAccessToken";
import { AlertError } from "./utils/alertError";
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
  const { user, refetchUser, isLoading, isSuccess, setUser, isFetched, error } = useUser();
  const [accessToken, setAccessToken] = useState<string | undefined>(() => getLocalStorage("active"));

  const { deleteMutation, deleteError } = useDeleteAccessToken({
    onSuccess: () => {
      setAccessToken(undefined);
      removeLocalStorage("active");
      removeLocalStorage("refreshToken");
      removeLocalStorage("accessToken");
    }
  });

  const { recentlyAlarmContent, hasNewAlarmOnRealTime, setHasNewAlarmOnRealTime } = useRecentlyAlarmWebSocket({ user });

  const getAccessTokenByRefreshToken = async (refreshToken: string) => {
    try {
      const response = await request.post(QUERY.LOGIN_REFRESH, { refreshToken });

      const { accessToken } = response.data;
      setLocalStorage("accessToken", accessToken);

      return accessToken;
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw new AlertError("알 수 없는 에러입니다.");
      }

      if (error.response?.data.code === 801) {
        refetchAccessToken();
      }

      if (error.response?.data.code === 808) {
        refetchAccessToken();
      }

      if (error.response?.data.code === 806) {
        logout();
      }

      if (error.response?.data.code === 809) {
        logout();
      }

      if (error.response?.data.code === 807) {
        logout();
      }
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
  };

  const logout = () => {
    removeAccessToken();
    setUser(undefined);
  };

  useEffect(() => {
    if (!getLocalStorage("accessToken")) {
      logout();
    }
  }, []);

  useEffect(() => {
    if (accessToken) refetchUser();
  }, [accessToken]);

  useEffect(() => {
    if (error) {
      if (error.name === "expiredAccessToken") {
        refetchAccessToken();
      } else {
        logout();
      }
    }
  }, [error]);

  useEffect(() => {
    LoadableHome.preload();
  }, []);

  useEffect(() => {
    if (!deleteError) return;

    setAccessToken(undefined);
    removeLocalStorage("active");
    removeLocalStorage("refreshToken");
    removeLocalStorage("accessToken");
    setUser(undefined);
  }, [deleteError]);

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
        isActiveAccessToken: !!accessToken,
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
          <Route exact path={ROUTE.COMMON.NOTICE} component={Notice} />
          {!!accessToken
            ? authorizedRoute.map(({ path, component }) => {
                return <Route exact key={path} path={path} component={component} />;
              })
            : nonAuthorizedRoute.map(({ path, component }) => {
                return <Route exact key={path} path={path} component={component} />;
              })}

          <Redirect to={!!accessToken ? ROUTE.AUTHORIZED.MY_PROJECT : ROUTE.COMMON.HOME} />
        </Switch>
      </RecentlyAlarmContentContext.Provider>
    </UserContext.Provider>
  );
};
export default App;
