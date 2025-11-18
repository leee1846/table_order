import { BasicButton, ChipButton } from '@repo/ui/components';
import * as CommonStyles from '@/pages/settings/MiscellaneousPage/common/common.style';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';

export const Account = () => {
  return (
    <CommonStyles.Container>
      <CommonStyles.Header>
        <S.TitleContainer>
          <CommonStyles.Title>유저의 계정???</CommonStyles.Title>
          <BasicButton variant="Outline_Grey_M" onClick={() => {}}>
            로그아웃
          </BasicButton>
        </S.TitleContainer>
        <S.SID>
          SID <span>?????</span>
        </S.SID>
      </CommonStyles.Header>

      <CommonStyles.ContentsLayout>
        <CommonStyles.ContentLayout>
          <p>매장 이름???</p>
          <S.Content>
            <ChipButton variant="white" size="M">
              온라인 포스 모드 사용중??
            </ChipButton>
            <ChipButton variant="darkgrey" size="M">
              리셋
            </ChipButton>
          </S.Content>
        </CommonStyles.ContentLayout>
      </CommonStyles.ContentsLayout>
    </CommonStyles.Container>
  );
};
