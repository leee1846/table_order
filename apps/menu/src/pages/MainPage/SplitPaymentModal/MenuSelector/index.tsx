import { CheckButton } from '@repo/ui/components';
import * as S from '@/pages/MainPage/SplitPaymentModal/MenuSelector/menuSelector.style';
import { css } from '@emotion/react';

export const MenuSelector = () => {
  const menuList = Array.from({ length: 4 }, (_, index) => `menu-${index + 1}`);

  return (
    <S.Container>
      <S.SelectedMenuContainer>
        <p>선택한 메뉴</p>
        <p>
          <span>2??개</span>/3??개
        </p>
      </S.SelectedMenuContainer>

      <S.MenuList>
        {menuList.map((_, index) => (
          <S.MenuItem key={`menu-${index + 1}`} isSelected={true}>
            <button type="button">
              <CheckButton
                checked={false}
                customStyle={css`
                  & > div {
                    width: 28px;
                    height: 28px;
                  }
                `}
              >
                <S.MenuName>메뉴 이름???????????</S.MenuName>
              </CheckButton>
              <S.ButtonRightContainer>
                <p>10000??원</p>
                <div>옵션</div>
              </S.ButtonRightContainer>
            </button>
          </S.MenuItem>
        ))}
      </S.MenuList>

      <S.TotalContainer>
        <S.TotalInfo>
          <p>총 결제금액</p>
          <p>10000??원</p>
        </S.TotalInfo>
        <S.RemainingAmount>
          <p>남은 결제 금액</p>
          <p>10000??원</p>
        </S.RemainingAmount>
      </S.TotalContainer>
    </S.Container>
  );
};
