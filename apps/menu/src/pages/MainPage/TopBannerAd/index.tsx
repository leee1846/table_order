import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import * as S from '@/pages/MainPage/TopBannerAd/topBannerAd.style';
import { useAdStore } from '@/stores/useAdStore';
import 'swiper/css';

const IMAGE_AUTO_SLIDE_MS = 10000;

export const TopBannerAd = () => {
  const { data: adData } = useAdStore();
  const files = adData.topBannerFiles;
  const slideCount = files.length;
  const hasMultipleSlides = slideCount > 1;

  if (adData.isAdDataLoading || slideCount === 0) {
    return null;
  }

  return (
    <S.Wrapper>
      <S.ImgContainer>
        <Swiper
          className="top-banner-ad-swiper"
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
          {files.map((file) => (
            <SwiperSlide key={file.contentSeq}>
              <S.SlideImage
                src={file.filePath}
                alt={file.contentDescription}
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </S.ImgContainer>
    </S.Wrapper>
  );
};
