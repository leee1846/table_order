import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Contents } from '@/pages/MainPage/Contents';
import { categories, useScrollLayout } from '@/constants/mock';
import { Header } from '@/pages/MainPage/Header';

export const MainPage = () => {
  return (
    <S.Container>
      <Header />
      <S.MainContent>
        <Sidebar categories={categories} useScrollLayout={useScrollLayout} />
        <Contents categories={categories} useScrollLayout={useScrollLayout} />
      </S.MainContent>
    </S.Container>
  );
};
