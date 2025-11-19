import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';

export const Account = () => {
  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UIStyles.setting.Title>유저의 계정???</UIStyles.setting.Title>
          <BasicButton variant="Outline_Grey_M" onClick={() => {}}>
            로그아웃
          </BasicButton>
        </S.TitleContainer>
        <S.SID>
          SID <span>?????</span>
        </S.SID>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <p>매장 이름???</p>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
