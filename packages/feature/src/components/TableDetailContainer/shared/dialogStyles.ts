import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

const { colors, zIndex } = theme;

/**
 * 공통 다이얼로그 컨테이너 스타일
 * 모든 다이얼로그에서 공통으로 사용되는 기본 스타일
 */
export const DialogContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 24px;
`;

/**
 * 공통 닫기 버튼 스타일
 * 모든 다이얼로그에서 공통으로 사용되는 닫기 버튼 스타일
 */
export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
  background: none;
  border: none;
  padding: 0;
`;

/**
 * 공통 헤더 스타일
 * 모든 다이얼로그에서 공통으로 사용되는 헤더 스타일
 */
export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
  margin-bottom: 40px;
`;

/**
 * 공통 타이틀 스타일
 * 모든 다이얼로그에서 공통으로 사용되는 타이틀 스타일
 */
export const Title = styled.h3`
  ${TYPOGRAPHY.MT_1}
  color: ${colors.grey[800]};
`;
