import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import * as S from '@/pages/MainPage/BannerAd/bannerAd.style';
import 'swiper/css';

const IMAGE_AUTO_SLIDE_MS = 10000;

/** 임시 예시 슬라이드 — API 연동 시 교체 */
type BannerSlide = { id: string; src: string; alt: string };

const SAMPLE_BANNER_SLIDES: readonly BannerSlide[] = [
  {
    id: 'banner-1',
    src: 'https://picsum.photos/id/20/750/135',
    alt: '예시 배너 광고 1',
  },
  {
    id: 'banner-2',
    src: 'https://picsum.photos/id/21/750/135',
    alt: '예시 배너 광고 2',
  },
];

export const BannerAd = () => {
  const slideCount = SAMPLE_BANNER_SLIDES.length;
  const hasMultipleSlides = slideCount > 1;

  if (slideCount === 0) {
    return null;
  }

  return (
    <S.Wrapper>
      <S.ImgContainer>
        <Swiper
          className="banner-ad-swiper"
          slidesPerView={1}
          loop={hasMultipleSlides}
          allowTouchMove={hasMultipleSlides}
          modules={hasMultipleSlides ? [Autoplay] : []}
          autoplay={
            hasMultipleSlides
              ? { delay: IMAGE_AUTO_SLIDE_MS, disableOnInteraction: false }
              : false
          }
        >
          {SAMPLE_BANNER_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <S.SlideImage src={slide.src} alt={slide.alt} draggable={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      </S.ImgContainer>
    </S.Wrapper>
  );
};
