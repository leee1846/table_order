import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const TextAreaContainer = styled.div`
  width: 100%;
  height: 6.25rem;
  padding: 0 12px;
  margin-top: 12px;

  & > textarea {
    width: 100%;
    height: 100%;
    border: 1px solid ${theme.colors.grey[400]};
    border-radius: 0.75rem;
    padding: 16px 12px;
    resize: none;
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.ST_4}
  }
`;

export const InnerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 20px;
  background-color: ${theme.colors.grey[50]};
  border-radius: 0.75rem;
`;

export const InnerSectionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  & > p {
    ${TYPOGRAPHY.ST_4}
    color: ${theme.colors.grey[600]};
  }
`;

export const TextAreasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > p {
      ${TYPOGRAPHY.BD_3}
      color: ${theme.colors.grey[500]};
    }

    & > textarea {
      width: 100%;
      height: 4.25rem;
      padding: 16px 12px;
      border: 1px solid ${theme.colors.grey[400]};
      border-radius: 0.75rem;
      color: ${theme.colors.grey[700]};
      ${TYPOGRAPHY.ST_4}
      resize: none;
    }
  }
`;
