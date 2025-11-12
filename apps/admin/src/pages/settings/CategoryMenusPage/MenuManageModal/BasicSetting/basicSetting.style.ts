import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin: 41px 0;
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

export const ContentsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 19px;
  height: calc(15.4375rem + 10px + 6.25rem);
  min-height: 0;
  overflow: hidden;
`;

export const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;

  & > div:first-of-type {
    width: 100%;
  }

  & > div:last-of-type {
    min-width: 218px;
    max-width: 218px;
  }
`;

export const VerticalLayout = styled.div<{ flex?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  ${({ flex }) => flex && 'flex: 1; min-height: 0;'}
`;

export const PriceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.p`
  display: flex;
  gap: 10px;

  color: ${({ theme }) => theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_6}

  & > span {
    color: ${({ theme }) => theme.colors.semantic[500]};
    ${TYPOGRAPHY.MT_6}
  }
`;

export const BadgeContainer = styled.div<{ gap?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.grey[100]};
  border-radius: 0.75rem;
  gap: ${({ gap }) => (gap ? `${gap}px` : 0)};
`;

export const BadgeButton = styled.button`
  width: 52px;
  height: 35px;

  & > img {
    width: 100%;
    height: 100%;
  }
`;

export const ChiliLevelButton = styled.button`
  width: 50px;
  height: 50px;

  & > img {
    width: 100%;
    height: 100%;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  flex: 1;
  min-height: 0;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.grey[400]};
  padding: 16px 12px;
  resize: none;
  color: ${({ theme }) => theme.colors.grey[700]};
  ${TYPOGRAPHY.ST_4}

  &::placeholder {
    color: ${({ theme }) => theme.colors.grey[400]};
    ${TYPOGRAPHY.ST_5}
  }
`;
