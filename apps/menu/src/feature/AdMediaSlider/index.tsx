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
  // 디코더 해제 후 표시할 poster — 캡처된 첫 프레임 또는 기본 썸네일
  readonly poster: string;
  // 이 영상의 첫 프레임이 이미 캡처되었는지 (true면 재캡처 생략)
  readonly posterCaptured: boolean;
  // 첫 프레임 캡처 시 부모에 전달할 식별자(contentSeq)
  readonly captureKey: number;
  readonly onCaptureFirstFrame: (key: number, dataUrl: string) => void;
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
  poster,
  posterCaptured,
  captureKey,
  onCaptureFirstFrame,
  loopPlayback,
  onEnded,
  label,
}: VideoSlideProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  // 활성 슬라이드만 src를 붙여 디코딩하고, 비활성은 src를 떼어 디코더/버퍼를 해제한다.
  // (모든 영상에 src를 물려두면 디코더가 누적돼 저사양 기기에서 OOM으로 앱이 종료된다)
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    if (isActive) {
      // src 미부착(비활성→활성 전환) 시에만 로드 — 이미 같은 src면 불필요한 리로드 방지
      if (el.getAttribute('src') !== src) {
        el.src = src;
        el.load();
      }
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
      // src 제거 + load()로 디코더와 버퍼를 즉시 해제 (currentTime=0만으로는 해제되지 않음)
      el.removeAttribute('src');
      el.load();
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

  // 첫 프레임을 한 번 캡처해 poster로 사용한다.
  // 디코더는 활성 영상에만 살아 있으므로(메모리 제약), 해제된 영상도 자기 첫 화면을
  // 보여주려면 그 프레임을 이미지로 떠 둬야 한다. poster가 곧 첫 프레임이라 재생 시작도 매끄럽다.
  useEffect(() => {
    if (posterCaptured) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }

    let rafId = 0;

    const capture = () => {
      // 인코딩(toDataURL)이 재생 시작 프레임을 막지 않도록 다음 프레임으로 미룬다
      if (rafId) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (el.videoWidth === 0 || el.videoHeight === 0) {
          return;
        }
        // 영상과 동일한 선명도를 위해 원본 해상도로 캡처(축소 안 함).
        // 과대 소스(예: 4K)만 가로 1920px로 제한해 인코딩 비용 폭주 방지.
        const scale = Math.min(1, 1920 / el.videoWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(el.videoWidth * scale);
        canvas.height = Math.round(el.videoHeight * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }
        try {
          ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
          onCaptureFirstFrame(captureKey, canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          // _capacitor_file_ 폴백 등으로 canvas가 오염되면 캡처 불가 → 기본 poster 유지
        }
      });
    };

    el.addEventListener('loadeddata', capture);
    // 이미 첫 프레임이 준비된 경우 이벤트를 놓칠 수 있어 즉시 한 번 시도
    if (el.readyState >= 2) {
      capture();
    }
    return () => {
      el.removeEventListener('loadeddata', capture);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [posterCaptured, captureKey, onCaptureFirstFrame]);

  // src는 위 useEffect가 활성 슬라이드에만 명령형으로 붙인다.
  // 비활성(디코더 해제) 상태에서는 poster(캡처된 첫 프레임)만 표시된다.
  return (
    <S.AdMediaVideo
      ref={ref}
      muted
      playsInline
      loop={loopPlayback}
      poster={poster}
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

  // 영상별 캡처된 첫 프레임 poster (key: contentSeq) — 디코더 해제 후 첫 화면 표시용
  const [posters, setPosters] = useState<Record<number, string>>({});
  const handleCaptureFirstFrame = useCallback((key: number, dataUrl: string) => {
    // 영상당 1회만 저장 (이미 있으면 동일 객체 반환해 불필요한 리렌더 방지)
    setPosters((prev) => (prev[key] ? prev : { ...prev, [key]: dataUrl }));
  }, []);

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
                poster={posters[slide.file.contentSeq] ?? AdThumbnailImage}
                posterCaptured={!!posters[slide.file.contentSeq]}
                captureKey={slide.file.contentSeq}
                onCaptureFirstFrame={handleCaptureFirstFrame}
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
