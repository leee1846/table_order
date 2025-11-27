import { useState, useEffect } from 'react';
import * as S from '@/pages/MainPage/mainPage.style';
import { Sidebar } from '@/pages/MainPage/Sidebar';
import { useScrollLayout } from '@/constants/mock';
import { Header } from '@/pages/MainPage/Header';
import { CartButton } from '@/pages/MainPage/CartButton';
import { BreakTime } from '@/pages/MainPage/BreakTime';
import { CartReminder } from '@/pages/MainPage/CartReminder';
import { PickupAlarm } from '@/pages/MainPage/PickAlarm';
import { useGetCategoryList } from '@repo/api/queries';
import { useCategoryStore } from '@/stores/useCategoryStore';

export const MainPage = () => {
  // TODO: 실제 토큰에서 shopSeq를 가져와서 API 호출에 사용하도록 추후에 수정
  // const token = getAccessToken() as string;
  // const payload = decodeJwtToken<ITokenPayload>(token);
  // const shopSeq = payload?.shopSeq ?? 0;

  const {
    data: categoriesStoreData,
    setData: setCategoriesStoreData,
    loadFromStorage,
  } = useCategoryStore();

  // 컴포넌트 마운트 시 세션 스토리지에서 데이터 로드
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 세션 스토리지에 데이터가 없을 때만 API 호출
  const { data: categoriesData } = useGetCategoryList(
    { shopSeq: 1 },
    { enabled: !categoriesStoreData }
  );

  // 3. API 응답을 받으면 스토어에 저장 (세션 스토리지에도 자동 저장)
  useEffect(() => {
    if (categoriesData?.data) {
      setCategoriesStoreData(categoriesData.data);
    }
  }, [categoriesData, setCategoriesStoreData]);

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
        resetCart={() => {
          // TODO: Implement cart reset logic
        }}
      />
    );
  }

  return (
    <S.Container>
      <Header />
      <S.MainContent>
        {categoriesStoreData && (
          <Sidebar
            categories={categoriesStoreData}
            useScrollLayout={useScrollLayout}
          />
        )}
        {/* <Contents categories={categories} useScrollLayout={useScrollLayout} /> */}
        <CartButton />
      </S.MainContent>
    </S.Container>
  );
};
