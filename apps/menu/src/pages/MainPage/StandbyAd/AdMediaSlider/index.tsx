import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import type { IGetMenuAdFile } from '@repo/api/types';
import * as S from '@/pages/MainPage/StandbyAd/AdMediaSlider/adMediaSlider.style';
import 'swiper/css';

const IMAGE_AUTO_SLIDE_MS = 10000;

const isVideoAd = (file: IGetMenuAdFile) =>
  file.adType === 'STANDBY_VIDEO' || file.adType === 'ORDER_COMP_FULL_VIDEO';

type PreparedSlide = {
  readonly file: IGetMenuAdFile;
  readonly isVideo: boolean;
  readonly src: string;
};

type VideoSlideProps = {
  readonly src: string;
  readonly isActive: boolean;
  /** 슬라이드가 영상 1장뿐일 때 — 페이지 전환 없이 무한 반복 재생 */
  readonly loopPlayback: boolean;
  readonly onEnded: () => void;
};

const VideoSlide = ({
  src,
  isActive,
  loopPlayback,
  onEnded,
}: VideoSlideProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    if (isActive) {
      el.currentTime = 0;
      void el.play().catch(() => {
        // no-op
      });
    } else {
      el.pause();
    }
  }, [isActive, src]);

  useEffect(() => {
    if (loopPlayback) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
  }, [loopPlayback, onEnded, src]);

  return (
    <S.AdMediaVideo ref={ref} src={src} muted playsInline loop={loopPlayback} />
  );
};

type AdMediaSliderProps = {
  readonly files: readonly IGetMenuAdFile[];
  /** 다운로드된 영상: key는 filePath */
  readonly localVideoUrls?: Readonly<Record<string, string>>;
};

const prepareSlides = (
  files: readonly IGetMenuAdFile[],
  localVideoUrls: Readonly<Record<string, string>>
): PreparedSlide[] => {
  const out: PreparedSlide[] = [];
  for (const file of files) {
    const isVideo = isVideoAd(file);
    const localUrl = localVideoUrls[file.filePath];
    if (isVideo && !localUrl) {
      continue;
    }
    out.push({
      file,
      isVideo,
      src: isVideo ? localUrl! : file.filePath,
    });
  }
  return out;
};

export const AdMediaSlider = ({
  files,
  localVideoUrls = {},
}: AdMediaSliderProps) => {
  const slides = useMemo(
    () => prepareSlides(files, localVideoUrls),
    [files, localVideoUrls]
  );

  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const slidesRef = useRef(slides);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  slidesRef.current = slides;

  const soleVideoRepeats = slides.length === 1 && slides[0]?.isVideo === true;

  const clearImageTimer = useCallback(() => {
    if (imageTimerRef.current !== null) {
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (slidesRef.current.length <= 1) {
      return;
    }
    goNext();
  }, [goNext]);

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }
    setRealIndex((i) => Math.min(i, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    clearImageTimer();
    if (slides.length <= 1) {
      return;
    }
    const current = slides[realIndex];
    if (!current || current.isVideo) {
      return;
    }
    imageTimerRef.current = setTimeout(goNext, IMAGE_AUTO_SLIDE_MS);
    return clearImageTimer;
  }, [realIndex, slides, goNext, clearImageTimer]);

  if (slides.length === 0) {
    return null;
  }

  const hasMultipleSlides = slides.length > 1;

  return (
    <S.AdSliderViewport>
      <Swiper
        className="ad-media-swiper"
        slidesPerView={1}
        loop={hasMultipleSlides}
        allowTouchMove={hasMultipleSlides}
        onSwiper={(instance) => {
          swiperRef.current = instance;
        }}
        onAfterInit={(swiper) => {
          setRealIndex(swiper.realIndex);
        }}
        onSlideChangeTransitionEnd={(swiper) => {
          setRealIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.file.contentSeq}>
            {slide.isVideo ? (
              <VideoSlide
                src={slide.src}
                isActive={index === realIndex}
                loopPlayback={soleVideoRepeats}
                onEnded={handleVideoEnded}
              />
            ) : (
              <S.AdMediaImage
                src={slide.src}
                alt={slide.file.contentDescription}
                draggable={false}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </S.AdSliderViewport>
  );
};
