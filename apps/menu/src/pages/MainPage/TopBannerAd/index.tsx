import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { IGetMenuAdFile } from '@repo/api/types';
import * as S from '@/pages/MainPage/TopBannerAd/topBannerAd.style';
import { useAdStore } from '@/stores/useAdStore';
import 'swiper/css';
// TODO: 제거 예정 (상단 배너 미표시 추적 로그) — 제거 시 saveAppLog import 삭제
import { saveAppLog } from '@repo/util/app';

const IMAGE_AUTO_SLIDE_MS = 10000;

/** 이미지 로드 실패 시 캐시 우회 재요청 최대 횟수 */
const MAX_BANNER_IMAGE_RETRY = 2;

// TODO: 제거 예정 (상단 배너 미표시 추적 로그) — 아래 헬퍼 블록 전체
// 배너만 "영역은 있는데 이미지 없음" 재현 시: 이미지가 로드됐는지(naturalWidth)와
// 화면에 실제로 보이는지(getBoundingClientRect)를 함께 찍어 원인을 가른다.
// - naturalWidth 0 + onError → 로드/디코드 실패 (네트워크·CDN·캐시)
// - naturalWidth > 0 인데 renderedW 0 또는 slideHidden=true → Swiper 렌더 문제
const logBannerImageState =
  (fileName: string, filePath: string) =>
  (event: React.SyntheticEvent<HTMLImageElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const slide = el.closest('.swiper-slide');
    const slideRect = slide?.getBoundingClientRect();
    saveAppLog('[상단 배너 이미지 상태]', {
      fileName,
      filePath,
      naturalW: el.naturalWidth,
      naturalH: el.naturalHeight,
      renderedW: Math.round(rect.width),
      renderedH: Math.round(rect.height),
      slideW: slideRect ? Math.round(slideRect.width) : null,
      slideH: slideRect ? Math.round(slideRect.height) : null,
      slideHidden:
        slide?.classList.contains('swiper-slide-invisible-blank') ?? null,
    });
  };

/**
 * 배너 슬라이드 1장.
 * 이미지 로드 실패(onError) 시에만 캐시 우회 URL로 최대 N회 재요청해 자가복구한다.
 * 정상 로드(해피패스)에서는 attempt가 0으로 유지되어 원본 URL을 그대로 사용한다.
 */
const BannerSlideImage = ({ file }: { file: IGetMenuAdFile }) => {
  const [attempt, setAttempt] = useState(0);

  // attempt 0은 원본 URL(해피패스). 재시도 시에만 cb 파라미터로 URL을 바꿔 WebView 캐시를 우회한다.
  const src =
    attempt <= 0
      ? file.filePath
      : `${file.filePath}${file.filePath.includes('?') ? '&' : '?'}cb=${attempt}`;

  return (
    <S.SlideImage
      src={src}
      alt={file.contentDescription}
      draggable={false}
      // TODO: 제거 예정 (상단 배너 미표시 추적 로그) — 제거 시 onLoad 제거
      onLoad={logBannerImageState(file.fileName, file.filePath)}
      onError={() => {
        // TODO: 제거 예정 (상단 배너 미표시 추적 로그) — 제거 시 saveAppLog만 삭제 (setAttempt 유지)
        saveAppLog('[상단 배너 이미지 로드 실패]', {
          fileName: file.fileName,
          filePath: file.filePath,
          attempt,
        });
        // 캐시 오염·일시적 네트워크 실패 자동 복구 (최대 MAX_BANNER_IMAGE_RETRY회)
        setAttempt((prev) => (prev < MAX_BANNER_IMAGE_RETRY ? prev + 1 : prev));
      }}
    />
  );
};

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
          // 초기화 시 컨테이너 폭/위치가 0으로 잡혀 슬라이드가 보이지 않는 케이스 자가복구
          observer
          observeParents
          onSwiper={(swiper) => {
            requestAnimationFrame(() => {
              if (!swiper.destroyed) {
                swiper.update();
              }
            });
          }}
        >
          {files.map((file) => (
            <SwiperSlide key={file.contentSeq}>
              <BannerSlideImage file={file} />
            </SwiperSlide>
          ))}
        </Swiper>
      </S.ImgContainer>
    </S.Wrapper>
  );
};
