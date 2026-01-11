import { t } from '@/config/i18n';
import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoryMenusPage/Header/header.style';
import { toast } from '@repo/feature/utils';

interface Props {
  onClickAddMenu: () => void;
  categoryName?: string;
  isPosLinked: boolean;
}

export const Header = ({
  onClickAddMenu,
  categoryName,
  isPosLinked,
}: Props) => {
  const handleClick = () => {
    if (isPosLinked) {
      return;
    }
    onClickAddMenu();
  };

  return (
    <S.Header>
      <S.TextContainer>
        <h1>{t('메뉴 관리')}</h1>
        <div />
        {categoryName && <h2>{categoryName}</h2>}
      </S.TextContainer>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={handleClick}
        icon={<AddIcon color={theme.colors.white} />}
        disabled={isPosLinked}
      >
        {t('메뉴 추가하기')}
      </BasicButton>
    </S.Header>
  );
};
