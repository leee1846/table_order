import styled from '@emotion/styled';

export const Container = styled.div`
  position: fixed;
  top: 4.75rem;
  right: 0;
  bottom: 0;
  left: 210px;
  width: calc(100% - 210px);
  padding: 40px 0 40px 40px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
`;
