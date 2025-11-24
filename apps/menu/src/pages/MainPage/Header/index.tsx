import { MenuIcon } from '@repo/ui/icons';
import { useTheme } from '@emotion/react';
import * as S from '@/pages/MainPage/Header/header.style';

export const Header = () => {
  const theme = useTheme();

  return (
    <S.Header>
      <S.LeftContent>
        <button type="button">
          <span>logo버튼 영역</span>
        </button>
        <S.Divider />
        <S.ShopName>shop 이름영역</S.ShopName>
        <S.Description>
          브레이크타임 or 영업마감 라스트오더 문구 노출 영역(... 처리)
        </S.Description>
      </S.LeftContent>

      <S.RightContent>
        <S.TableNumber>??번 테이블</S.TableNumber>
        <S.Divider />
        <S.OrderHistoryButton type="button">
          <MenuIcon width={20} height={20} color={theme.mode.primary[500]} />
          주문내역
        </S.OrderHistoryButton>
      </S.RightContent>
    </S.Header>
  );
};
