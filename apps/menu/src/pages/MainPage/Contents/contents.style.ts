import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: fixed;
  top: 4.75rem;
  right: 0;
  bottom: 0;
  left: 210px;
  width: calc(100% - 210px);
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mode.undefined_palette[900]};
`;

export const Container = styled.div<{ paddingTop: string }>`
  flex: 1;
  min-height: 0;
  padding: ${({ paddingTop }) => paddingTop} 0 40px 40px;
  overflow-y: auto;
`;
