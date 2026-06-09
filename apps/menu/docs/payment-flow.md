# 결제 플로우 — AI 참조 문서

결제·주문 관련 코드를 읽거나 수정할 때 참조한다.
코드 수정 전 반드시 해당 파일을 직접 읽어 최신 상태를 확인할 것.

---

## 1. 파일 맵

| 역할 | 경로 |
|------|------|
| SSE 이벤트 분기 | `apps/menu/src/hooks/useSSEHandler.ts` |
| 결제 수단 선택 UI | `apps/menu/src/pages/MainPage/PaymentsModal/index.tsx` |
| 카드 할부 선택 UI | `apps/menu/src/pages/MainPage/CardPaymentInstallmentModal/index.tsx` |
| 나눠서 결제 UI | `apps/menu/src/pages/MainPage/SplitPaymentModal/index.tsx` |
| 카트 & 후불 주문 처리 | `apps/menu/src/pages/MainPage/CartList/index.tsx` |
| 현금 유도 모달 | `apps/menu/src/feature/CashPaymentInducement/index.tsx` |
| 할부 공통 로직 | `apps/menu/src/feature/Installment/` |
| 세금·금액 계산 | `apps/menu/src/utils/calculation.ts` |
| 환불 실패 로그 | `apps/menu/src/utils/logOrderRequestRefundFailed.ts` |
| 모달 상태 | `apps/menu/src/stores/useModalStore.ts` |
| POS 이중 경로 조율 | `packages/feature/src/stores/usePosOrderStore.ts` |
| SSE 연결 관리 | `packages/feature/src/hooks/useSSE.ts` |
| POS 폴링 fallback | `packages/feature/src/utils/startPosCallbackPoller.ts` |
| 잔여 금액 계산 | `packages/feature/src/utils/fullyPaid.ts` |
| 주문 생성 fetcher | `packages/api/src/fetchers/orders.ts` |
| 결제 승인·취소 fetcher | `packages/api/src/fetchers/payment.ts` |
| SSE 이벤트 타입 | `packages/api/src/types/sse.ts` |
| 결제 API 타입 | `packages/api/src/types/payment.ts` |
| 주문 API 타입 | `packages/api/src/types/orders.ts` |
| 단말기 통신 | `packages/util/src/app/Payment.ts` |

---

## 2. 결제 수단 진입 조건

```ts
// apps/menu/src/pages/MainPage/PaymentsModal/index.tsx
shopDetailData?.shopSetting?.usePrepaymentCashPayment      // 현금 결제 노출 여부
shopDetailData?.shopSetting?.usePrepaymentDutch            // 나눠서 결제 노출 여부
shopDetailData?.shopSetting?.usePrepaymentDeferredPayment  // 후불 결제 노출 여부
// 카드 결제: 플래그 없음, 항상 노출
```

---

## 3. 핵심 함수 시그니처 & 반환 형태

### 주문 생성

```ts
// packages/api/src/fetchers/orders.ts
createTableOrder(req: ICreateTableOrderRequest & {
  ignoreGlobalErrors?: number[];
  skipGlobalErrorHandling?: boolean;
}): Promise<IApiResponse<ICreateTableOrderData>>

interface ICreateTableOrderRequest {
  shopCode: string;
  tableNumber: string;
  orderType: TOrderType;  // 'MENU' | ...
  customerCount: number;
  kidsCustomerCount: number;
  totalAmount: string;
  orders: IOrder[];
}

interface ICreateTableOrderData {
  orderGroupUuid: string;
  orderInfoList: IOrderInfo[];  // orderUuid는 orderInfoList.at(-1)?.orderUuid
}
```

### 결제 승인 제출

```ts
// packages/api/src/fetchers/payment.ts
postPaymentApproval(req: {
  params: IPostPaymentApprovalRequestParams;
  data: IPaymentResponse;          // 단말기 응답 그대로 전달
  ignoreGlobalErrors?: number[];
}): Promise<IApiResponse<number>>  // data는 paymentSeq (환불 시 필요)

interface IPostPaymentApprovalRequestParams {
  paymentMethodCode: TVanCode;
  orderGroupUuid: string;
  orderUuid: string;
}
```

### 결제 취소 (환불)

```ts
// packages/api/src/fetchers/payment.ts
putPaymentCancel(req: {
  params: IPutPaymentCancelRequestParams;
  data: IPaymentResponse;
  ignoreGlobalErrors?: number[];
}): Promise<TVoidApiResponse>

interface IPutPaymentCancelRequestParams {
  paymentMethodCode: TVanCode;
  orderGroupUuid: string;
  paymentSeq: number;
}
```

### 단말기 통신

```ts
// packages/util/src/app/Payment.ts
Payment.approve(options: IPaymentApproveOptions): Promise<IPaymentResponse>
Payment.cancel(approvalResult: IPaymentResponse): Promise<IPaymentResponse>

interface IPaymentApproveOptions {
  amount: string | number;
  tax?: string | number;
  taxOption?: 'M' | 'A';
  tip?: string | number;
  installment?: string;   // '00'=일시불, '02'=2개월, ... (두 자리 문자열)
  terminalType?: '40' | 'TK' | 'RD' | 'BU' | 'VP' | 'MP' | 'HP';
}
```

### 잔여 금액

```ts
// packages/feature/src/utils/fullyPaid.ts
isOrderFullyPaid(paymentList: IPayment[], totalPrice: number): number
// 반환값 = 잔여 금액. 0이면 전액 완료, 양수이면 미완료.
// 이름이 boolean처럼 보이지만 number를 반환한다.
// 주의: useSSEHandler의 ORDER 이벤트 핸들러는 이 함수를 사용하지 않는다.
//       인라인으로 totalAmount > 0 && totalAmount - paidAmount === 0 를 직접 계산한다.
```

---

## 4. 결제 수단별 실행 순서

### 카드 결제

```
Payment.approve()                          → IPaymentResponse
createTableOrder({ orderType: 'MENU' })   → { orderGroupUuid, orderInfoList }
postPaymentApproval({ params, data })      → paymentSeq
usePosOrderStore.register(orderUuid, shopCode, onSuccess, onFailure)
```

### 현금 결제

```
createTableOrder({ orderType: 'MENU' })
  ↓
usePrepaymentCashPaymentInducement 플래그 분기
  true  → CashPaymentInducement 모달 표시 (SSE ORDER 이벤트로 자동 닫힘)
  false → 주문 완료 모달 즉시 표시
```

### 나눠서 결제 (라운드별)

```
[첫 라운드만] createTableOrder()           → orderGroupUuid, orderUuid 저장
[매 라운드]   isAllPaid 계산
                메뉴별: remainingMenus.length === selectedMenus.length || remainingMenuPrice - paymentAmount <= 0
                인원별: remainingPersons.length === selectedPersons.length || remainingPersonTotal - paymentAmount <= 0
              Payment.approve()
              postPaymentApproval({ params: { orderGroupUuid, orderUuid }, data })
              usePosOrderStore.register(...)
              isAllPaid true  → 주문 완료 모달
              isAllPaid false → 상태 업데이트 후 다음 라운드
```

### 후불 결제

```
createTableOrder({ orderType: 'MENU' })
usePosOrderStore.register(orderUuid, shopCode, onSuccess, onFailure)
```

---

## 5. POS 연동 구조

### usePosOrderStore

```ts
// packages/feature/src/stores/usePosOrderStore.ts
interface IPosOrderStore {
  isWaitingForPosOrderComplete: boolean;

  register(
    orderUuid: string,
    shopCode: string,
    onSuccess: () => void | Promise<void>,
    onFailure: () => void | Promise<void>,
    onTimeout?: () => void | Promise<void>
  ): void;

  handleOrderComplete(orderUuid: string): void;  // SSE에서 호출
  clearAll(): void;
}
```

`register()` 내부에서 `startPosCallbackPoller`를 동시에 실행한다. SSE와 폴링 중 먼저 도달하는 신호로 처리된다.

### 폴링 fallback

```ts
// packages/feature/src/utils/startPosCallbackPoller.ts
startPosCallbackPoller(options: {
  shopCode: string;
  orderUuid: string;
  onSuccess: () => void;
  onFailure: () => void;
  onTimeout?: () => void;
}): { stop: () => void }

// 내부 상수
POLL_INTERVAL_MS = 2000   // 2초 간격
MAX_POLL_COUNT   = 30     // 최대 30회 (60초)

POS_CALLBACK_CODE = {
  SUCCESS: -601,
  PENDING: -602,
  FAILURE: -603,
}
```

### SSE fast path

`useSSEHandler`가 `ORDER_COMPLETE` 수신 시 → `usePosOrderStore.handleOrderComplete(orderUuid)` 호출

---

## 6. SSE 이벤트 타입 (결제 관련)

```ts
// packages/api/src/types/sse.ts
interface ISseMessage {
  shopCode: string;
  type:
    | 'ORDER_COMPLETE'  // POS 수락 → handleOrderComplete() 호출
    | 'ORDER'           // 주문 상태 변경 → totalAmount > 0 && totalAmount - paidAmount === 0 인라인 계산으로 자동 닫힘 판단
    | 'SHOP'            // 설정 변경 (결제 수단 플래그 포함)
    | 'PING' | 'MENU' | 'TABLE' | 'PICKUP' | 'DEVICE' | ...;
  data: Record<string, number | string> | null | string[] | string;
}
// 'PAYMENT' 타입은 존재하지 않는다.
```

---

## 7. 에러 처리 & 환불 패턴

| 실패 지점 | 이미 발생한 것 | 처리 |
|-----------|--------------|------|
| `createTableOrder()` 실패 | 단말기 승인 완료 | `Payment.cancel(approvalResult)` |
| `postPaymentApproval()` 실패 | 단말기 승인 완료 | `Payment.cancel(approvalResult)` |
| POS 폴링 -603 or 타임아웃 | 서버 승인 완료 | `Payment.cancel()` → 실패 시 `logOrderRequestRefundFailed()` |

```ts
// apps/menu/src/utils/logOrderRequestRefundFailed.ts
logOrderRequestRefundFailed(summary: string, payment: IPaymentResponse): void

// summary 생성 헬퍼 (상황에 맞게 선택)
orderRequestRefundFailedSummaryAfterOrderCreate(shopCode, tableNumber): string
orderRequestRefundFailedSummaryAfterPaymentApproval(paymentMethodCode): string
orderRequestRefundFailedSummaryAfterPosOrderFailure(): string
```

---

## 8. 결제 흐름에서 참조하는 전역 상태

결제 함수 호출 시 `shopCode`와 `tableNumber`는 직접 props로 받지 않고 전역 스토어에서 꺼낸다.

```ts
// shopCode
useShopStore.getState().data?.shopCode

// tableNumber
useDeviceStore.getState().data?.tableNumber
```

### 주문 데이터 변환

카트 메뉴를 API 요청 형태로 변환할 때 반드시 거쳐야 하는 함수:

```ts
// apps/menu/src/utils/calculation.ts (또는 동일 디렉터리)
convertCartMenusToAdjustedOrders(cartMenus): IOrder[]
// isMenuQuantityIndependent 옵션의 수량을 정규화한다.
// createTableOrder의 orders 필드에 이 결과를 전달해야 한다.
```

---

## 9. 주의사항 (실수하기 쉬운 지점)

- **`orderUuid` 위치:** `createTableOrder` 응답에서 `data.orderGroupUuid`는 최상위, `orderUuid`는 `data.orderInfoList.at(-1)?.orderUuid`에 있다 (`[0]`이 아닌 마지막 요소).
- **`isOrderFullyPaid` 반환 타입:** 함수명과 달리 `boolean`이 아니라 `number`(잔여 금액)를 반환한다. `=== 0` 으로 비교해야 한다. SplitPaymentModal에서는 사용하지 않고 `isAllPaid` 플래그로 완료 여부를 판단한다.
- **할부 문자열 형식:** `installment`는 두 자리 문자열이어야 한다 — 일시불 `'00'`, 2개월 `'02'`.
- **`usePrepayment*`는 훅이 아니다:** `shopDetailData.shopSetting`의 boolean 필드다.
- **`postPaymentApproval` 반환값:** `IApiResponse<number>`의 `data`가 `paymentSeq`다. 환불(`putPaymentCancel`) 호출 시 필요하므로 반드시 저장해야 한다.
- **SSE 'PAYMENT' 타입 없음:** `ISseMessage.type`에 `'PAYMENT'`는 존재하지 않는다.
- **나눠서 결제 주문 생성:** 첫 라운드에서만 `createTableOrder()`를 호출한다. 이후 라운드는 동일한 `orderGroupUuid`와 `orderUuid`를 재사용한다.
