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
export const TableGroupWrapper = S.TableGroupWrapper;
export const TableGroupList = S.TableGroupList;
export const TableGroup = S.TableGroup;
export const TableGroupButton = S.TableGroupButton;

export type { TableWithStatus } from './types';
export { useTablesData } from './useTablesData';
