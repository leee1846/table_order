import styled from '@emotion/styled';

export const LongPressCard = styled.div`
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: manipulation;
  
  &:active {
    opacity: 0.9;
  }
`;

