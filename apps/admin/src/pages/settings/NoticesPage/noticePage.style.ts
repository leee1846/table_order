import styled from '@emotion/styled';
import { TYPOGRAPHY, theme } from '@repo/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px 24px 0 30px;
  flex: 1;
  min-height: 0;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > h1 {
    color: ${theme.colors.grey[800]};
    ${TYPOGRAPHY.MT_1}
  }
`;

export const QRModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 32px;
  min-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
`;

export const QRModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;


  & > h2 {
    ${TYPOGRAPHY.MT_2}
    color: ${theme.colors.grey[800]};
    flex: 1;
    text-align: center;
    transform: translateX(20px);
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: ${theme.colors.grey[600]};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.grey[800]};
  }
`;

export const QRModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  & > p {
    ${TYPOGRAPHY.MT_4}
    color: ${theme.colors.grey[600]};
    margin: 0;
    text-align: center;
  }

  div{
    border: 1px solid red;
    width: 100px;
    height: 100%;


    >img{
    border: 1px solid blue;
    width: 100%;
    height: 100%;
    object-fit: contain;
    }
  }
`;