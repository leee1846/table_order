import { type ReactNode } from 'react';
import * as S from './tablesPageContainer.styles';

export interface TablesPageContainerProps {
  children: ReactNode;
}

export const TablesPageContainer = ({ children }: TablesPageContainerProps) => {
  return <S.Container>{children}</S.Container>;
};

export const TableCardsArea = S.TableArea;
export const TableCardsGrid = S.GridContainer;

export type { TableWithStatus } from './types';
export { useTablesData } from './useTablesData';
