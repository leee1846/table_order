import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;

  & > p {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  gap: 16px;
`;

export const ImageSection = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 16.625rem;
  border-radius: 1rem;
  background-color: ${theme.colors.grey[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  overflow: hidden;

  p {
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.BD_1}
    text-align: center;
  }

  span {
    ${TYPOGRAPHY.CT_2}
    color: ${theme.colors.grey[500]};
  }
`;

export const DescriptionSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ImageButtonContainer = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 200px;
  padding: 16px 12px;
  border: 1px solid ${theme.colors.grey[400]};
  border-radius: 0.75rem;
  color: ${theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_4}
  resize: none;
  font-family: inherit;
  background-color: transparent;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${theme.colors.grey[400]};
    ${TYPOGRAPHY.ST_5}
  }
`;

export const AddButtonStyle = css`
  width: 100%;
  border: none;
  height: 50px;
  background-color: ${theme.colors.grey[100]};
`;

export const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
`;
