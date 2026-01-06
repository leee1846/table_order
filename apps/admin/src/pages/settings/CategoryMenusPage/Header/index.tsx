import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoryMenusPage/Header/header.style';

interface Props {
  onClickAddMenu: () => void;
  categoryName?: string;
}

export const Header = ({ onClickAddMenu, categoryName }: Props) => {
  return (
    <S.Header>
      <S.TextContainer>
        <h1>{t('메뉴 관리')}</h1>
        <div />
        {categoryName && <h2>{categoryName}</h2>}
      </S.TextContainer>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={onClickAddMenu}
        icon={<AddIcon color={theme.colors.white} />}
      >
        {t('메뉴 추가하기')}
      </BasicButton>
    </S.Header>
  );
};
