'use client';

import * as S from './breadcrumbText.styles';

interface Props {
  text: string;
}

export const BreadcrumbText = ({ text }: Props) => {
  return <S.BreadcrumbContainer>{text}</S.BreadcrumbContainer>;
};

