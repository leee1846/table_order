import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { AdSlide } from '@/pages/MainPage/InitialAd';
import * as S from '@/pages/MainPage/InitialAd/AdMediaSlider/adMediaSlider.style';
import 'swiper/css';

const IMAGE_AUTO_SLIDE_MS = 10000;

type AdMediaSliderProps = {
  readonly adList: readonly AdSlide[];
};

export const AdMediaSlider = ({ adList }: AdMediaSliderProps) => {
  const slideCount = adList.length;
  const hasMultipleSlides = slideCount > 1;

  if (slideCount === 0) {
    return null;
  }

  return (
    <S.AdSliderViewport>
      <Swiper
        className="ad-media-swiper"
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
        {adList.map((ad) => (
          <SwiperSlide key={ad.id}>
            <S.AdMediaImage src={ad.src} alt={ad.alt} draggable={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    </S.AdSliderViewport>
  );
};
