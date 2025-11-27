import { useState } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { useScrollLayout } from '@/constants/mock';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { useGetCategoryList } from '@repo/api/queries';
import { getAccessToken } from '@repo/api/auth';
import { decodeJwtToken } from '@repo/util/function';
import type { ITokenPayload } from '@repo/api/types';

export const MainPage = () => {
  const token = getAccessToken() as string;
  const payload = decodeJwtToken<ITokenPayload>(token);
  // TODO: 실제 토큰에서 가져오도록 추후에 수정
  const shopSeq = payload?.shopSeq ?? 0;
  const { data: categories } = useGetCategoryList({ shopSeq: 1 });

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
        {categories && (
          <Sidebar categories={categories} useScrollLayout={useScrollLayout} />
          // <Contents categories={categories} useScrollLayout={useScrollLayout} />
        )}
        <CartButton />
      </S.MainContent>
    </S.Container>
  );
};
