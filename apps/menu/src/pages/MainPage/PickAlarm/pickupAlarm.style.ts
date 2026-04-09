import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
`;

/** 스크롤 뷰포트: 긴 설명이 닫기 버튼에 가리지 않도록 위쪽만 스크롤 */
export const ScrollViewport = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

/**
 * 짧을 때는 세로 중앙 정렬, 길 때는 min-height로 뷰포트를 채운 뒤 내용이 늘어나면 스크롤
 */
export const ScrollInner = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 24px 16px 16px;
`;

export const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding: 0 16px 50px;
`;

export const Image = styled.img`
  width: 14rem;
  height: 14.0625rem;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  font-size: 4.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 5.625rem; /* 125% */
  letter-spacing: -0.1125rem;
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  margin-bottom: 24px;
`;

export const Description = styled.p`
  ${TYPOGRAPHY.MT_3}
  color: ${({ theme }) => theme.mode.grey[600]};
  text-align: center;
`;
