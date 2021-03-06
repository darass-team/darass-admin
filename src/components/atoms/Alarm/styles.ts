import { ShakeCSS } from "@/constants/styles/css";
import { PALETTE } from "@/constants/styles/palette";
import styled from "styled-components";
import { Size } from ".";

const alarmSizeBySize = {
  SM: 20,
  MD: 30,
  LG: 40
};

export const Container = styled.div<{ size: Size }>`
  padding-top: 0.2rem;
  cursor: pointer;
  position: relative;
  width: fit-content;

  & > img {
    width: ${props => `${alarmSizeBySize[props.size]}px`};
    height: ${props => `${alarmSizeBySize[props.size]}px`};
  }

  & > span {
    width: ${props => `${alarmSizeBySize[props.size] * 0.5}px`};
    height: ${props => `${alarmSizeBySize[props.size] * 0.5}px`};
  }
`;

export const Img = styled.img<{ hasUnReadNotification: boolean; isImageLoaded: boolean }>`
  opacity: ${({ isImageLoaded }) => (isImageLoaded ? 1 : 0)};
  object-fit: contain;
  ${({ hasUnReadNotification }) => hasUnReadNotification && ShakeCSS};
`;

export const Dot = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${PALETTE.RED_500};
  border-radius: 50%;
  color: ${PALETTE.WHITE};
  text-align: center;
`;
