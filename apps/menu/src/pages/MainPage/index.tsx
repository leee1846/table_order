import { useState } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { Contents } from '@/pages/MainPage/Contents';
import { categories, useScrollLayout } from '@/constants/mock';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';

export const MainPage = () => {
  const [showCartReminder, setShowCartReminder] = useState(false);
  const showBreakTime = false;
  const [showPickupAlarm, setShowPickupAlarm] = useState(false);

  if (showPickupAlarm) {
    return <PickupAlarm onClose={() => setShowPickupAlarm(false)} />;
  }

  if (showBreakTime) {
    return <BreakTime />;
  }

  if (showCartReminder) {
    return (
      <CartReminder
        closePage={() => setShowCartReminder(false)}
        resetCart={() => {}}
      />
    );
  }

  return (
    <S.Container>
      <Header />
      <S.MainContent>
        <Sidebar categories={categories} useScrollLayout={useScrollLayout} />
        <Contents categories={categories} useScrollLayout={useScrollLayout} />
        <CartButton />
      </S.MainContent>
    </S.Container>
  );
};
