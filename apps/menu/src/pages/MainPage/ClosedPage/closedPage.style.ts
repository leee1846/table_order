import styled from '@emotion/styled';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  width: max-content;
  min-width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;

  & > img {
    width: 10rem;
    height: 10rem;
  }
`;

export const Title = styled.h1`
  font-size: 8.75rem;
  font-style: normal;
  font-weight: 700;
  line-height: 10.625rem; /* 121.429% */
  letter-spacing: -0.21875rem;
  color: ${({ theme }) => theme.mode.undefined_palette[400]};
  margin-bottom: 40px;
`;

export const Time = styled.p`
  font-size: 5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 6rem; /* 120% */
  color: ${({ theme }) => theme.mode.grey[900]};
  border-radius: 62.4rem;
  padding: 20px 60px;
  background-color: ${({ theme }) => theme.mode.grey[200]};
  margin-bottom: 92px;
`;

export const Description = styled.p`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.875rem; /* 150% */
  letter-spacing: -0.03125rem;
  color: ${({ theme }) => theme.mode.grey[600]};
  text-align: center;
`;
