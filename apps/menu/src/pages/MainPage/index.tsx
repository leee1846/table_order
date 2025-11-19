import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Contents } from '@/pages/MainPage/Contents';
import { categories, useScrollLayout } from '@/constants/mock';

export const MainPage = () => {
  return (
    <S.Container>
      <Sidebar categories={categories} useScrollLayout={useScrollLayout} />
      <Contents categories={categories} useScrollLayout={useScrollLayout} />
    </S.Container>
  );
};
