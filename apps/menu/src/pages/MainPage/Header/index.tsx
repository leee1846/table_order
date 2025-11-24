import { MenuIcon } from '@repo/ui/icons';
import { useTheme } from '@emotion/react';
import * as S from '@/pages/MainPage/Header/header.style';

export const Header = () => {
  const theme = useTheme();

  return (
    <S.Header>
      <div>
        <button type="button">
          <span>logo버튼</span>
        </button>
        <span />
        <p>shop 이름영역</p>
        <p>브레이크타임 or 영업마감 라스트오더 문구 노출 영역(... 처리)</p>
      </div>

      <div>
        <p>??번 테이블</p>
        <span />
        <button type="button">
          <MenuIcon width={24} height={24} color={theme.mode.primary[500]} />
          주문내역
        </button>
      </div>
    </S.Header>
  );
};
