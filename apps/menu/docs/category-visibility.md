# 카테고리 노출 — AI 참조 문서

카테고리 노출 조건·상태 관리·SSE 갱신을 수정할 때 참조한다.
코드 수정 전 반드시 해당 파일을 직접 읽어 최신 상태를 확인할 것.

---

## 1. 파일 맵

| 역할 | 경로 |
|------|------|
| 상태 저장소 | `apps/menu/src/stores/useCategoryStore.ts` |
| 노출 조건 오케스트레이션 | `apps/menu/src/hooks/useCategoryVisibilityManager.ts` (MainPage에서만 호출) |
| 판매 조건 계산 | `apps/menu/src/utils/category.ts` |
| 데이터 로드 & 분류 | `apps/menu/src/hooks/useCategoriesData.ts` |
| SSE MENU 핸들러 | `apps/menu/src/hooks/useSSEHandler.ts` (line 477) |
| API 쿼리 훅 | `packages/api/src/queries/category/useGetCategoriesWithMenus.ts` |

---

## 2. 상태 구조

```ts
// useCategoryStore.ts
interface ICategoryStore {
  data: {
    categories: ICategoryWithMenus[] | null;  // 전체 목록 (AppStorage에도 저장)
    visibilityMap: Record<number, boolean>;   // categorySeq → 노출 여부
    visibleCategories: ICategoryWithMenus[];  // 자동 계산, 직접 수정 불가
  };
  setCategoriesAsync({ categories }): Promise<boolean>;
  updateAllVisibility(visibilityMap): void;
  clearData(): void;
}
```

**`visibleCategories` 자동 계산 규칙 (`computeVisibleCategories`):**

```ts
// 1순위: category.isHidden === true → 숨김
// 2순위: visibilityMap[categorySeq] === false → 숨김
// 그 외: 표시 (visibilityMap에 키가 없어도 표시)
```

`updateAllVisibility()`를 호출하면 `visibleCategories`가 즉시 재계산된다.
`visibleCategories`를 직접 set하는 코드를 작성하면 안 된다.

---

## 3. 카테고리 노출 조건

### 판매 조건 판정 흐름

```ts
// utils/category.ts
checkCategorySaleStatus(condition: ICategorySaleCondition): ICategorySaleStatus
// { isAvailable: boolean, nextChangeMs: number | null }
```

**판정 순서:**

```
① saleStartTime === '0000' && saleEndTime === '0000'
  → "상시" 취급 (시간 제약 없음으로 처리)

② detectAfterMidnightSlot() — 자정 넘김 구간 판단 (아래 4절 참고)
  true → dayCheckTime = subtractDays(currentTime, 1)  // 전날 기준으로 요일 판단
  false → dayCheckTime = currentTime

③ checkSaleDay(useSaleDay, saleDayOfWeek, isSaleOnHoliday, dayCheckTime, isHoliday)
  !useSaleDay                          → 매일 판매 (다음 단계로)
  isHoliday && !isSaleOnHoliday        → false (공휴일 판매 불가)
  !saleDayOfWeek || length === 0       → false
  dayCheckTime의 요일이 saleDayOfWeek에 없으면 → false

④ !hasValidSaleTime
  → { isAvailable: true, nextChangeMs: getTimeUntilMidnight() }

⑤ isWithinSaleTime(saleStartTime, saleEndTime, currentTime)
  → { isAvailable: boolean, nextChangeMs: Math.min(timeChangeMs, midnightMs) }
```

**`saleDayOfWeek` 값:** 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토

---

## 4. 자정 넘김 처리

판매 시간이 자정을 넘기는 경우 (`saleStartTime > saleEndTime`, 예: `'2100'~'0300'`):

```
현재 01:30 (화요일)
  ↓
detectAfterMidnightSlot('2100', '0300', currentTime)
  startTotalMin(1260) > endTotalMin(180) → 자정 넘김 구간
  currentTotalMin(90) < endTotalMin(180) → true (전날 세션의 새벽 구간)
  ↓
dayCheckTime = subtractDays(currentTime, 1)  // 월요일
  ↓
요일 판정을 월요일 기준으로 수행
```

`detectAfterMidnightSlot`이 `false`이면 기존 당일 기준으로 판정한다.

---

## 5. 타이머 자동 갱신

`useCategoryVisibilityManager`가 전체 카테고리 중 **가장 빠른** `nextChangeMs`를 골라 타이머를 등록한다.

```ts
globalTimerManager.setTimeout(
  TIMER_KEYS.CATEGORY_VISIBILITY_UPDATE,
  () => updateCategoryVisibility(),  // 재귀 호출 → 다시 visibilityMap 재계산 후 다음 타이머 등록
  earliestNextChangeMs
)

// cleanup (categories 변경 또는 언마운트 시)
cancelled = true;
globalTimerManager.clear(TIMER_KEYS.CATEGORY_VISIBILITY_UPDATE);
```

`cancelled` 플래그로 언마운트 후 응답이 돌아온 경우를 방어한다.

---

## 6. 공휴일 캐시

```ts
// AppStorage key: STORAGE_KEYS.HOLIDAY_DAY_CACHE
type HolidayDayCache = {
  fetchedDateKey: string;  // 'YYYY-MM-DD'
  isHoliday: boolean;
};
// fetchedDateKey === getTodayDateString() 이면 캐시 유효
// 날짜가 다르면 API 재호출 후 새 캐시 저장 (isTemporary: true)
```

공휴일 API (`useGetHolidays`)는 `enabled: false`로 마운트하고 `refetch()`로만 호출한다.

---

## 7. 데이터 로드 & 카테고리 분류

```ts
// useCategoriesData.ts
const { staffCallCategory, nonStaffCallCategories, firstOrderRequiredCategories, refresh } =
  useCategoriesData({ skipInitialRequest?: boolean });
```

**분류 기준 (모두 `visibleCategories` 기준):**

| 반환값 | 조건 |
|--------|------|
| `staffCallCategory` | `isStaffCall === true`인 첫 번째 카테고리 |
| `nonStaffCallCategories` | `!isStaffCall` |
| `firstOrderRequiredCategories` | `isFirstOrderRequired === true` |

**API 호출 조건:** `!storeData && !!shopCode && !!tableNumber && !skipInitialRequest`
- `storeData`가 이미 있으면 API를 호출하지 않는다.
- `skipInitialRequest: true`면 `refresh()`를 직접 호출해야 갱신된다 (SSE 수신 시 패턴).

**`refresh()`:**
```ts
const result = await refetch();
if (result.data?.data) {
  await setCategoriesAsync({ categories: result.data.data });
  // setCategoriesAsync 이후 useCategoryVisibilityManager가 자동으로 재실행됨
}
return result.data?.data;
```

---

## 8. SSE MENU 이벤트

```
SSE { type: 'MENU' } 수신
  ↓
handleMenuMessage()
  ↓
현재 경로가 /tables/:tableNum 인지 확인 (isTableDetailPage)
  ↓
[테이블 상세 페이지]                    [메인 메뉴판 페이지]
queryClient.refetchQueries(             refreshTableOrderHistoriesData()  ← 병렬
  category.menuboardList(               refreshCategoriesData()
    shopCode, tableNum                    ↓ categories 갱신 완료 후
  )                                     장바구니 동기화:
useAddMenuDialogStore                     cartMenus.forEach(cartMenu =>
  .getState().requestClose()              categories.flatMap(menuInfoList)
                                          .find(m => m.menuSeq === cartMenu.menuSeq)
                                          → menuName, menuPrice, localeMenuName 갱신
                                          → selectedOptions의 name/price/localeName 갱신
                                          → quantity는 유지
                                          → 변경된 경우에만 updateCartItem()
                                        )
  ↓                                     ↓
useModalStore.getState().closeMenuDetail()
toast('메뉴정보가 업데이트 되었습니다.', { position: 'center-center', duration: 1500 })
```

**같은 로직을 재사용하는 이벤트:**

| SSE 이벤트 | 처리 |
|-----------|------|
| `MENU` | `handleMenuMessage()` |
| `AD_MENU` | 로그인 페이지면 조기 반환. 그 외: 광고 파일 재조회 + `handleMenuMessage()` |
| `POS_SYNC_END` | `handleTableMessage()` → `handleMenuMessage()` → `refreshShopDetailData()` → 루트 경로면 `closeAllModals/closeAllDialogs()` |

---

## 9. 주의사항

- **`visibleCategories` 직접 수정 금지** — `updateAllVisibility()`를 호출해야 자동 재계산된다.
- **`'0000'~'0000'`은 "상시"** — 시간 제약 없음으로 처리되며 `hasValidSaleTime === false`가 된다.
- **자정 넘김 구간에서 요일 판정** — `21:00~03:00` 설정에서 화요일 01:30은 월요일 기준으로 요일을 판정한다.
- **공휴일 캐시는 하루 1회** — 자정이 넘어도 앱 재시작 전까지 캐시가 남아있을 수 있다. `fetchedDateKey`가 오늘 날짜와 다를 때만 API를 재호출한다.
- **`useCategoryVisibilityManager`는 `MainPage`에서만 동작** — MainPage가 언마운트되면 타이머가 정리되고 재판정이 멈춘다.
- **`staffCallCategory`는 `visibleCategories` 기반** — `categories` 전체가 아니라 노출된 카테고리 중에서만 찾는다.
- **테이블 상세 페이지 분기** — `isTableDetailPage`일 때 `refreshCategoriesData()`를 호출하지 않는다. `queryClient.refetchQueries()`로 해당 쿼리만 갱신한다.
- **장바구니 동기화 범위** — `menuName`, `menuPrice`, `localeMenuName`, 옵션의 `name/price/localeName`만 갱신. `quantity`와 선택 옵션 구성은 유지.
