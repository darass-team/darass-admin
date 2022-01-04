import { QUERY } from "@/constants";
import { AlertError } from "@/utils/alertError";
import { request } from "@/utils/request";
import axios from "axios";
import { useMutation } from "simple-react-query";

export const deleteRefreshToken = async () => {
  try {
    const response = await request.delete(QUERY.LOGOUT);

    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new AlertError("알 수 없는 에러입니다.");
    }

    throw new AlertError("로그아웃에 실패하였습니다.");
  }
};

interface Props {
  onSuccess: () => void;
}

export const useDeleteAccessToken = ({ onSuccess }: Props) => {
  const { mutation: deleteMutation } = useMutation<void, void>({
    query: deleteRefreshToken,
    onSuccess
  });

  return { deleteMutation };
};
