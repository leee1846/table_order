import styled from '@emotion/styled';
import { theme, TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  background-color: ${theme.colors.white};
  border-radius: 1.25rem;
`;

export const LeftContainer = styled.div`
  position: relative;
`;

export const ThumbnailContainer = styled.div`
  width: 21.625rem;
  height: 15.4375rem;
  border-radius: 1rem;
  overflow: hidden;
  background-color: ${theme.colors.grey[100]};
`;

export const ImagesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 4px;

  & > img {
    width: 4rem;
    height: 2.6875rem;
  }
`;

export const ChiliContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  & > img {
    width: 2.25rem;
    height: 2.25rem;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > span {
    color: ${theme.colors.grey[700]};
    ${TYPOGRAPHY.MT_1}
  }

  & > div {
    display: flex;
    gap: 9px;
  }
`;

export const Price = styled.p`
  ${TYPOGRAPHY.MT_3}
  color: ${theme.colors.grey[800]};
`;

export const Description = styled.p`
  ${TYPOGRAPHY.ST_2}
  color: ${theme.colors.grey[500]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;

    & > span {
      ${TYPOGRAPHY.MT_7}
      color: ${theme.colors.grey[500]};
    }
  }
`;
