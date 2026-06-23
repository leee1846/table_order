import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import type { IGetMenuAdFile } from '@repo/api/types';
import * as S from '@/feature/AdMediaSlider/adMediaSlider.style';
import 'swiper/css';
import { AdThumbnailImage } from '@repo/ui/icons';
// TODO: 제거 예정 (영상 재생 실패 추적 로그)
import { saveAppLog } from '@repo/util/app';

// 이미지에는 종료 이벤트가 없어서 시간 기준 완료 판단
const IMAGE_AUTO_SLIDE_MS = 10000;
const EMPTY_LOCAL_VIDEO_URLS: Readonly<Record<string, string>> = {};

// TODO: 제거 예정 (영상 재생 실패 추적 로그) — 아래 상수/헬퍼 4개 블록 전체
// HTMLMediaElement.error.code → 사람이 읽을 수 있는 이름 (재생 실패 원인 추적용)
const MEDIA_ERROR_NAME: Record<number, string> = {
  1: 'MEDIA_ERR_ABORTED',
  2: 'MEDIA_ERR_NETWORK',
  3: 'MEDIA_ERR_DECODE',
  4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
};

// 재생 소스가 Blob인지 _capacitor_file_ 스트리밍 폴백인지 구분
const srcKind = (src: string): string =>
  src.startsWith('blob:') ? 'blob' : 'capacitor-file';

// 재생 중인데 currentTime이 이 시간 이상 진행되지 않으면 멈춤(frozen)으로 판단
const STALL_DETECT_MS = 3000;
// 멈춤 감지 폴링 주기
const STALL_POLL_MS = 1000;

// 영상 파일만 로컬 다운로드 URL 기준으로 재생하기 위한 타입 구분
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
  // 단일 영상 무한 반복 시 Swiper 이동 없이 video loop 사용
  readonly loopPlayback: boolean;
  readonly onEnded: () => void;
  // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 로그 추적용 식별자 (재생 동작에는 영향 없음)
  readonly label?: string;
};

// Swiper 활성 슬라이드와 실제 video 재생 상태 동기화
const VideoSlide = ({
  src,
  isActive,
  loopPlayback,
  onEnded,
  label,
}: VideoSlideProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  // React 상태 변경만으로 video가 멈추지 않아 활성 영상만 재생
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    if (isActive) {
      el.currentTime = 0;
      // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 제거 시 catch 본문을 비우고
      // 의존성 배열에서 label 제거: `void el.play().catch(() => {}); }, [isActive, src]);`
      void el.play().catch((error: unknown) => {
        // 재생 실패 무시 (동작 유지), 원인만 기록
        saveAppLog('[광고 영상 재생 실패]', {
          label,
          srcKind: srcKind(src),
          name: error instanceof Error ? error.name : 'unknown',
          message: error instanceof Error ? error.message : String(error),
        });
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive, src, label]);

  // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 아래 useEffect 전체 삭제
  // error 외에도 stalled/waiting/abort 등 재생을 방해하는 모든 미디어 이벤트를 추적
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const snapshot = (tag: string) => () => {
      const mediaError = el.error;
      saveAppLog(tag, {
        label,
        srcKind: srcKind(src),
        code: mediaError?.code ?? null,
        codeName:
          mediaError?.code != null
            ? (MEDIA_ERROR_NAME[mediaError.code] ?? 'UNKNOWN')
            : null,
        message: mediaError?.message ?? '',
        networkState: el.networkState,
        readyState: el.readyState,
        currentTime: el.currentTime,
        paused: el.paused,
      });
    };

    // error: 디코드/포맷 실패 / stalled·waiting: 데이터 미수신 버퍼링 / abort: 로딩 중단
    const handlers: ReadonlyArray<readonly [string, () => void]> = [
      ['error', snapshot('[광고 영상 에러]')],
      ['stalled', snapshot('[광고 영상 stalled]')],
      ['waiting', snapshot('[광고 영상 버퍼링]')],
      ['abort', snapshot('[광고 영상 중단]')],
    ];

    handlers.forEach(([event, handler]) => {
      el.addEventListener(event, handler);
    });
    return () => {
      handlers.forEach(([event, handler]) => {
        el.removeEventListener(event, handler);
      });
    };
  }, [src, label]);

  // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 아래 useEffect 전체 삭제
  // 코덱 문제 등으로 error 이벤트 없이 화면만 멈추는(frozen) 경우 감지
  // 재생 중(!paused)인데 timeupdate가 일정 시간 끊기면 currentTime 미진행 → 멈춤으로 기록
  useEffect(() => {
    if (!isActive) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }

    let lastProgressAt = Date.now();
    let stallLogged = false;

    const handleTimeUpdate = () => {
      lastProgressAt = Date.now();
      // 다시 진행되면 다음 멈춤도 잡을 수 있도록 플래그 해제
      stallLogged = false;
    };
    el.addEventListener('timeupdate', handleTimeUpdate);

    const intervalId = setInterval(() => {
      // 일시정지·종료 상태는 정상이므로 제외
      if (el.paused || el.ended) {
        return;
      }
      const sinceProgress = Date.now() - lastProgressAt;
      if (!stallLogged && sinceProgress >= STALL_DETECT_MS) {
        stallLogged = true;
        saveAppLog('[광고 영상 멈춤 의심]', {
          label,
          srcKind: srcKind(src),
          sinceProgressMs: sinceProgress,
          currentTime: el.currentTime,
          readyState: el.readyState,
          networkState: el.networkState,
          errorCode: el.error?.code ?? null,
        });
      }
    }, STALL_POLL_MS);

    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      clearInterval(intervalId);
    };
  }, [isActive, src, label]);

  // 영상은 10초 타이머가 아니라 ended 이벤트를 완료 기준으로 사용
  useEffect(() => {
    // video loop 모드에서는 ended 이벤트가 필요 없어 구독 생략
    if (loopPlayback) {
      return;
    }

    const el = ref.current;
    if (!el) {
      return;
    }

    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('ended', onEnded);
    };
  }, [loopPlayback, onEnded, src]);

  return (
    <S.AdMediaVideo
      ref={ref}
      src={src}
      muted
      playsInline
      loop={loopPlayback}
      poster={AdThumbnailImage}
    />
  );
};

type AdMediaSliderProps = {
  readonly files: readonly IGetMenuAdFile[];
  // 영상은 원본 filePath로 매칭된 다운로드 URL 필요
  readonly localVideoUrls?: Readonly<Record<string, string>>;
  readonly isLooping?: boolean;
  readonly onComplete?: () => void;
};

// 재생 준비가 끝난 광고만 슬라이드 대상으로 사용
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
  localVideoUrls = EMPTY_LOCAL_VIDEO_URLS,
  isLooping = true,
  onComplete,
}: AdMediaSliderProps) => {
  const slides = useMemo(
    () => prepareSlides(files, localVideoUrls),
    [files, localVideoUrls]
  );

  // 이벤트 콜백에서 최신 Swiper, 슬라이드, 타이머, 완료 상태 참조 필요
  const [realIndex, setRealIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const slidesRef = useRef(slides);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompleteRef = useRef(false);

  slidesRef.current = slides;

  // 단일 영상 반복은 빈 슬라이드 이동 없이 영상 자체 반복
  const soleVideoRepeats =
    isLooping && slides.length === 1 && slides[0]?.isVideo === true;

  // 이미지 타이머 중복 등록과 언마운트 후 실행 방지
  const clearImageTimer = useCallback(() => {
    if (imageTimerRef.current !== null) {
      clearTimeout(imageTimerRef.current);
      imageTimerRef.current = null;
    }
  }, []);

  // 이미지 시간 만료나 영상 종료 후 다음 광고로 진행
  const goNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  // 타이머와 영상 이벤트가 겹쳐도 닫힘 콜백 중복 호출 방지
  const complete = useCallback(() => {
    if (isCompleteRef.current) {
      return;
    }
    isCompleteRef.current = true;
    onComplete?.();
  }, [onComplete]);

  // 비반복 마지막 슬라이드는 닫힘, 그 외에는 다음 슬라이드 진행
  const handleSlideComplete = useCallback(() => {
    const slides = slidesRef.current;
    if (slides.length === 0) {
      return;
    }

    const isLastSlide = realIndex >= slides.length - 1;
    if (!isLooping && isLastSlide) {
      complete();
      return;
    }

    if (slides.length > 1) {
      goNext();
    }
  }, [complete, goNext, isLooping, realIndex]);

  // 영상은 재생 종료 시점을 현재 슬라이드 완료 조건으로 사용
  const handleVideoEnded = useCallback(() => {
    if (isLooping && slidesRef.current.length <= 1) {
      return;
    }
    handleSlideComplete();
  }, [handleSlideComplete, isLooping]);

  // 표시 가능한 광고가 줄었을 때 없는 슬라이드 인덱스를 참조하는 문제 방지
  useEffect(() => {
    if (slides.length === 0) {
      return;
    }
    setRealIndex((i) => Math.min(i, slides.length - 1));
  }, [slides.length]);

  // 이전 광고의 완료 잠금 때문에 새 광고의 onComplete가 막히는 문제 방지
  useEffect(() => {
    isCompleteRef.current = false;
  }, [isLooping, slides]);

  // 이미지는 ended 이벤트가 없어 10초 타이머를 완료 기준으로 사용
  useEffect(() => {
    clearImageTimer();
    if (isLooping && slides.length <= 1) {
      return;
    }
    const current = slides[realIndex];
    if (!current || current.isVideo) {
      return;
    }
    imageTimerRef.current = setTimeout(
      handleSlideComplete,
      IMAGE_AUTO_SLIDE_MS
    );
    return clearImageTimer;
  }, [realIndex, slides, handleSlideComplete, isLooping, clearImageTimer]);

  if (slides.length === 0) {
    return null;
  }

  const hasMultipleSlides = slides.length > 1;

  // Swiper loop는 대기 광고에만 필요, 주문완료 광고는 마지막 완료 조건 필요
  return (
    <S.AdSliderViewport>
      <Swiper
        className="ad-media-swiper"
        slidesPerView={1}
        loop={isLooping && hasMultipleSlides}
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
                // TODO: 제거 예정 (영상 재생 실패 추적 로그)
                label={slide.file.fileName}
              />
            ) : (
              <S.AdMediaImage
                src={slide.src}
                alt={slide.file.contentDescription}
                draggable={false}
                // TODO: 제거 예정 (영상 재생 실패 추적 로그) — 아래 onError 제거
                onError={() => {
                  saveAppLog('[광고 이미지 에러]', {
                    fileName: slide.file.fileName,
                    adType: slide.file.adType,
                  });
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </S.AdSliderViewport>
  );
};
