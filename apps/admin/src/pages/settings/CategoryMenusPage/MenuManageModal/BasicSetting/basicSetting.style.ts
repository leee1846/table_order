import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 41px;
`;

export const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 21.255rem;
`;

export const Thumbnail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 15.4375rem;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 1rem;
`;

export const ImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 6.25rem;
  overflow-x: auto;

  & > ul {
    display: flex;
    gap: 8px;

    & > li {
      position: relative;
      width: 8.75rem;
      border-radius: 1rem;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      & > button {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.875rem;
        height: 1.625rem;
        background-color: ${({ theme }) => theme.colors.primary[600]};
        border-radius: 0 0.75rem 0 0.75rem;
        cursor: pointer;
      }
    }
  }
`;

export const ImageAddButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 8.75rem;
  width: 100%;
  height: 6.25rem;
  background-color: ${({ theme }) => theme.colors.grey[100]};
  border-radius: 1rem;
  cursor: pointer;
  border: 1px dashed ${({ theme }) => theme.colors.grey[400]};

  & > span {
    ${TYPOGRAPHY.CT_2}
    color: ${({ theme }) => theme.colors.grey[500]};
  }
`;
