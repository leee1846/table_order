import { BasicButton } from '@repo/ui/components';
import { Theme } from '@/pages/settings/StartScreenPage/Theme';
import { Logo } from '@/pages/settings/StartScreenPage/Logo';
import { ImageRegistration } from '@/pages/settings/StartScreenPage/ImageRegistration';
import { OrderCompletionPage } from '@/pages/settings/StartScreenPage/OrderCompletionPage';
import * as S from './startScreenPage.style';
import * as UIStyles from '@repo/ui/styles';

export const StartScreenPage = () => {
  return (
    <UIStyles.setting.TablePageContainer>
      <S.Container>
        <S.Header>
          <S.Title>
            <h1>테마 설정</h1>
            <div />
            <span>시작 화면</span>
          </S.Title>
          <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
            저장하기
          </BasicButton>
        </S.Header>
        <Theme />
        <Logo />
        <ImageRegistration />
        <OrderCompletionPage />
      </S.Container>
    </UIStyles.setting.TablePageContainer>
  );
};
