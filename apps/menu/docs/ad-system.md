# 광고 시스템 — AI 참조 문서

광고 관련 코드를 읽거나 수정할 때 참조한다.
코드 수정 전 반드시 해당 파일을 직접 읽어 최신 상태를 확인할 것.

---

## 1. 파일 맵

| 역할 | 경로 |
|------|------|
| 광고 API 타입 | `packages/api/src/types/menu.ts` |
| 광고 파일 조회 Query 훅 | `packages/api/src/queries/menu/useGetMenuAdFiles.ts` |
| Query Key | `packages/api/src/queries/queryKeys.ts` — `queryKeys.menu.adFiles(shopCode)` |
| 데이터 로드·영상 다운로드 | `apps/menu/src/hooks/useAdData.ts` |
| 광고 파일 상태 스토어 | `apps/menu/src/stores/useAdStore.ts` |
| 네이티브 광고 저장소·Blob URL 생성 | `packages/util/src/app/AdStorage.ts` (`getAdObjectUrl`) |
| 전면 대기 광고 노출 상태 | `apps/menu/src/stores/useStandbyAdStore.ts` |
| 슬라이더 공통 컴포넌트 | `apps/menu/src/feature/AdMediaSlider/index.tsx` |
| 전면 대기 광고 | `apps/menu/src/pages/MainPage/StandbyAd/index.tsx` |
| 상단 배너 광고 | `apps/menu/src/pages/MainPage/TopBannerAd/index.tsx` |
| 주문완료 전면 광고 | `apps/menu/src/pages/MainPage/OrderCompleteModal/OrderCompleteFullAd.tsx` |
| 주문완료 모달 (FULL/SIDE 분기) | `apps/menu/src/pages/MainPage/OrderCompleteModal/index.tsx` |
| 주문완료 광고 노출 결정 유틸 | `apps/menu/src/pages/MainPage/OrderCompleteModal/orderCompleteAdVisibility.ts` |
| 주문완료 모달 컨테이너 (카운트다운·자동 닫기) | `apps/menu/src/pages/MainPage/OrderCompleteModalContainer/index.tsx` |
| SSE 이벤트 처리 | `apps/menu/src/hooks/useSSEHandler.ts` |

---

## 2. 광고 타입 분류

```ts
// packages/api/src/types/menu.ts
type TGetMenuAdFilesAdType =
  | 'STANDBY_VIDEO'        // 전면 대기 동영상
  | 'STANDBY_IMAGE'        // 전면 대기 이미지
  | 'TOP_BANNER_IMAGE'     // 상단 배너 이미지
  | 'ORDER_COMP_FULL_VIDEO'  // 주문완료 전면 동영상
  | 'ORDER_COMP_FULL_IMAGE'  // 주문완료 전면 이미지
  | 'ORDER_COMP_SIDE_IMAGE'; // 주문완료 사이드 이미지

interface IGetMenuAdFile {
  contentSeq: number;
  campaignSeq: number;
  adType: TGetMenuAdFilesAdType;
  filePath: string;      // 원본 URL (이미지 직접 재생, 영상은 다운로드 후 로컬 URL 사용)
  fileName: string;
  durationSec: number;
  fileSizeKb: number;
  sortOrder: number;     // (미사용) 노출 순서는 sortOrder가 아니라 API 응답 array 순서를 그대로 따른다
  contentDescription: string;
  contentStartDate: string;
  contentEndDate: string;
}
```

| adType | 스토어 필드 | 미디어 | 렌더 컴포넌트 |
|--------|------------|--------|--------------|
| `STANDBY_VIDEO` / `STANDBY_IMAGE` | `standbyFiles` | 영상+이미지 | `StandbyAd` + `AdMediaSlider` |
| `TOP_BANNER_IMAGE` | `topBannerFiles` | 이미지 전용 | `TopBannerAd` (Swiper Autoplay) |
| `ORDER_COMP_FULL_VIDEO` / `ORDER_COMP_FULL_IMAGE` | `orderCompleteFullFiles` | 영상+이미지 | `OrderCompleteFullAd` + `AdMediaSlider` |
| `ORDER_COMP_SIDE_IMAGE` | `orderCompleteSideFiles` | 이미지 전용 | `OrderCompleteModal` 내 `AdMediaSlider` |

---

## 3. 데이터 파이프라인

`useAdData` 훅이 앱 전체 광고 데이터 로드를 담당한다. `apps/menu/src/pages/MainPage/index.tsx`에서 호출된다.

```
0. 앱 세션 최초 1회만 마운트 후 5초 대기 → canFetchAdFiles=true (이후 재진입 시 즉시 true)
       ↓
1. useGetMenuAdFiles(shopCode, enabled: shopCode && canFetchAdFiles) → API 응답 (IGetMenuAdFile[])
       ↓
2. AdStorage.listAds()
   stale 영상 파일 삭제 (API 응답에 없는 filePath의 파일명)
   + 손상 영상 파일 삭제 (API 응답엔 있으나 size === 0인 0바이트 파일)
     → 삭제되어 namesOnDisk에서 빠지므로 아래 3에서 정상 재다운로드됨
       ↓
3. 영상 파일을 STANDBY / ORDER_COMP 두 그룹으로 분리해 단계별·병렬 처리

   ── Phase 1: STANDBY_VIDEO ──────────────────────────────────────────────
   Promise.all(standbyVideoFiles) — 각 파일 병렬 처리:
   ├─ 디스크에 이미 있으면 → registerLocalVideoUrl(filePath, storageName)
   └─ 없으면 → AdStorage.downloadAd({ url, fileName, overwrite: false })
              → registerLocalVideoUrl(filePath, storageName)
       ↓
   Phase 1 완료 → setAdFiles(현재 유효 파일) — standbyFiles·topBannerFiles 등 즉시 반영
               → setAdDataLoading(false)      ← 전면대기 광고 즉시 노출
               → setIsMenuAdFilesLoading(false)

   ── Phase 2: ORDER_COMP_FULL_VIDEO (백그라운드) ─────────────────────────
   Promise.all(orderCompVideoFiles) — 각 파일 병렬 처리:
   ├─ 디스크에 이미 있으면 → registerLocalVideoUrl(filePath, storageName)
   └─ 없으면 → AdStorage.downloadAd(...)
              → registerLocalVideoUrl(filePath, storageName)
       ↓
   Phase 2 완료 → setAdFiles(모든 유효 파일) — orderCompleteFullFiles 최종 반영
       ↓
   AppStorage(AD_FILES 키)에 최종 캐시 저장

   registerLocalVideoUrl(filePath, storageName):
     ├─ 이미 localVideoUrls[filePath]가 blob: URL이면 → 그대로 유지하고 return
     │    (재조회 시 동일 영상의 불필요한 blob 재생성·재생 깜빡임 방지)
     ├─ 1순위: getAdObjectUrl(storageName)
     │    └─ Filesystem.readFile(External/sks_ads/storageName) → base64 → Blob → URL.createObjectURL
     │       (성공 시 setLocalVideoUrl(filePath, blobUrl))
     └─ 폴백: 위 실패(null) 시 → AdStorage.getAdUrl() (_capacitor_file_ URL) → setLocalVideoUrl
```

### Phase 분리 설계 의도

전면대기 광고(`StandbyAd`) 표시에는 `STANDBY_VIDEO`/`STANDBY_IMAGE`만 필요하고
`ORDER_COMP_FULL_VIDEO`는 불필요하다. Phase 1 완료 시점에 로딩을 해제함으로써
주문완료 영상 다운로드가 남아있어도 전면대기 광고를 즉시 노출한다.
주문완료 영상은 Phase 2에서 백그라운드로 계속 다운로드되며, 실제 주문이 완료될 시점에는
이미 준비 완료 상태인 경우가 대부분이다.

### 스토어 상태

```ts
// apps/menu/src/stores/useAdStore.ts
interface IAdStoreData {
  standbyFiles: IGetMenuAdFile[];
  topBannerFiles: IGetMenuAdFile[];
  orderCompleteFullFiles: IGetMenuAdFile[];
  orderCompleteSideFiles: IGetMenuAdFile[];
  localVideoUrls: Record<string, string>; // key: filePath, value: Blob URL(blob:) 또는 폴백 _capacitor_file_ URL
  isLoaded: boolean;       // API 응답 or AppStorage 복원 완료
  isAdDataLoading: boolean; // 영상 다운로드 포함 전체 처리 진행 중
}
```

### AppStorage 캐시

앱 재기동 시 API 응답 전에 이전 데이터로 즉시 렌더링하기 위해 `AD_FILES` 키로 캐시한다.
`isLoaded`가 이미 `true`이면(API가 먼저 응답) 캐시를 덮어쓰지 않는다.
단, `localVideoUrls`(영상 로컬 URL)는 캐시 대상이 아니다 — Blob URL은 세션(프로세스) 한정이므로
재기동 시 비어 있고, API 응답 후 `useAdData`가 다시 등록한다.

### Blob URL 도입 배경과 수명 관리

`_capacitor_file_` 로컬 HTTP 서버로 영상을 스트리밍하면 Range 요청 처리 문제로
`FFmpegDemuxer: data source error`(net::ERR_FAILED) / `PIPELINE_ERROR_READ`가 발생해 재생이 끊긴다.
이를 우회하기 위해 영상 파일 전체를 `Filesystem.readFile`로 읽어 `Blob` → `URL.createObjectURL`로 재생한다.

Blob URL은 메모리에 상주하므로 `useAdStore`가 수명을 직접 관리한다 (`revokeIfObjectUrl`은 `blob:`만 해제):
- `setLocalVideoUrl`: 같은 key를 다른 URL로 교체할 때 이전 Blob URL 해제
- `setAdFiles`: 새 API 응답에 없는 filePath의 Blob URL 해제 후 맵에서 제거
- `clearData`: 보유한 모든 Blob URL 해제 (리셋/로그아웃)

---

## 4. 렌더링 슬롯별 동작

### StandbyAd — 전면 대기 광고

```
isAdDataLoading === true  → null (렌더 안 함)
standbyFiles.length === 0 → null
그 외 → 전체화면 오버레이 표시
  └─ 클릭 시 hideStandbyAd() 호출 → 메뉴 화면으로 전환
```

- `AdMediaSlider`에 `isLooping` prop 미전달 — 기본값 `true`로 무한 반복
- `useStandbyAdStore.openStandbyAd()` 호출 시 다시 표시됨. 호출 위치:
  - `useTouchDetectTimer` — 일정 시간 터치 없으면 자동 재표시
  - `CartReminder` — 장바구니 리마인더 화면에서 비우기 후
  - `applyMenuboardStateAfterTableOrderHistoriesCleared` — 테이블 정리 후
  - `TablesPage` — 테이블 선택 후

### TopBannerAd — 상단 배너 광고

```
isAdDataLoading === true  → null
topBannerFiles.length === 0 → null
그 외 → 상단 배너 영역 표시
```

- `AdMediaSlider`를 사용하지 않음 — Swiper `Autoplay` 모듈 직접 사용
- 이미지 전용 (영상 지원 없음)
- 슬라이드 2장 이상일 때만 `loop` + `Autoplay` 활성화, 단일 슬라이드는 정적 표시
- 전환 간격: 10초 (`delay: 10000`)

### OrderCompleteFullAd — 주문완료 전면 광고

```
showFullscreenAd === true 시 렌더
└─ AdMediaSlider에 isLooping=false, onComplete=onClose 전달
   └─ 마지막 슬라이드 완료(영상 ended or 이미지 10초) → onClose() 호출 → 모달 닫힘
   └─ 클릭 시에도 onClose() 호출
```

### OrderCompleteSide — 주문완료 사이드 광고

```
showHalfAd === true 시 기본 주문완료 모달 내 좌측 절반 영역에 표시
└─ AdMediaSlider에 files만 전달 — isLooping 기본값 true로 무한 반복
└─ 이미지 전용 (ORDER_COMP_SIDE_IMAGE), localVideoUrls 미전달
```

---

## 5. AdMediaSlider 슬라이드 진행 로직

```ts
// apps/menu/src/feature/AdMediaSlider/index.tsx

// 재생 소스 준비
prepareSlides(files, localVideoUrls)
  └─ 영상(STANDBY_VIDEO, ORDER_COMP_FULL_VIDEO): localVideoUrls[filePath] 없으면 slides에서 제외
  └─ 이미지: filePath 그대로 사용

// 슬라이드 진행
이미지 슬라이드 활성화
  → setTimeout(handleSlideComplete, 10000)  // 이미지에는 ended 이벤트 없음

영상 슬라이드 활성화
  → video ended 이벤트 → handleVideoEnded() → handleSlideComplete()

handleSlideComplete()
  ├─ !isLooping && 마지막 슬라이드 → complete() → onComplete?.()
  └─ 그 외 → swiperRef.current.slideNext()

// 단일 영상 + isLooping 특수케이스
soleVideoRepeats = isLooping && slides.length === 1 && slides[0].isVideo
  → <video loop> 속성 사용, Swiper 이동 없음, handleVideoEnded() 구독 안 함
```

### 영상 디코더 관리 (OOM 방지) — VideoSlide

모든 슬라이드의 `<video>`는 DOM에 동시에 mount되지만, **`src`는 활성 슬라이드에만 명령형으로 부착**한다.
`<video>`에 `src`를 박아두면(특히 재생되면) Android WebView가 MediaCodec 디코더와 프레임 버퍼를
잡는데, 7개 같은 다수 영상에 모두 src를 유지하면 디코더가 누적돼 저사양 태블릿에서 **네이티브 OOM으로
앱이 강제 종료**된다(이전에 6번째 영상 재생 중 크래시 발생).

```
isActive  → src 미부착 시 el.src = src; el.load() → currentTime=0 → play()
!isActive → el.pause(); el.removeAttribute('src'); el.load()
            (removeAttribute만으로는 디코더가 해제되지 않아 load() 필수)
```

→ 한 시점에 디코더를 쥐는 영상은 활성 1개뿐. JSX에는 `src`를 두지 않고 위 useEffect가 단독 통제한다.

### 첫 프레임 poster 캡처

디코더가 해제된 비활성 영상은 보여줄 프레임이 없어 `poster`만 표시된다. 기본 썸네일(`AdThumbnailImage`)
대신 **각 영상의 첫 프레임을 1회 캡처해 그 영상의 poster로 사용**하면, 디코더 해제 상태에서도(좌/우 이동·idle)
자기 첫 화면이 보이고 재생 시작도 frame 0에서 이어져 깜빡임이 없다.

```
loadeddata(첫 프레임 준비) → requestAnimationFrame(재생 시작 프레임 비차단)
  → canvas.drawImage(video) → toDataURL('image/jpeg', 0.85)
  → onCaptureFirstFrame(contentSeq, dataUrl)

부모(AdMediaSlider): posters: Record<contentSeq, dataUrl> 상태로 보관
  → poster={posters[contentSeq] ?? AdThumbnailImage}
  → posterCaptured(=이미 캡처됨)이면 재캡처 생략
```

- **매핑은 오직 `contentSeq` 기준** — 캡처가 다른 영상 poster로 섞일 수 없다.
- **저장은 메모리 한정** — `useState`라 컴포넌트 언마운트(광고 닫힘) 시 GC, 디스크 미사용(용량 영향 0).
- **해상도** — 원본 그대로 캡처(`Math.min(1, 1920 / videoWidth)`), 과대 소스(예: 4K)만 가로 1920px로 제한.

---

## 6. 주문완료 광고 노출 결정

```ts
// apps/menu/src/pages/MainPage/OrderCompleteModal/orderCompleteAdVisibility.ts

shouldShowOrderCompleteFullscreenAd(fullFiles, sideFiles): boolean
  // groupAdFiles에서 FULL/SIDE 중 array에 먼저 등장하는 유형만 채워지므로
  // FULL 파일이 존재하면(= array에서 FULL이 먼저) 전면 광고만 표시
  → true이면 전면 광고만 표시

shouldShowOrderCompleteHalfAd(fullFiles, sideFiles): boolean
  // !fullscreen AND SIDE 파일 존재
  → true이면 기본 모달 내 사이드 광고 표시

shouldShowOrderCompleteCountdown(fullFiles, sideFiles): boolean
  // !fullscreen (반쪽 광고·기본 완료 화면)
  → true이면 20초 카운트다운 + 자동 닫힘 활성화
```

세 함수는 `orderCompleteAdVisibility.ts`에 정의되어 있으며, `OrderCompleteModalContainer`에서 호출된다.
카운트다운 타이머(20초, 1초 단위 감소)와 자동 닫기(`handleClose`) 로직도 `OrderCompleteModalContainer`에 있다.
`OrderCompleteModal`은 `countdownActive`, `countdown` 값을 props로 받기만 하는 presentational 컴포넌트다.

FULL과 SIDE가 동시에 존재할 때는 API 응답 array에서 먼저 등장하는 타입만 표시하고 다른 타입은 `groupAdFiles`에서 제외한다.
FULL과 SIDE를 동시에 표시하는 경우는 없다.

---

## 7. SSE 연동

```
SSE 'AD_MENU' 메시지 수신 (useSSEHandler.ts > handleAdMenuMessage)
  ├─ queryClient.refetchQueries(queryKeys.menu.adFiles(shopCode))
  │    └─ useAdData의 useEffect가 apiData 변경을 감지 → 파이프라인 3번부터 재실행
  └─ handleMenuMessage()
       └─ 메뉴(카테고리) 데이터 갱신 + 장바구니 동기화 + 다이얼로그 닫기
```

`AD_MENU`는 광고 파일과 메뉴 데이터를 동시에 갱신하는 이벤트다.
광고만 단독으로 갱신하는 SSE 타입은 없다.

---

## 8. 주의사항

- **영상 재생 소스:** 영상은 `filePath`(원본 URL)가 아니라 `localVideoUrls[filePath]`로 재생한다. 이 값은 1순위로 `getAdObjectUrl`이 만든 **Blob URL(`blob:`)**, 실패 시 폴백으로 `_capacitor_file_` 로컬 URL이다. `localVideoUrls`에 등록되지 않은 영상은 `prepareSlides`에서 제외되므로 슬라이드에 나타나지 않는다.

- **Blob URL 수명 관리(메모리 누수 방지):** Blob URL은 세션 한정 메모리 리소스다. `useAdStore`가 `setLocalVideoUrl`(교체 시)·`setAdFiles`(제거 시)·`clearData`(리셋 시)에서 `URL.revokeObjectURL`로 해제한다. SSE `AD_MENU` 반복 갱신 시에도 동일 영상은 `registerLocalVideoUrl`의 `blob:` 가드로 재생성하지 않아 누수와 재생 깜빡임이 없다.

- **TopBannerAd는 AdMediaSlider를 사용하지 않는다:** Swiper `Autoplay` 모듈을 직접 사용하며 영상을 지원하지 않는다. 영상 지원이 필요하면 `AdMediaSlider`로 교체해야 한다.

- **`isAdDataLoading` 플래그:** Phase 1(STANDBY) 처리 중에 `true`다. Phase 1 완료 시 `false`로 전환되며, 이후 Phase 2(ORDER_COMP)는 백그라운드에서 진행된다. `StandbyAd`와 `TopBannerAd`는 이 값이 `true`인 동안 렌더링하지 않는다. `OrderCompleteModal`은 이 플래그를 직접 참조하지 않는다.

- **FULL/SIDE 동시 표시 없음:** API 응답 array에 FULL/SIDE가 모두 있을 때 `groupAdFiles`가 먼저 등장하는 유형만 채우고 다른 유형 배열은 비운다(`[]`). 따라서 두 슬롯이 동시에 표시되는 경우는 없으며, 노출 순서는 sortOrder가 아니라 array 순서를 따른다.

- **0바이트 손상 캐시 자동 복구:** 다운로드 중단 등으로 0바이트로 남은 영상 파일은 파일명만으로 캐시 적중 처리되면 `getAdObjectUrl`의 Blob 생성이 실패(빈 데이터)하고 `_capacitor_file_` 폴백마저 재생 불가(`MEDIA_ERR_SRC_NOT_SUPPORTED`)가 되어 슬라이드가 그 영상에서 멈춘다. 이를 막기 위해 `removeStaleAdVideos`가 `listAds()`의 `size === 0` 파일을 stale과 함께 삭제하고, 다음 로드 사이클에서 정상 재다운로드한다. (`size`가 undefined이거나 정상 크기인 파일은 삭제 대상이 아니다)

- **`localVideoUrls`의 key는 `filePath`:** `fileName`이 아니다. `AdStorage`에 저장된 파일명(`storageName`)은 `filePath`의 마지막 경로 세그먼트이며, `localVideoUrls`의 key는 전체 `filePath` URL이다.

- **카운트다운은 전면 광고가 아닐 때만:** `shouldShowOrderCompleteCountdown`이 `true`인 경우(FULL 전면 광고 비표시)에만 20초 카운트다운과 자동 닫힘이 활성화된다. 전면 광고 표시 중에는 광고 재생 완료 또는 클릭으로만 닫힌다.
