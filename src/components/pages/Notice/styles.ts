import ProjectButton from "@/components/atoms/Buttons/ProjectButton";
import { LINE_HEIGHT_SCALE } from "@/constants/styles/constants";
import { PALETTE } from "@/constants/styles/palette";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 3rem;
  line-height: ${3 * LINE_HEIGHT_SCALE}rem;
  color: ${PALETTE.BLACK_700};
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
`;

export const NoticeList = styled.div``;

export const NoticeInfo = styled(ProjectButton)``;
