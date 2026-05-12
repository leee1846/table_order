import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { IGetMenuAdFile } from '@repo/api/types';
import * as S from '@/pages/MainPage/StandbyAd/AdMediaSlider/adMediaSlider.style';
import 'swiper/css';

const IMAGE_AUTO_SLIDE_MS = 10000;

type AdMediaSliderProps = {
  readonly files: readonly IGetMenuAdFile[];
  /** 다운로드된 영상 파일의 로컬 URL 맵 (fileName → localUrl) */
  readonly localVideoUrls?: Readonly<Record<string, string>>;
};

export const AdMediaSlider = ({
  files,
  localVideoUrls = {},
}: AdMediaSliderProps) => {
  const slideCount = files.length;
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
        {files.map((file) => {
          const isVideo =
            file.adType === 'STANDBY_VIDEO' ||
            file.adType === 'ORDER_COMP_FULL_VIDEO';
          // localVideoUrls의 key는 filePath — fileName은 서버에서 중복 가능
          const localUrl = localVideoUrls[file.filePath];

          if (isVideo && !localUrl) {
            return null;
          }

          return (
            <SwiperSlide key={file.contentSeq}>
              {isVideo ? (
                <S.AdMediaVideo
                  src={localUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <S.AdMediaImage
                  src={file.filePath}
                  alt={file.contentDescription}
                  draggable={false}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </S.AdSliderViewport>
  );
};
