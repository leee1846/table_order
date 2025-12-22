import { useShopDetailData } from '@/hooks/useShopDetailData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import * as S from '@/pages/MainPage/InitialPage/initialPage.style';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useShopPageSettingData } from '@/hooks/useShopPageSettingData';
import { NoContent } from '@/feature/NoContent';

export const InitialPage = () => {
  const { data: shopDetailData } = useShopDetailData();
  const { hideInitialPage } = useInitialPageStore();
  const { data: shopPageSettingData } = useShopPageSettingData();

  if (!shopDetailData || !shopPageSettingData) {
    return null;
  }

  const hasEnoughSlides = shopPageSettingData.shopPageDetailList.length >= 2;
  const initPageLayout = shopPageSettingData.initPageLayout;
  const detailImageList = shopPageSettingData.shopPageDetailList.filter(
    (item) => item.pageDetailType === 'INIT_COMMON'
  );

  const getShopDetail = (layout: 'LIGHT' | 'DARK') => {
    const pageDetailType = layout === 'LIGHT' ? 'INIT_LIGHT' : 'INIT_DARK';

    return shopPageSettingData.shopPageDetailList.find(
      (item) => item.pageDetailType === pageDetailType
    );
  };

  if (!detailImageList || detailImageList.length === 0) {
    return (
      <NoContent paddingTop="25%">초기화면 이미지를 등록해주세요.</NoContent>
    );
  }

  if (initPageLayout === 'IMAGE') {
    return (
      <S.Container onClick={hideInitialPage}>
        <Swiper spaceBetween={0} slidesPerView={1} loop={hasEnoughSlides}>
          {shopPageSettingData.shopPageDetailList.map((item) => (
            // TODO: 이미지 경로 수정
            <SwiperSlide key={item.pageSeq}>
              <S.Image
                src={item.pageDetailImagePath}
                alt={item.pageDetailDescription}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <S.Notice>주문을 시작하려면 화면을 터치해 주세요.</S.Notice>
      </S.Container>
    );
  }

  return (
    <S.Container onClick={hideInitialPage}>
      <Swiper spaceBetween={0} slidesPerView={1} loop={hasEnoughSlides}>
        {detailImageList.map((detailImage) => (
          <SwiperSlide key={detailImage.pageSeq}>
            <S.DarkLightContainer>
              <S.LeftContainer initPageLayout={initPageLayout}>
                {/* 로고 */}
                {getShopDetail(initPageLayout)?.pageDetailImagePath && (
                  <img
                    src={getShopDetail(initPageLayout)?.pageDetailImagePath}
                    alt={getShopDetail(initPageLayout)?.pageDetailDescription}
                  />
                )}
                {/* 매장명 */}
                <h1>{getShopDetail(initPageLayout)?.pageDetailDescription}</h1>
                {/* 상세 이미지 설명 */}
                <S.Description initPageLayout={initPageLayout}>
                  {detailImage.pageDetailDescription}
                </S.Description>
                <S.SmallNotice initPageLayout={initPageLayout}>
                  주문을 시작하려면 화면을 터치해 주세요.
                </S.SmallNotice>
              </S.LeftContainer>
              {/* 상세 이미지 */}
              <S.RightContainer>
                <S.Image
                  src={detailImage.pageDetailImagePath}
                  alt={detailImage.pageDetailDescription}
                />
              </S.RightContainer>
            </S.DarkLightContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </S.Container>
  );
};
