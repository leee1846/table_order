import styled from '@emotion/styled';

export const TableGroupList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  margin-top: 30px;

  /* 스크롤바 스타일링 (선택사항) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;
