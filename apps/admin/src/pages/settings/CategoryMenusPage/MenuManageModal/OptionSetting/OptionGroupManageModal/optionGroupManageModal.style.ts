import { theme, TYPOGRAPHY } from '@repo/ui';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const soldOutCss = css`
  flex-direction: column;
  white-space: nowrap;
  transform: translateY(0.25rem);

  & > div {
    width: 1.5rem;
    height: 1.5rem;
  }

  & span {
    ${TYPOGRAPHY.BD_2}
    color: ${theme.colors.grey[800]};
  }
`;

export const inputCss = css`
  width: 100%;
  height: 3.25rem;
`;

export const deleteButtonCss = css`
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    margin-right: 0 !important;
  }
`;

export const checkButtonCss = css`
  & > div {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const Container = styled.div`
  position: relative;
  width: 71.25rem;
  background-color: ${theme.colors.white};
  padding: 24px 24px 0;

  & > h1 {
    text-align: center;
    color: ${theme.colors.grey[800]};
    margin: 20px 0 40px;
    ${TYPOGRAPHY.MT_1}
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}

    & > span {
      color: ${theme.colors.semantic[500]};
    }
  }
`;

export const OptionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  max-height: 30%;
  & > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    & > label {
      flex: 0.5;
    }
    & > label:first-of-type {
      flex: 0;
    }
    & > label:nth-of-type(2) {
      flex: 1;
    }
  }
`;

export const OptionAddButton = styled.button`
  width: 100%;
  height: 3.125rem;
  border-radius: 0.75rem;
  background-color: ${theme.colors.grey[100]};
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.ST_3}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
`;

export const AdditionalsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.colors.grey[800]};
  ${TYPOGRAPHY.ST_2}

  & > div > input[type='string'] {
    width: 2.5rem;
    border-bottom: 1.25px solid ${theme.colors.grey[500]};
    text-align: center;
    ${TYPOGRAPHY.ST_2}
  }
`;

export const CodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const FloatingButtonContainer = styled.div`
  width: 100%;
  padding: 40px 0 50px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 39.67%);
  & > button {
    width: 100%;
  }
`;
