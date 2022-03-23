import { AxiosResponse } from "axios";
import { customAxios } from "./customAxios";
import { getLocalStorage } from "./localStorage";

const request = {
  get: async (query: string, headers?: AxiosResponse["headers"]) =>
    await customAxios.get(query, {
      headers: {
        Authorization: `Bearer ${getLocalStorage("accessToken")}`,
        ...headers
      },
      withCredentials: true
    }),
  post: async <T>(query: string, data: T, headers?: AxiosResponse["headers"]) =>
    await customAxios.post(query, data, {
      headers: {
        Authorization: `Bearer ${getLocalStorage("accessToken")}`,
        ...headers
      },
      withCredentials: true
    }),
  patch: async <T>(query: string, data: T, headers?: AxiosResponse["headers"]) =>
    await customAxios.patch(query, data, {
      headers: {
        Authorization: `Bearer ${getLocalStorage("accessToken")}`,
        ...headers
      },
      withCredentials: true
    }),
  delete: async (query: string, headers?: AxiosResponse["headers"]) =>
    await customAxios.delete(query, {
      headers: {
        Authorization: `Bearer ${getLocalStorage("accessToken")}`,
        ...headers
      },
      withCredentials: true
    })
};

export { request };
