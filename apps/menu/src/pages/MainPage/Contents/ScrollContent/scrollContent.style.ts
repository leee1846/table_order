import styled from '@emotion/styled';

export const Container = styled.div`
  position: fixed;
  top: 4.75rem;
  right: 0;
  bottom: 0;
  left: 250px;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
  gap: 50px;
  overflow-y: auto;

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
