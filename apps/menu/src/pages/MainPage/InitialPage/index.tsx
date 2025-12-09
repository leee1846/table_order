import { useShopDetailData } from '@/hooks/useShopDetailData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import * as S from '@/pages/MainPage/InitialPage/initialPage.style';
import { useInitialPageStore } from '@/stores/useInitialPageStore';

export const InitialPage = () => {
  const { data: shopDetailData } = useShopDetailData();
  const { hideInitialPage } = useInitialPageStore();

  if (!shopDetailData) {
    return null;
  }

  if (shopDetailData.shopPage.initPageLayout === 'IMAGE') {
    return (
      <S.Container onClick={hideInitialPage}>
        <Swiper spaceBetween={0} slidesPerView={1} loop>
          {shopDetailData.shopPageDetailList.map((item) => (
            // TODO: 이미지 경로 수정
            <SwiperSlide key={item.pageSeq}>
              <S.Image src={item.imagePath} alt={item.pageDescription} />
            </SwiperSlide>
          ))}
        </Swiper>
        <S.Notice>주문을 시작하려면 화면을 터치해 주세요.</S.Notice>
      </S.Container>
    );
  }

  return (
    <S.Container onClick={hideInitialPage}>
      <Swiper spaceBetween={0} slidesPerView={1} loop>
        {shopDetailData.shopPageDetailList.map((item) => (
          <SwiperSlide key={item.pageSeq}>
            <S.DarkLightContainer>
              <S.LeftContainer
                initPageLayout={shopDetailData.shopPage.initPageLayout}
              >
                {shopDetailData.shopPage.initPageLogoImagePath && (
                  <img
                    src={shopDetailData.shopPage.initPageLogoImagePath}
                    alt={shopDetailData.shopPage.initPageShopName}
                  />
                )}
                <h1>{shopDetailData.shopPage.initPageShopName}</h1>
                <S.Description
                  initPageLayout={shopDetailData.shopPage.initPageLayout}
                >
                  {item.pageDescription}
                </S.Description>
                <S.SmallNotice
                  initPageLayout={shopDetailData.shopPage.initPageLayout}
                >
                  주문을 시작하려면 화면을 터치해 주세요.
                </S.SmallNotice>
              </S.LeftContainer>
              <S.RightContainer>
                <S.Image src={item.imagePath} alt={item.pageDescription} />
              </S.RightContainer>
            </S.DarkLightContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </S.Container>
  );
};
