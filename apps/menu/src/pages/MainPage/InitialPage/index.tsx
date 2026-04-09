import { useCallback, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import * as S from '@/pages/MainPage/InitialPage/initialPage.style';
import { useInitialPageStore } from '@/stores/useInitialPageStore';
import { useShopThemePage } from '@/hooks/useShopThemePage';
import { NoContent } from '@/feature/NoContent';
import { useCustomerTranslation } from '@/config/i18n/customer.i18n';
import { globalTimerManager } from '@/utils/timerManager';
import { TIMER_KEYS } from '@/constants/keys';
import { useShopDetailStore } from '@/stores/useShopDetailStore';

export const InitialPage = () => {
  const { t } = useCustomerTranslation();

  const shopDetailData = useShopDetailStore((s) => s.data);
  const { hideInitialPage } = useInitialPageStore();
  const { data: shopPageSettingData } = useShopThemePage();
  const { themePageData } = shopPageSettingData;
  const swiperRef = useRef<SwiperType | null>(null);

  const detailImageList =
    themePageData?.shopPageDetailList?.filter(
      (item) => item.pageDetailType === 'INIT_COMMON'
    ) ?? [];

  const hasEnoughSlides = detailImageList.length >= 2;

  // Swiper 인스턴스가 설정되면 자동 스와이프 시작
  const startAutoplay = useCallback(() => {
    if (!hasEnoughSlides || !swiperRef.current) {
      return;
    }

    // 기존 타이머가 있으면 정리
    globalTimerManager.clear(TIMER_KEYS.INITIAL_PAGE_SWIPER_AUTOPLAY);

    globalTimerManager.setInterval(
      TIMER_KEYS.INITIAL_PAGE_SWIPER_AUTOPLAY,
      () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext();
        }
      },
      15000 // 15초
    );
  }, [hasEnoughSlides]);

  // 15초마다 자동 스와이프
  useEffect(() => {
    // Swiper 인스턴스가 이미 설정되어 있으면 시작
    if (swiperRef.current) {
      startAutoplay();
    }

    return () => {
      globalTimerManager.clear(TIMER_KEYS.INITIAL_PAGE_SWIPER_AUTOPLAY);
    };
  }, [startAutoplay]);

  if (!shopDetailData || !themePageData) {
    return null;
  }

  const initPageLayout = themePageData.initPageLayout;

  const getShopDetail = (layout: 'LIGHT' | 'DARK') => {
    const pageDetailType = layout === 'LIGHT' ? 'INIT_LIGHT' : 'INIT_DARK';

    return themePageData.shopPageDetailList.find(
      (item) => item.pageDetailType === pageDetailType
    );
  };

  if (!detailImageList || detailImageList.length === 0) {
    return (
      <NoContent paddingTop="25%">
        {t('초기화면 이미지를 등록해주세요.')}
      </NoContent>
    );
  }

  if (initPageLayout === 'IMAGE') {
    return (
      <S.Container
        onClick={hideInitialPage}
        role="button"
        aria-label={t('주문 시작하기')}
        tabIndex={0}
      >
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={hasEnoughSlides}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            startAutoplay();
          }}
        >
          {detailImageList.map((item) => (
            <SwiperSlide key={item.pageDetailImageSeq}>
              <S.Image
                src={item.pageDetailImagePath ?? undefined}
                alt={item.pageDetailDescription}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <S.Notice role="status">
          {t('주문을 시작하려면 화면을 터치해 주세요.')}
        </S.Notice>
      </S.Container>
    );
  }

  return (
    <S.Container
      onClick={hideInitialPage}
      role="button"
      aria-label={t('주문 시작하기')}
      tabIndex={0}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={hasEnoughSlides}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          startAutoplay();
        }}
      >
        {detailImageList.map((detailImage) => (
          <SwiperSlide key={detailImage.pageDetailImageSeq}>
            <S.DarkLightContainer>
              <S.LeftContainer initPageLayout={initPageLayout}>
                {/* 로고 */}
                {getShopDetail(initPageLayout)?.pageDetailImagePath && (
                  <img
                    src={
                      getShopDetail(initPageLayout)?.pageDetailImagePath ??
                      undefined
                    }
                    alt={
                      getShopDetail(initPageLayout)?.pageDetailDescription ||
                      t('매장 로고')
                    }
                  />
                )}
                {/* 매장명 */}
                <h1>{getShopDetail(initPageLayout)?.pageDetailDescription}</h1>
                {/* 상세 이미지 설명 */}
                <S.Description initPageLayout={initPageLayout}>
                  {detailImage.pageDetailDescription}
                </S.Description>
                <S.SmallNotice initPageLayout={initPageLayout} role="status">
                  {t('주문을 시작하려면 화면을 터치해 주세요.')}
                </S.SmallNotice>
              </S.LeftContainer>
              {/* 상세 이미지 */}
              <S.RightContainer>
                <S.Image
                  src={detailImage.pageDetailImagePath ?? undefined}
                  alt={detailImage.pageDetailDescription || t('메뉴 이미지')}
                />
              </S.RightContainer>
            </S.DarkLightContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </S.Container>
  );
};
