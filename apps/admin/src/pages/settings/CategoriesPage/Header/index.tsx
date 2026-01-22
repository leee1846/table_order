import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoriesPage/Header/header.style';

interface Props {
  onClickAddCategory: () => void;
  isPosLinked: boolean;
}
export const Header = ({ onClickAddCategory, isPosLinked }: Props) => {
  const handleClick = () => {
    if (isPosLinked) {
      return;
    }
    onClickAddCategory();
  };

  return (
    <S.Header>
      <S.TextContainer>
        <h1>{t('카테고리 관리')}</h1>
        <div />
        <h2>{t('카테고리 추가하기')}</h2>
      </S.TextContainer>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={handleClick}
        icon={<AddIcon color={theme.colors.white} />}
        disabled={isPosLinked}
      >
        {t('카테고리 추가')}
      </BasicButton>
    </S.Header>
  );
};
