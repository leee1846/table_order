import styled from '@emotion/styled';

export const TimeRangeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  &:hover:not(:focus-within) {
    border-color: #9e9e9e;
  }
`;
export const TitleContentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TimeInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TimeField = styled.input`
  width: 32px;
  padding: 4px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Roboto Mono', monospace;

  &::placeholder {
    color: #bdbdbd;
  }
`;

export const Colon = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #424242;
  user-select: none;
`;

export const RangeSeparator = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #757575;
  user-select: none;
`;
