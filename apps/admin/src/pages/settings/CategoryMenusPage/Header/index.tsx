import { BasicButton } from '@repo/ui/components';
import { AddIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as S from '@/pages/settings/CategoryMenusPage/Header/header.style';

interface Props {
  onClickAddMenu: () => void;
}

export const Header = ({ onClickAddMenu }: Props) => {
  const CATEGORY_NAME = '햄버거';

  return (
    <S.Header>
      <S.TextContainer>
        <h1>메뉴 관리</h1>
        <div />
        <h2>{CATEGORY_NAME}</h2>
      </S.TextContainer>
      <BasicButton
        variant="Solid_Navy_2XL"
        onClick={onClickAddMenu}
        icon={<AddIcon color={theme.colors.white} />}
      >
        메뉴 추가하기
      </BasicButton>
    </S.Header>
  );
};
