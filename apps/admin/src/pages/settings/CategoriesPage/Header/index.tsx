import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/Header/header.style';

interface Props {
  onClickAddCategory: () => void;
}
export const Header = ({ onClickAddCategory }: Props) => {
  return (
    <S.Header>
      <S.TextContainer>
        <h1>{t('카테고리 관리')}</h1>
        <div />
        <h2>{t('카테고리 추가하기')}</h2>
      </S.TextContainer>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={onClickAddCategory}
        icon={<AddIcon color={theme.colors.white} />}
      >
        {t('카테고리 추가')}
      </BasicButton>
    </S.Header>
  );
};
