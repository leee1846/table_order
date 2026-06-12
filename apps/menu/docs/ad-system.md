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
       ↓
3. 영상 파일(STANDBY_VIDEO, ORDER_COMP_FULL_VIDEO)만 반복
   ├─ 디스크에 이미 있으면 → AdStorage.getAdUrl() → setLocalVideoUrl(filePath, url)
   └─ 없으면 → AdStorage.downloadAd({ url, fileName, overwrite: false })
              → AdStorage.getAdUrl() → setLocalVideoUrl(filePath, url)
       ↓
4. 유효 파일만 필터링
   └─ 영상: localVideoUrls[filePath]가 등록된 것만
   └─ 이미지: filePath가 존재하는 것만
       ↓
5. setAdFiles(validFiles)
   └─ adType별로 groupAdFiles() → sortOrder 무시, API 응답 array 순서 그대로 유지
   └─ ORDER_COMP FULL/SIDE가 모두 있으면 array에서 먼저 등장하는 유형만 남기고 다른 유형은 제외
   └─ AppStorage(AD_FILES 키)에 캐시 저장
       ↓
6. setAdDataLoading(false) → StandbyAd / TopBannerAd 렌더 허용
```

### 스토어 상태

```ts
// apps/menu/src/stores/useAdStore.ts
interface IAdStoreData {
  standbyFiles: IGetMenuAdFile[];
  topBannerFiles: IGetMenuAdFile[];
  orderCompleteFullFiles: IGetMenuAdFile[];
  orderCompleteSideFiles: IGetMenuAdFile[];
  localVideoUrls: Record<string, string>; // key: filePath, value: AdStorage 로컬 URL
  isLoaded: boolean;       // API 응답 or AppStorage 복원 완료
  isAdDataLoading: boolean; // 영상 다운로드 포함 전체 처리 진행 중
}
```

### AppStorage 캐시

앱 재기동 시 API 응답 전에 이전 데이터로 즉시 렌더링하기 위해 `AD_FILES` 키로 캐시한다.
`isLoaded`가 이미 `true`이면(API가 먼저 응답) 캐시를 덮어쓰지 않는다.

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
  → 영상 전환 시 이전 영상 pause() + currentTime = 0, 새 영상 currentTime = 0 → play()

handleSlideComplete()
  ├─ !isLooping && 마지막 슬라이드 → complete() → onComplete?.()
  └─ 그 외 → swiperRef.current.slideNext()

// 단일 영상 + isLooping 특수케이스
soleVideoRepeats = isLooping && slides.length === 1 && slides[0].isVideo
  → <video loop> 속성 사용, Swiper 이동 없음, handleVideoEnded() 구독 안 함
```

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

- **영상 재생 소스:** 영상은 `filePath`(원본 URL)가 아니라 `localVideoUrls[filePath]`(로컬 URL)로 재생한다. `localVideoUrls`에 등록되지 않은 영상은 `prepareSlides`에서 제외되므로 슬라이드에 나타나지 않는다.

- **TopBannerAd는 AdMediaSlider를 사용하지 않는다:** Swiper `Autoplay` 모듈을 직접 사용하며 영상을 지원하지 않는다. 영상 지원이 필요하면 `AdMediaSlider`로 교체해야 한다.

- **`isAdDataLoading` 플래그:** 영상 다운로드가 진행 중인 동안 `true`다. `StandbyAd`와 `TopBannerAd`는 이 값이 `true`인 동안 렌더링하지 않는다. `OrderCompleteModal`은 이 플래그를 직접 참조하지 않는다.

- **FULL/SIDE 동시 표시 없음:** API 응답 array에 FULL/SIDE가 모두 있을 때 `groupAdFiles`가 먼저 등장하는 유형만 채우고 다른 유형 배열은 비운다(`[]`). 따라서 두 슬롯이 동시에 표시되는 경우는 없으며, 노출 순서는 sortOrder가 아니라 array 순서를 따른다.

- **`localVideoUrls`의 key는 `filePath`:** `fileName`이 아니다. `AdStorage`에 저장된 파일명(`storageName`)은 `filePath`의 마지막 경로 세그먼트이며, `localVideoUrls`의 key는 전체 `filePath` URL이다.

- **카운트다운은 전면 광고가 아닐 때만:** `shouldShowOrderCompleteCountdown`이 `true`인 경우(FULL 전면 광고 비표시)에만 20초 카운트다운과 자동 닫힘이 활성화된다. 전면 광고 표시 중에는 광고 재생 완료 또는 클릭으로만 닫힌다.
