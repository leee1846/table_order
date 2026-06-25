# SSE (Server-Sent Events) — AI 참조 문서

`apps/menu`의 실시간 메시지(SSE) 코드를 읽거나 수정할 때 참조한다.
코드 수정 전 반드시 해당 파일을 직접 읽어 최신 상태를 확인할 것.

SSE 관련 로직은 한 파일에 모여 있지 않고 **연결 관리(packages/feature) → 연결 초기화(apps/menu/utils) → 메시지 분기 핸들러(apps/menu/hooks)** 3계층으로 흩어져 있다. 이 문서는 그 전체 흐름을 정리한다.

---

## 1. 파일 맵

| 역할 | 경로 |
|------|------|
| 전역 SSE 엔진 (EventSource 연결/재연결/큐/구독) | `packages/feature/src/hooks/useSSE.ts` |
| SSE 연결 초기화·해제·복구 (menu 전용 래퍼) | `apps/menu/src/utils/sseConnection.ts` |
| **SSE 메시지 타입별 분기 핸들러 (핵심)** | `apps/menu/src/hooks/useSSEHandler.ts` |
| SSE 훅 마운트 지점 | `apps/menu/src/App.tsx` (`AppContent`) |
| 네트워크 복구 감지 → SSE 재연결 트리거 | `apps/menu/src/hooks/useSystemStatusMonitor.ts` |
| 네트워크 복구 시 GET API 재요청 | `apps/menu/src/hooks/useNetworkRecoveryRefresh.ts` |
| 재연결 중 로딩 오버레이 | `apps/menu/src/feature/MenuGlobalLoadingIndicator/index.tsx` → `packages/feature/src/components/GlobalLoadingIndicator/index.tsx` |
| 토큰 갱신/실패 시 SSE 재연결·해제 주입 | `apps/menu/src/config/api/privateApi.ts` |
| 토큰 갱신 매니저 (SSE 콜백 보유) | `packages/api/src/auth/tokenRefreshManager.ts` |
| 로그인 후 진입 (SSE는 자동) | `apps/menu/src/pages/LoginPage/index.tsx` |
| 로그아웃/인증클리어 시 SSE 해제 | `apps/menu/src/utils/auth.ts` (`clearAuthData`) |
| SSE 연결 키 상수 | `apps/menu/src/constants/keys.ts` (`SSE_KEYS`) |
| SSE 메시지 타입 정의 | `packages/api/src/types/sse.ts` (`ISseMessage`) |
| heartbeat ACK 쿼리 | `packages/api/src/queries/sse/usePostSseHeartbeatAck.ts` |
| heartbeat ACK fetcher | `packages/api/src/fetchers/sse.ts` |
| SSE 엔드포인트 | `packages/api/src/cores/endpoints.ts` (`ENDPOINTS.SSE`) |
| POS 동기화 오버레이 상태 | `apps/menu/src/stores/usePosSyncOverlayStore.ts` |
| 픽업 알림 상태 | `apps/menu/src/stores/usePickupAlarmStore.ts` |
| POS 주문 이중경로(SSE+폴링) 조율 | `packages/feature/src/stores/usePosOrderStore.ts` (결제 문서 참조) |

---

## 2. 3계층 구조와 데이터 흐름

```
[packages/feature] useSSE.ts
   connectSSE(key, url)        ─ EventSource 생성, onmessage → 큐 → 구독자 콜백
   disconnectSSE(key, reason)  ─ EventSource 종료 (state는 맵에 유지)
   useSSEData<T>(key)          ─ React 상태로 메시지 구독
   reconnectSSEOnNetworkRecovery(key)
   useSSEReconnecting()        ─ 재연결 중 여부 (로딩 UI용)
        │
        ▼
[apps/menu/utils] sseConnection.ts  ─ MAIN_CONNECTION 키 고정, URL 조립
   initializeSseConnection()   ─ token + androidId 쿼리 붙여 connectSSE 호출
   disconnectSse(reason)
   reconnectSseOnNetworkRecovery()
        │
        ▼
[apps/menu/hooks] useSSEHandler.ts  ─ App.tsx에서 1회 마운트
   useSSEData<ISseMessage>(MAIN_CONNECTION)로 메시지 구독
   shopCode 일치 검증 후 sseMessage.type으로 switch 분기
   각 handle*Message가 쿼리 무효화/스토어 갱신/네이티브 제어 수행
```

**연결 1개만 사용한다.** 키는 `SSE_KEYS.MAIN_CONNECTION` (`'sse-main-connection'`) 하나뿐. 멀티 연결을 지원하는 구조지만 menu 앱은 단일 연결만 쓴다.

### 연결 URL

```ts
// sseConnection.ts
`${VITE_API_BASE_URL}${ENDPOINTS.SSE.CONNECT_DEVICE}?token=${accessToken}&androidId=${androidId}`
// ENDPOINTS.SSE.CONNECT_DEVICE === '/sse/connect/device'
```

`accessToken` 또는 `baseUrl`이 없으면 연결을 시도하지 않는다 (조용히 return).
인증은 헤더가 아니라 **쿼리스트링 `token`** 으로 전달한다 (EventSource가 커스텀 헤더를 못 보내기 때문).

---

## 3. 연결 생명주기

### 연결 시작 (`useSSEHandler` 내부 effect, `currentShopData.shopCode` 변경 시 1회)

```
shopCode 존재 확인
  → collectDeviceInfoAndSyncToServer()  (디바이스 정보 수집 → 스토어 반영 → POST /device)
  → (cleanup으로 cancelled 되지 않았으면) initializeSseConnection()
cleanup: disconnectSse('shopCode 변경 ...'), TABLE_REMOVAL_CHECK 타이머 정리
```

> 디바이스 POST가 먼저 끝나야 SSE를 연다. shopCode가 바뀌면 cleanup이 `cancelled=true`로 막아 이전 run의 재연결을 차단한다.

### 자동 재연결 (`useSSE.ts` `onerror`)

| 조건 | 동작 |
|------|------|
| 재시도 ≤ 5회 | 2초 딜레이 후 자동 재연결, `isReconnecting=true` (로딩 UI 표시) |
| 재시도 > 5회 | `연결 오류` 다이얼로그 표시 + 이후 **30초마다** 재시도, 카운트 리셋 |
| 연결 성공 (`onopen`) | 타이머/다이얼로그/로딩 UI 모두 정리, 카운트 0 |

상수: `RETRY_AFTER_DIALOG_MS = 30초`, 자동 재연결 딜레이 `2000ms`, 다이얼로그 임계 `> 5회`.

### 수동/이벤트 기반 재연결

- **`DISCONNECT` 메시지 수신** → `disconnectSse` 후 `initializeSseConnection` (서버가 끊으라고 지시).
- **`PING` ACK 410 응답** → 토큰 만료로 간주, 끊고 재연결.
- **네트워크 복구** (`useSystemStatusMonitor`의 `network_recovered` 이벤트) → `useNetworkRecoveryRefresh`로 GET API 재요청 후 `reconnectSseOnNetworkRecovery()`. 이미 `eventSource`가 살아있으면 무시(이중 연결 방지).

### heartbeat watchdog (half-open 감지, `useSSE.ts`)

서버는 끊었는데 클라이언트 `EventSource`는 OPEN으로 남는 half-open 상태를 잡기 위한 클라이언트 측 감시.

```
onopen / onmessage(모든 수신 메시지)  → armHeartbeatWatchdog()  (20초 타이머 리셋)
20초 내 어떤 메시지도 없음            → triggerReconnect('heartbeat timeout')
                                       → onerror와 동일한 재연결 흐름에 합류
disconnectSSE                         → watchdog 타이머 정리
```

- 상수 `HEARTBEAT_TIMEOUT_MS = 20초` (서버 PING 주기 10초의 2배 — 1회 누락 허용).
- **타이머 리셋은 `onmessage`(raw 수신)에서** 한다. 핸들러(`handlePingMessage`)가 아니다 → rAF 기반 메시지 큐(§4) 지연·정지(화면 OFF 등)와 무관하게 실제 수신 시점 기준으로 동작.
- 만료 시 `triggerReconnect`는 **`onerror`와 같은 함수**를 타므로 재시도 카운트/다이얼로그/30초 백오프를 그대로 공유한다. 별도 재연결 경로가 아니다.
- `triggerReconnect`는 `state.eventSource !== eventSource` 가드로 **해당 EventSource 인스턴스당 1회만** 동작 → onerror 중복 발화·watchdog 경합 시 이중 재연결 방지.
- 생명주기가 `connectSSE`/`onopen`(무장) ↔ `disconnectSSE`(해제)에 묶여 있어 `DISCONNECT`·410·네트워크복구·로그아웃이 모두 자동으로 타이머를 정리·재무장한다 (앱 레이어 개입 불필요).

### 연결 해제 트리거 (전체)

| 트리거 | 경로 | 비고 |
|--------|------|------|
| shopCode 변경 (effect cleanup) | `useSSEHandler` | `disconnectSse('shopCode 변경 ...')` |
| `DISCONNECT` 메시지 | `handleDisconnectMessage` | 끊고 즉시 재연결 |
| `PING` ACK 410 | `handlePingMessage` | 토큰 만료 → 끊고 재연결 |
| **로그아웃 / 인증 클리어** | `clearAuthData()` (`utils/auth.ts`) | `disconnectSse('로그아웃')`. `LOGOUT` 메시지 핸들러와 `forceReLogin`(privateApi)이 공통 호출 |
| 컴포넌트 언마운트 | `useSSEHandler` cleanup | 페이지 이탈 시 |

> 로그아웃 시 SSE 해제는 `handleLogoutMessage`가 직접 부르지 않고 `clearAuthData()` 안에 모여 있다. 인증 만료(`forceReLogin`)도 같은 함수를 거치므로 끊김 경로가 한 곳으로 수렴한다.

### 연결 해제 시 state 보존

`disconnectSSE`는 `sseConnectionMap`에서 state를 **삭제하지 않는다**. EventSource만 닫고 큐/데이터는 초기화하되 구독자 콜백(`setDataCallbacks`)은 유지 → 재연결 후 `useSSEData` 구독이 끊기지 않고 그대로 메시지를 받는다.

---

## 4. 메시지 수신 파이프라인 (`useSSE.ts`)

```
EventSource.onmessage
  → JSON.parse(event.data)
  → messageQueue.push()
  → processMessageQueue()
       ─ 큐에서 1개 shift
       ─ JSON 딥카피로 새 참조 생성 (React 변경 감지용)
       ─ 모든 setDataCallbacks 호출
       ─ requestAnimationFrame → setTimeout(50ms) → 다음 메시지 처리
```

> **메시지는 직렬 처리된다.** 50ms 간격 + rAF로 React 상태 업데이트가 끝난 뒤 다음 메시지를 넘긴다. 핸들러에서 동기적으로 연속 메시지를 가정하면 안 된다.
> `disconnectSSE`는 `pendingRafId`를 취소해 끊긴 뒤 큐 처리 체인이 살아남지 않게 한다.

---

## 5. 메시지 타입별 핸들러 (`useSSEHandler.ts`)

### 공통 가드 (switch 진입 전)

```ts
if (!sseMessage) return;
if (!currentDeviceData || !currentShopData?.shopCode) return;
if (sseMessage.shopCode !== currentShopData.shopCode) return;  // 다른 매장 메시지 무시
```

`PING`을 포함한 모든 타입이 이 가드를 통과해야 처리된다.

### 핸들러 표

| type | 핸들러 | 핵심 동작 |
|------|--------|----------|
| `PING` | `handlePingMessage` | heartbeat ACK POST(`/sse/heartbeat-ack`). 410이면 끊고 재연결. 그 외 실패는 무시 |
| `ORDER` | `handleOrderMessage` | 테이블 목록=새로고침 / 테이블 상세=타임스탬프 변경 시 주문 히스토리 무효화 / 관리자 모드=현재 테이블 주문 갱신 후 결제 완료면 모달 닫기 |
| `CLEAR` | `handleClearTableMessage` | 테이블 정리. 상세 페이지면 토스트 후 테이블 목록으로 navigate. 관리자 모드면 메뉴보드 상태 리셋 |
| `SHOP` | `handleShopMessage` | 매장상세 갱신, (결제 모달 아니면) 모달 전부 닫기, 토스트 |
| `MENU` | `handleMenuMessage` | 메뉴/카테고리 갱신 + **장바구니 항목을 최신 메뉴 데이터로 동기화**(수량 유지), 메뉴 상세 모달 닫기 |
| `TABLE` | `handleTableMessage` | 테이블 그룹/목록/디바이스 목록 갱신. 100ms 후 현재 테이블이 삭제됐으면 tableNumber null화 + 관리자 모달 |
| `DEVICE` | `handleDeviceMessage` | 테이블 목록 페이지에서만 디바이스 목록 갱신 |
| `PICKUP` | `handlePickupMessage` | `usePickupAlert` ON + root 경로 + 현재 테이블 대상일 때 픽업 알림 표시 + `dingdong` 사운드 |
| `APP_OFF` | `handleAppOffMessage` | 대상 androidId면 `SystemControl.shutdown()` |
| `DEVICE_RESTART` | `handleDeviceRestartMessage` | 대상이면 `reboot()`. 실패 시 로그 + `controlStatus:'FAIL'` POST |
| `DEVICE_APP_UPDATE` | `handleDeviceAppUpdateMessage` | 대상이면 최신 버전 조회 후 `Installer.startUpdate()`. 실패 시 로그 + `'FAIL'` POST |
| `DEVICE_SCREEN_OFF` | `handleDeviceScreenOffMessage` | 대상이면 `lockScreen()` |
| `DEVICE_SCREEN_ON` | `handleDeviceScreenOnMessage` | 대상이면 `wakeScreen()` |
| `SHOP_THEME_PAGE` / `SHOP_THEME_MENU` | `handleShopThemeMessage` | 테마 페이지 데이터 갱신 |
| `LOGOUT` | `handleLogoutMessage` | "비밀번호 변경" 다이얼로그 → 인증 데이터 clear → 로그인 페이지 |
| `ORDER_COMPLETE` | `handleOrderCompleteMessage` | `usePosOrderStore.handleOrderComplete(orderUuid)` (POS 주문 fast path) |
| `POS_SYNC_START` | `handlePosSyncStartMessage` | 동기화 오버레이 표시 + 1분 폴링 시작 |
| `POS_SYNC_END` | `handlePosSyncEndMessage` | 폴링 중단, 테이블/메뉴/매장 갱신, 오버레이 숨김, 토스트 |
| `AD_MENU` | `handleAdMenuMessage` | 광고 파일 refetch + `handleMenuMessage` 재사용 |
| `DISCONNECT` | `handleDisconnectMessage` | 끊고 재연결 |

> **생산자(참고):** `MENU` 메시지는 admin 쪽에서 `POST /menu/bulk/menu-sse/{shopCode}`(`postMenuBulkMenuSse` / `usePostMenuBulkMenuSse`)를 호출하면 서버가 브로드캐스트한다. 이 엔드포인트는 이름에 `sse`가 들어가지만 EventSource가 아니라 일반 POST이며, menu 앱은 결과 메시지를 **소비만** 한다.

### `ISseMessage.type`에 있으나 menu 앱이 **처리하지 않는** 타입

`DEVICE_THEFT`, `RING_BELL`, `POS_ERROR`, `AGENT_PING`, (중복 정의된) `PING`.
switch의 `default`에서 무시된다. menu 앱에서 동작이 필요하면 case를 추가해야 한다.

### `message.data` 형태 (타입별)

```ts
// packages/api/src/types/sse.ts
data: { [key: string]: number | string } | null | string[] | string
```

| 타입 | data 실제 형태 | 의미 |
|------|---------------|------|
| `ORDER` | `{ [tableNumber]: timestamp }` | 테이블별 마지막 주문 시각 |
| `PICKUP` | `{ [tableNumber]: message }` | 테이블별 픽업 안내 문구 |
| `CLEAR` | `string` | 정리된 테이블 번호 |
| `ORDER_COMPLETE` | `string` | orderUuid |
| `APP_OFF`/`DEVICE_*` | `string[]` | 대상 androidId 배열 |

---

## 6. 최신 값 참조 패턴 (중요 — 수정 시 깨지기 쉬움)

`useSSEHandler`는 의존성 변경으로 인한 effect 재실행/재구독을 피하기 위해 **모든 핸들러와 데이터를 ref에 담는다.**

- `handlersRef` — 모든 `handle*Message` 함수. 메시지 수신 effect는 `[sseMessage]`만 의존하고 핸들러는 `handlersRef.current`로 호출한다.
- `sseHandlerDataRef` — `currentDeviceData`, `currentShopData`, `shopDetailData`, `tableOrderHistoriesData`, `tableGroupData`, `pickupAlarmData`, `locationPathname`, `tableNumFromParams`. 별도 effect가 매 렌더 최신값을 ref에 복사한다.
- `previousOrderDataRef` — `ORDER` 중복 처리 방지용 직전 타임스탬프 스냅샷.
- `pickupAlarmShowingRef` — 알림 중복 표시 방지.

> **핸들러 안에서 props/state를 직접 읽지 말 것.** 반드시 `sseHandlerDataRef.current`에서 꺼낸다. 직접 읽으면 effect가 1회 마운트 기준이라 stale 값이 잡힌다. 새 데이터가 필요하면 (1) 해당 데이터를 `sseHandlerDataRef` 동기화 effect에 추가하고 (2) 핸들러에서 ref로 읽는다.

`refetch*` 콜백(`refetchCurrentTableList` 등)은 `useCallback` + 별도 effect로 `handlersRef`에 재주입된다.

---

## 7. heartbeat (PING/ACK)

```
서버 PING 메시지 ──▶ handlePingMessage
                      androidId·shopCode 있으면 POST /sse/heartbeat-ack (skipGlobalErrorHandling)
                      └─ 410 → 토큰 만료 → disconnectSse + initializeSseConnection
                      └─ 그 외 에러 → 무시
```

- ACK는 mutation(`usePostSseHeartbeatAck`, mutationKey `['sse','postHeartbeatAck']`).
- 로딩 인디케이터는 이 mutationKey를 **제외**한다 (`GlobalLoadingIndicator`의 `useIsMutating`). heartbeat가 스피너를 띄우면 안 되므로.

---

## 8. POS 동기화 (`POS_SYNC_START`/`END` + 폴링 fallback)

SSE 메시지를 놓칠 경우를 대비해 상태 폴링을 병행한다.

```
POS_SYNC_START ▶ 오버레이 표시 + startPosSyncPolling(shopCode)
                  └ 60초마다 getPosSyncStatus 호출
                       성공          → 동기화 끝 → handlePosSyncEndMessage
                       502 & code -102 → 진행 중 → 폴링 계속
                       그 외 에러     → 폴링 중단 (무한 루프 방지)
POS_SYNC_END   ▶ 폴링 중단 + 테이블/메뉴/매장 갱신 + 오버레이 숨김 + 토스트
```

상수: `POS_SYNC_POLL_INTERVAL_MS = 60초`, `POS_SYNC_HTTP_502 = 502`, `POS_SYNC_ERROR_CODE_IN_PROGRESS = -102`.
앱 시작 시에도 POS 연동 매장이면 상태를 1회 조회해 진행 중이면 오버레이+폴링을 건다.
타이머는 `globalTimerManager` + `TIMER_KEYS.POS_SYNC_POLLING`로 관리.

---

## 9. 토큰/인증 연동 (privateApi ↔ tokenRefreshManager)

SSE URL은 쿼리스트링에 `token`을 박아 연결하므로, 토큰이 바뀌면 원칙적으로 재연결이 필요하다. 이를 위한 배선은 존재하지만 **현재 일부는 휴면 상태다.**

```ts
// apps/menu/src/config/api/privateApi.ts
accessTokenRefreshManager.configure({
  onRefreshFailed: () => forceReLogin('리프레시 토큰 만료'),
  reconnectSse: initializeSseConnection,
  disconnectSse,
});
```

```ts
// packages/api/src/auth/tokenRefreshManager.ts (runRefresh 내부)
setAccessToken(token);
// state.config?.disconnectSse?.();   ← 주석 처리됨
// state.config?.reconnectSse?.();    ← 주석 처리됨
```

- **access token 갱신 성공 시:** `reconnectSse`/`disconnectSse`가 주입돼 있으나 매니저 내부 호출이 **주석 처리**되어 실제로는 SSE를 재연결하지 않는다. 토큰 회전 후 기존 연결을 그대로 유지하다가, 만료가 문제되면 **`PING` ACK 410 경로**(§7)에서 끊고 재연결한다.
- **refresh 실패(401):** `onRefreshFailed → forceReLogin` → `clearAuthData()` + 로그인 페이지로 이동. 페이지 이탈로 `useSSEHandler`가 언마운트되며 연결도 해제된다.
- **`LoginPage`:** SSE 직접 호출 없음. 로그인 성공 후 `useSSEHandler`가 `shopCode` 기반으로 자동 연결한다 (코드에도 주석으로 명시).

> 토큰 갱신 시 SSE 재연결을 되살리려면 `tokenRefreshManager.ts`의 주석 두 줄을 해제하면 된다. 현재 동작은 "끊지 않고 PING 410에 의존"이다.

---

## 10. 재연결 로딩 UI

```
useSSE.useSSEReconnecting()  ─ 하나라도 재연결 중이면 true (전역 콜백 Set 구독)
   → GlobalLoadingIndicator의 sseReconnectingMessage('네트워크 연결 중')
```

menu 앱은 `MenuGlobalLoadingIndicator`에서 `hideSSEReconnectingOverlay`를 줘서 SSE 재연결 오버레이 자체는 숨기지만, POS 동기화 오버레이(`isPosSyncVisible`)는 표시한다.

---

## 11. 주의사항 (실수하기 쉬운 지점)

- **연결은 단 1개** (`SSE_KEYS.MAIN_CONNECTION`). 새 채널을 늘리지 말 것 — 핸들러는 단일 연결 전제.
- **shopCode 불일치 메시지는 전부 무시.** 핸들러 추가 시에도 이 가드 뒤에서 동작함을 전제로 작성.
- **핸들러는 stale closure에 취약.** 데이터는 `sseHandlerDataRef.current`로만, 핸들러는 `handlersRef.current`로만 호출. 직접 state 참조 금지.
- **메시지는 50ms 간격 직렬 처리.** 같은 틱에 여러 메시지가 동시 반영된다고 가정하면 안 된다.
- **인증은 쿼리스트링 token.** EventSource는 헤더를 못 보낸다. 토큰 만료는 `PING` ACK 410으로 감지해 재연결.
- **`disconnectSSE`는 state를 지우지 않는다.** 재연결 후 구독 유지가 목적. 완전 제거 로직을 추가하면 구독이 끊긴다.
- **`DISCONNECT`(서버 지시)와 onerror(네트워크 끊김)는 다른 경로.** 전자는 핸들러에서 즉시 재연결, 후자는 5회→다이얼로그→30초 흐름.
- **타입에는 있으나 미처리 타입 존재** (`DEVICE_THEFT`, `RING_BELL`, `POS_ERROR`, `AGENT_PING`). 동작시키려면 switch에 case 추가 필요.
- **heartbeat ACK는 로딩 스피너에서 제외**되어 있다. mutationKey를 바꾸면 스피너가 떠버린다.
- **`PING` 가드:** PING도 `currentDeviceData`/`currentShopData`/shopCode 일치 가드를 통과해야 ACK를 보낸다.
