import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export interface ICategories {
  layout: 1 | 2 | 3;
}
export const Categories = styled.div<ICategories>`
  display: grid;
  grid-template-columns: ${({ layout }) => `repeat(${layout}, minmax(0, 1fr))`};
  row-gap: 30px;
  column-gap: 24px;
  max-width: 80%;
  width: 100%;
`;

export const CategoryName = styled.p`
  ${TYPOGRAPHY.MT_4}
  color: ${({ theme }) => theme.mode.grey[900]};
  margin-bottom: 4px;
`;

export const CategoryDescription = styled.p`
  ${TYPOGRAPHY.ST_4}
  color: ${({ theme }) => theme.mode.grey[600]};
`;
