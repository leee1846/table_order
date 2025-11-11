'use client';

import type { ReactNode } from 'react';
import * as S from './tableCard.styles';

interface Props {
  tableNumber: number;
  statusText: string;
  statusIcon?: ReactNode;
  onClick?: () => void;
}

export const TableCard = ({
  tableNumber,
  statusText,
  statusIcon,
  onClick,
}: Props) => {
  return (
    <S.CardContainer onClick={onClick}>
      <S.CardHeader>
        <S.TableNumber>{tableNumber}</S.TableNumber>
        {statusIcon || <S.StatusIcon />}
      </S.CardHeader>
      <S.CardFooter>
        <S.StatusText>{statusText}</S.StatusText>
      </S.CardFooter>
    </S.CardContainer>
  );
};

