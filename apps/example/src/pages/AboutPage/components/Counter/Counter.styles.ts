import styled from '@emotion/styled';

export const Container = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

export const CountDisplay = styled.div`
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 4px;
`;

export const CountLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const CountValue = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #333;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  & > button {
    flex: 1;
  }
`;
