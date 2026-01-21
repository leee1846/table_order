import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 31px;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;

  & > h1 {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }

  & > div {
    width: 0.125rem;
    height: 1.25rem;
    background-color: ${theme.colors.grey[800]};
  }

  & > h2 {
    color: ${theme.colors.grey[600]};
    ${TYPOGRAPHY.ST_1}
  }
`;

export const TranslateButton = css`
  color: ${theme.colors.white} !important;
  border: none;
  background-color: ${theme.colors.grey[700]} !important;
  ${TYPOGRAPHY.ST_5}
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Content = styled.p`
  ${TYPOGRAPHY.ST_2}
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

export const Span = styled.span`
  color: ${theme.colors.semantic[600]};
  ${TYPOGRAPHY.ST_2}
  text-align: center;
`;
