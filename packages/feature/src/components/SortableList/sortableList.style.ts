import styled from '@emotion/styled';

export const SortableListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SortableItem = styled.li`
  position: relative;
  list-style: none;
  touch-action: none;
  user-select: none;
`;

