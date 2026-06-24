# 관리자 모드 접근 인증 — AI 참조 문서

관리자 비밀번호 입력, `menuboardToken` 관리, 라우트 보호, API 헤더 주입, 만료·재노출 흐름을 수정할 때 참조한다.
코드 수정 전 반드시 해당 파일을 직접 읽어 최신 상태를 확인할 것.

---

## 1. 파일 맵

| 역할                            | 경로                                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 비밀번호 입력 UI                | `apps/menu/src/pages/MainPage/AdminAccessPasswordModal/index.tsx`                                          |
| 토큰 저장·조회·삭제             | `apps/menu/src/feature/MenuboardAuth/menuboardTokenStorage.ts`                                             |
| 보호 API URL 판별               | `apps/menu/src/feature/MenuboardAuth/menuboardProtectedEndpoints.ts`                                       |
| menuboard 토큰 만료 에러 판별   | `apps/menu/src/feature/MenuboardAuth/menuboardAuthError.ts`                                                |
| MenuboardAuth 공개 API          | `apps/menu/src/feature/MenuboardAuth/index.ts`                                                             |
| 모달 노출 Zustand 스토어        | `apps/menu/src/stores/useRequestAdminAccessModalStore.ts`                                                  |
| 메인 페이지 자동 노출 제어      | `apps/menu/src/hooks/useAdminAccessControl.ts`                                                             |
| 라우트 보호·토큰 제거           | `apps/menu/src/router.tsx`                                                                                 |
| axios 인터셉터 (헤더·만료 처리) | `apps/menu/src/config/api/privateApi.ts`                                                                   |
| 전역 모달 마운트                | `apps/menu/src/App.tsx`                                                                                    |
| 로고 3연타 수동 진입            | `apps/menu/src/pages/MainPage/Header/index.tsx`                                                            |
| 메인 페이지 연동                | `apps/menu/src/pages/MainPage/index.tsx`                                                                   |
| 테이블 삭제 SSE → 모달          | `apps/menu/src/hooks/useSSEHandler.ts`                                                                     |
| 테이블 없음(-101) → 모달        | `apps/menu/src/hooks/useTableOrderHistoriesData.ts`                                                        |
| 홈 복귀 시 모달 숨김            | `apps/menu/src/pages/TablesPage/Sidebar/index.tsx`, `apps/menu/src/pages/settings/SidebarLayout/index.tsx` |
| 로그아웃 시 토큰 정리           | `apps/menu/src/utils/auth.ts` (`clearAuthData`)                                                            |
| 관리자 로그인 API fetcher       | `packages/api/src/fetchers/auth.ts` — `loginMenuboardAdmin`                                                |
| 관리자 로그인 mutation 훅       | `packages/api/src/queries/auth/usePostLoginMenuboardAdmin.ts`                                              |
| 응답 타입                       | `packages/api/src/types/auth.ts` — `ILoginMenuboardAdminData`                                              |

---

## 2. 이중 인증 구조

메뉴보드 앱은 **두 종류의 토큰**을 사용한다. 혼동하면 라우트·인터셉터 수정 시 버그가 난다.

| 토큰                           | 저장소                                  | 발급 시점                                      | 용도                                                                                   |
| ------------------------------ | --------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `accessToken` / `refreshToken` | `@repo/api/auth` (local 등)             | `LoginPage` 매장 로그인                        | 앱 전체 JWT 인증. `privateApi` request interceptor가 `Authorization: Bearer` 주입·갱신 |
| `menuboardToken`               | `sessionStorage` (`menuboard-token` 키) | `AdminAccessPasswordModal` 4자리 비밀번호 성공 | 관리자 모드 전용. 보호 API에 `X-Menuboard-Token` 헤더로 전달                           |

- `menuboardToken`은 JWT access token과 **독립**이다. access token 갱신과 무관하게 별도 만료·재입력 흐름을 가진다.
- `menuboardToken`은 **session storage**만 사용한다. 탭/세션 종료 시 사라진다.

```ts
// menuboardTokenStorage.ts
getMenuboardToken(): string | null
setMenuboardToken(token: string): boolean
removeMenuboardToken(): void
```

---

## 3. 라우트 보호 계층

```
/login                          → authCheckerLoader 없음
/                               → authCheckerLoader만 (access token 필요)
/tables, /tables/:id, /settings/* → authCheckerLoader + adminVerificationCheckLoader
```

```ts
// router.tsx
authCheckerLoader: getAccessToken() 없으면 → redirect /login
adminVerificationCheckLoader: getMenuboardToken() 없으면 → redirect /
```

**`/`(메인)은 menuboardToken 없이 접근 가능**하다. 고객 주문 화면이기 때문이다.
관리자 페이지 진입 시 토큰이 없으면 ROOT로 보내고, `useAdminAccessControl`이 `tableNumber` 없을 때 비밀번호 모달을 띄운다.

### menuboardToken 자동 제거

```ts
// router.tsx — router.subscribe, navigation.state === 'idle' 일 때
if (targetPath === ROUTES.LOGIN.path || targetPath === ROUTES.ROOT.path) {
  removeMenuboardToken();
}
```

- 메인(`/`) 또는 로그인(`/login`)으로 이동하면 **항상** menuboardToken이 삭제된다.
- 관리자 페이지에서 모달 닫기(×) 시 `navigate(ROUTES.ROOT)` → 토큰 제거 + 메인 복귀.
- `clearAuthData()`(JWT 만료·로그아웃)에서도 `removeMenuboardToken()` 호출.

---

## 4. 비밀번호 모달 노출·숨김

### 전역 렌더

`useRequestAdminAccessModalStore.show`가 `true`이면 `App.tsx`가 `AdminAccessPasswordModal`을 **라우트와 무관하게** 오버레이로 렌더한다.

```ts
// useRequestAdminAccessModalStore.ts
{ show: boolean; setShow(show: boolean): void }
```

### 모달을 `setShow(true)` 하는 경로

| 트리거                 | 조건                                                       | 파일                                           |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| 테이블 미선택          | `deviceData.tableNumber` 없음 (디바이스 초기화 완료 후)    | `useAdminAccessControl.ts`                     |
| 디바이스 404           | `deviceDataError.status === 404` → `clearDeviceData()` 후  | `useAdminAccessControl.ts`                     |
| 테이블 삭제(로컬 검증) | `tableGroupData`에 현재 `tableNumber` 없음                 | `useAdminAccessControl.ts`, `useSSEHandler.ts` |
| 주문 내역 API -101     | 존재하지 않는 테이블 → `tableNumber: null` 후              | `useTableOrderHistoriesData.ts`                |
| menuboard 토큰 만료    | `privateApi` 403 + `-107` (비밀번호 UI 미노출 시)          | `privateApi.ts`                                |
| 로고 3연타             | 메인 헤더 로고 600ms 내 3회 클릭                           | `MainPage/Header/index.tsx`                    |
| 수동 호출              | `adminAccessControl.setShowAdminAccessPasswordModal(true)` | `MainPage/index.tsx`                           |

### 모달을 `setShow(false)` 하는 경로

| 트리거                                          | 파일                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 유효한 `tableNumber` 확정                       | `useAdminAccessControl.ts`                                                                      |
| 로그인 성공 후 500ms 지연                       | `AdminAccessPasswordModal` — `TIMER_KEYS.ADMIN_ACCESS_MODAL_HIDE`                               |
| 비밀번호 잠금(-104) + 메인 + `tableNumber` 있음 | `AdminAccessPasswordModal` (모달만 닫고 주문 화면 유지)                                         |
| 홈 버튼(관리자 사이드바)                        | `TablesPage/Sidebar`, `settings/SidebarLayout` — **navigate 전** `setShow(false)` (깜빡임 방지) |
| 스토어 리셋                                     | `resetStores.ts`                                                                                |

### useAdminAccessControl 깜빡임 방지

- `isDeviceDataInitialized`가 `false`이면 모달을 띄우지 않는다.
- `prevTableNumberRef`로 `tableNumber` **실제 변경** 시에만 분기한다.

---

## 5. 비밀번호 입력·로그인 플로우

```
4자리 키패드 입력 (PASSWORD_MAX_LENGTH = 4)
  → handlePasswordComplete(pw)
  → POST /login/menuboard?shopCode=&pw=  (usePostLoginMenuboardAdmin)
  → 성공 시 setMenuboardToken(menuboardToken)
  → pathname === '/' 이면 navigate('/tables')
     아니면 queryClient.refetchQueries({ type: 'active' })
  → 500ms 후 setShow(false)  // 페이지 전환 중 모달 깜빡임 방지
```

### API 호출 설정

```ts
// AdminAccessPasswordModal
usePostLoginMenuboardAdmin({
  ignoreGlobalErrors: [401],  // 틀린 비밀번호는 컴포넌트 onError에서 처리
  options: { onError: ... },
});
```

- `loginMenuboardAdmin`은 `getAxiosInstance('private')` 사용 → JWT는 자동 첨부, menuboard 로그인 URL 자체는 `ADMIN_API_LIST`에 없으므로 `X-Menuboard-Token` 불필요.

### 성공 판정

```ts
response.status.code === 0 && response.data?.menuboardToken;
```

`code === 0`이어도 `menuboardToken`이 없으면 인증 실패 다이얼로그 + `setPassword(null)`.

### 에러 코드 처리

| HTTP      | status.code | 동작                                                                                                                                        |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 401       | (any)       | 인증 실패 다이얼로그, 비밀번호 초기화 (`onError`)                                                                                           |
| 400       | `-104`      | 비밀번호 잠금. `setPassword(null)`. 메인+`tableNumber` 있으면 모달만 닫음. 관리자 페이지에서는 모달 유지(백오피스에서 비밀번호 재설정 필요) |
| 기타 실패 | —           | 인증 실패 다이얼로그, `setPassword(null)`                                                                                                   |

### 모달 닫기(×) 동작

```ts
// AdminAccessPasswordModal.onClose
isMainPage (pathname === '/') && deviceData?.tableNumber
  → setShow(false)   // 메인에 머무름
else
  → navigate(ROUTES.ROOT)  // router.subscribe가 menuboardToken 제거
```

`tableNumber`가 없으면 메인에서도 × 버튼이 렌더되지 않는다 (`deviceData?.tableNumber` 조건).

---

## 6. menuboardToken API 연동 (privateApi)

### 요청: X-Menuboard-Token 주입

`privateApi`에 **두 번째** request interceptor가 있다 (access token 처리 이후).

```ts
if (isMenuboardProtectedUrl(config.url, config.method)) {
  const token = getMenuboardToken();
  if (token) config.headers['X-Menuboard-Token'] = token;
}
```

- URL·method가 `ADMIN_API_LIST`와 일치할 때만 헤더를 붙인다.
- 토큰이 없어도 요청은 나간다 → 서버가 403 등으로 응답.

### 응답: menuboard 토큰 만료

```ts
// isMenuboardTokenExpiredError(error)
error.response?.status === 403 &&
  error.response?.data?.status?.code === -107 &&
  isMenuboardProtectedUrl(config.url, config.method);
```

처리 순서 (`privateApi` response interceptor, JWT 401 처리 **이후**):

0. **현재 페이지가 관리자 컨텍스트인지 확인** (`window.location.pathname`). `/`(root) 또는 `/login`이면 만료 팝업·모달을 **띄우지 않고 reject만** 한다. (아래 "root/login 가드" 참고)
1. `useRequestAdminAccessModalStore.getState().show === true`이면 팝업/모달 처리를 **건너뜀** (중복 다이얼로그·루프 방지).
2. `removeMenuboardToken()`
3. `setShow(true)` — 비밀번호 모달 재노출
4. `activeErrorTypes`로 중복 방지하며 확인 다이얼로그 1회: "관리자 모드 인증이 만료되었습니다."

단, `isMenuboardTokenExpiredError(error)`인 경우 위 분기를 타든 안 타든 **항상 이 분기 안에서 `return Promise.reject(error)`** 한다 → 아래 `handleApiErrorDialog`(일반 에러 팝업)로 절대 떨어지지 않는다.

JWT access token 401 갱신 로직과 **별도** 분기다. menuboard 만료는 `forceReLogin`을 호출하지 않는다.

### root/login 가드 (전이 찰나 오탐 방지)

`/`·`/login`은 menuboard 토큰을 **의도적으로 제거한 고객/로그인 화면**이다. 그런데 페이지 전이 찰나에:

- 다른 탭릿발 SSE(`DEVICE`/`TABLE`)로 시작된 `device.list`·`currentTableList` refetch
- `useSystemStatusMonitor`·`useSSEHandler`의 `POST /device/{shopCode}` (페이지 무관 실행)

가 **토큰 제거 직후** 전송되어 `403 -107`로 돌아올 수 있다. 이때 가드가 없으면 고객 화면(root)에 "관리자 모드 인증 만료" 다이얼로그가 뜬다.

→ `pathname`이 `/`·`/login`이면 이 처리를 스킵한다. 토큰 제거(`router.subscribe`)·URL 변경은 React 렌더/ref 갱신보다 **먼저** 확정되므로, `window.location.pathname`으로 판정하면 전이 찰나에도 정확히 root를 인식한다. 요청 자체를 막지는 않으며(에러는 조용히 reject), 부적절한 팝업만 억제한다.

---

## 7. 보호 API 목록 (ADMIN_API_LIST)

`menuboardProtectedEndpoints.ts`에 method + URL 정규식으로 정의. **새 관리자 API 추가 시 반드시 여기에 등록**해야 `X-Menuboard-Token`이 붙고 만료(-107) 처리가 동작한다.

| method | URL 패턴                                 | 용도                  |
| ------ | ---------------------------------------- | --------------------- |
| GET    | `/order/{shopCode}`                      | 테이블별 주문 목록    |
| GET    | `/device/list/{shopCode}`                | 디바이스 목록         |
| GET    | `/device/{shopCode}/table/{tableNumber}` | 테이블 점유 확인      |
| PUT    | `/order/move/{shopCode}`                 | 주문 테이블 이동      |
| PUT    | `/order/share/{shopCode}`                | 주문 합석             |
| PUT    | `/order/cancel/menu`                     | 선택 메뉴 취소        |
| PUT    | `/order/cancel/{shopCode}/{tableNumber}` | 전체 메뉴 취소        |
| PUT    | `/order/clear/{shopCode}/{tableNumber}`  | 테이블 초기화         |
| POST   | `/order/custom-amount`                   | 금액 변경/할인/서비스 |
| POST   | `/order/pickup/{shopCode}/{tableNumber}` | 주문 알림             |
| GET    | `/sales/card-approval/{shopCode}`        | 카드 승인 내역        |
| POST   | `/log/{shopCode}/{tableNumber}`          | 디바이스 로그         |

`SEG = '[^/]+'` — 쿼리스트링은 `url.split('?')[0]`으로 제거 후 매칭.

**포함되지 않는 API:** `POST /login/menuboard` (비밀번호 발급), 메인 주문·결제 등 고객 화면 API.

---

## 8. 전체 흐름 다이어그램

### 관리자 모드 최초 진입 (메인, 테이블 미선택)

```
앱 로그인(JWT) 완료 → /
  → useAdminAccessControl: tableNumber 없음 → setShow(true)
  → AdminAccessPasswordModal 표시
  → 4자리 입력 → menuboardToken 저장
  → navigate /tables
  → adminVerificationCheckLoader 통과
```

### 관리자 페이지 사용 중 토큰 만료

```
보호 API 호출 (X-Menuboard-Token 첨부)
  → 403, code -107
  → (pathname이 / 또는 /login 이면 → 팝업 없이 reject, 종료)
  → removeMenuboardToken + setShow(true) + 만료 다이얼로그
  → (현재 URL 유지, 모달 오버레이)
  → 비밀번호 재입력 → setMenuboardToken → refetchQueries(active)
```

### 관리자 → 메인 복귀

```
Sidebar/Home → setShow(false) → navigate /
  → router.subscribe → removeMenuboardToken()
  → 고객 주문 화면 (menuboard 인증 해제)
```

### menuboardToken 없이 /tables 직접 접근

```
adminVerificationCheckLoader → redirect /
  → (tableNumber 없으면) useAdminAccessControl → setShow(true)
```

---

## 9. 주의사항

- **모달은 App 루트에 마운트된다.** `MainPage` 전용이 아니다. 관리자 페이지 위에서도 동일 모달이 뜬다. `pathname`에 따라 성공·닫기 동작이 달라진다 (`AdminAccessPasswordModal`).

- **`adminVerificationCheckLoader`와 모달 스토어는 별개다.** loader는 토큰 없으면 `/`로 redirect만 한다. 모달 노출은 `useAdminAccessControl`·인터셉터·SSE 등이 `setShow(true)`로 담당한다.

- **ROOT 이동 시 토큰 제거는 `router.subscribe`가 담당한다.** `navigate('/')`만으로 menuboard 세션이 끊긴다. 토큰을 유지한 채 메인에 머무르려는 요구가 있으면 이 구독 로직을 함께 수정해야 한다.

- **비밀번호 UI가 이미 보일 때 `-107` 처리를 스킵한다.** `privateApi`의 `isPasswordUiVisible` 가드. 재입력 중 연쇄 API 실패로 다이얼로그가 중복되지 않게 한다.

- **`/`·`/login`에서는 `-107` 만료 팝업을 띄우지 않는다.** `privateApi`의 root/login 가드(`window.location.pathname`). 페이지 전이 찰나에 보호 API(`device.list`·`POST /device` 등)가 토큰 제거 직후 전송돼 `403 -107`로 돌아와도, 고객 화면에 관리자 만료 팝업이 뜨지 않게 한다. 단 `-107`은 항상 분기 내에서 reject되어 일반 에러 핸들러로 떨어지지 않는다.

- **로그인 mutation의 `ignoreGlobalErrors: [401]`은 필수에 가깝다.** 제거하면 JWT 스타일 전역 401 처리와 충돌할 수 있다.

- **`ADMIN_API_LIST` 누락 시** 새 관리자 API는 토큰 없이 호출되거나, 만료 시 모달이 뜨지 않는다. 엔드포인트 추가 시 fetcher와 이 목록을 쌍으로 수정한다.

- **`-104` 잠금 상태**에서는 프론트가 비밀번호 재시도만 막는 것이 아니라 서버가 거부한다. 관리자 페이지에서는 모달을 유지해 재설정 안내 맥락을 유지한다.

- **홈 버튼에서 `setShow(false)`를 navigate보다 먼저 호출한다.** 그렇지 않으면 `/` 복귀 직전에 비밀번호 모달이 잠깐 보인다 (`TablesPage/Sidebar`, `SidebarLayout`).

- **성공 후 모달 닫기 500ms 지연** (`TIMER_KEYS.ADMIN_ACCESS_MODAL_HIDE`)은 의도적이다. 즉시 닫으면 라우트 전환 중 UI가 깜빡인다.

- **access token 만료(`forceReLogin`)와 menuboard 만료는 다른 UX다.** 전자는 로그인 페이지로, 후자는 비밀번호 모달 재노출이다.
