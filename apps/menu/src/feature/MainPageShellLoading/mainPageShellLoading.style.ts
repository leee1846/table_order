import styled from '@emotion/styled';

export const WhiteBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${(props) => props.theme.zIndex.popover};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;
