import styled from '@emotion/styled';
import { TYPOGRAPHY } from '@repo/ui';

export const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  width: 40rem;
  padding: 24px;
  border-radius: 1rem;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.grey[800]};
  ${TYPOGRAPHY.MT_1}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SubTitle = styled.p`
  color: ${({ theme }) => theme.colors.grey[800]};
  margin-bottom: 12px;
  ${TYPOGRAPHY.MT_6}

  & > span {
    color: ${({ theme }) => theme.colors.semantic[500]};
  }
`;

export const DayList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  & > li {
    flex: 1;
  }
`;

export const CheckButtonList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  p {
    color: ${({ theme }) => theme.colors.grey[800]};
    white-space: nowrap;
    ${TYPOGRAPHY.ST_2}
  }
`;
