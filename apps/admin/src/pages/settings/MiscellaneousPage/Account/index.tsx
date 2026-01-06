// import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import * as UIStyles from '@repo/ui/styles';
import * as S from '@/pages/settings/MiscellaneousPage/Account/account.style';
import { theme } from '@repo/ui';
import { UserIcon } from '@repo/ui/icons';
import { useAdminTranslation } from '@/config/i18n';

interface AccountProps {
  shopName?: string;
  shopCode?: string;
  userId?: string;
}
export const Account = ({ shopName, shopCode, userId }: AccountProps) => {
  const { t } = useAdminTranslation();
  return (
    <UIStyles.setting.Container>
      <UIStyles.setting.Header>
        <S.TitleContainer>
          <UserIcon width={32} height={32} color={theme.colors.primary[500]} />
          <UIStyles.setting.Title>{t('계정')}</UIStyles.setting.Title>
        </S.TitleContainer>
      </UIStyles.setting.Header>

      <UIStyles.setting.ContentsLayout>
        <UIStyles.setting.ContentLayout>
          <S.Content>
            <S.ShopName>{shopName}</S.ShopName>
            <S.UserId>{userId}</S.UserId>
            <S.SID>
              {/* SID =  shopCode*/}
              <span>SID</span>
              <span>{shopCode}</span>
            </S.SID>
          </S.Content>

          <BasicButton variant="Outline_Grey_M" onClick={() => {}}>
            {t('로그아웃')}
          </BasicButton>
        </UIStyles.setting.ContentLayout>
      </UIStyles.setting.ContentsLayout>
    </UIStyles.setting.Container>
  );
};
