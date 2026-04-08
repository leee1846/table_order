import styled from '@emotion/styled';
import { TYPOGRAPHY, baseTheme } from '@repo/ui';
import type { TInitPageLayout } from '@repo/api/types';

export const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  width: 100%;
  height: 100%;

  & > .swiper {
    width: 100%;
    height: 100%;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Notice = styled.p`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
  ${TYPOGRAPHY.MT_5}
  color: ${({ theme }) => theme.mode.grey[500]};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  padding: 16px 24px;
  max-width: 41.25rem;
  width: calc(100vw - 2rem);
  text-align: center;
`;

export const DarkLightContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

export const LeftContainer = styled.div<{ initPageLayout: TInitPageLayout }>`
  position: relative;
  width: 40%;
  min-width: 0;
  height: 100%;
  padding: 140px 40px 40px;
  overflow: hidden;
  background-color: ${({ initPageLayout }) =>
    initPageLayout === 'DARK'
      ? baseTheme.darkModeColors.undefined_palette[100]
      : baseTheme.colors.undefined_palette[100]};

  & > img {
    width: 12.5rem;
    margin-bottom: 60px;
  }

  & > h1 {
    font-size: 2.625rem;
    font-style: normal;
    font-weight: 700;
    line-height: 3.25rem; /* 123.81% */
    letter-spacing: -0.06563rem;
    color: ${({ initPageLayout }) =>
      initPageLayout === 'DARK'
        ? baseTheme.darkModeColors.grey[900]
        : baseTheme.colors.grey[900]};
    margin-bottom: 24px;
  }
`;

export const Description = styled.p<{ initPageLayout: TInitPageLayout }>`
  ${TYPOGRAPHY.MT_5}
  color: ${({ initPageLayout }) =>
    initPageLayout === 'DARK'
      ? baseTheme.darkModeColors.grey[600]
      : baseTheme.colors.grey[600]};
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
`;

export const SmallNotice = styled.p<{ initPageLayout: TInitPageLayout }>`
  position: absolute;
  bottom: 40px;
  left: 40px;
  ${TYPOGRAPHY.MT_7}
  color: ${({ initPageLayout }) =>
    initPageLayout === 'DARK'
      ? baseTheme.darkModeColors.primary[500]
      : baseTheme.colors.primary[500]};
`;

export const RightContainer = styled.div`
  width: 60%;
  height: 100%;
`;
