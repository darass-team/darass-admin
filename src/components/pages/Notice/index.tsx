import ScreenContainer from "@/components/@style/ScreenContainer";

import { Container, Title, NoticeList, NoticeInfo } from "./styles";

const Notice = () => {
  return (
    <ScreenContainer>
      <Container>
        <Title>공지사항</Title>
        <NoticeList>
          <NoticeInfo
            title="사파리 유저 공지"
            description="사파리 유저는 
            사파리 환경설정 > 개인 정보 보호 탭에서 [크로스 사이트 추적 방지]의 
            체크해제가 필요합니다."
            onClick={() => {}}
          />
        </NoticeList>
      </Container>
    </ScreenContainer>
  );
};

export default Notice;
