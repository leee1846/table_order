import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  gap: 50px;

  & > div {
    width: 100%;
    border: 1px solid red;
    padding: 30px;
  }

  & > div > p {
    font-size: 32px;
    margin-bottom: 20px;
  }

  & > div > div {
    display: flex;
    flex-direction: column;
    gap: 30px;

    & > div {
      font-size: 24px;
    }
  }
`;
