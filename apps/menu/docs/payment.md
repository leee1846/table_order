# 결제 기능

메뉴 앱 결제 방식과 POS 연동 시 주문 완료 처리(ORDER_COMPLETE / POS_ERROR) 흐름 정리.

## 개요

| 구분               | 설명                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **결제 종류**      | 카드(단일), 나눠서(카드 분할), 현금, 후불                                                                           |
| **결제 방법 노출** | 매장 설정에 따름: 현금 `usePrepaymentCashPayment`, 나눠서 `usePrepaymentDutch`, 후불 `usePrepaymentDeferredPayment` |
| **POS 연동**       | `shopPosCode` 존재·`'NONE'` 아님 → ORDER_COMPLETE/POS_ERROR SSE 대기 후 콜백                                        |

---

## 결제 진입 흐름

```mermaid
flowchart TD
  A[주문하기 확인] --> B{선불?}
  B -->|아니오| C[주문 API 호출]
  B -->|예| D[결제 방법 선택]
  D --> E[카드]
  D --> F[나눠서]
  D --> G[현금]
  D --> H[후불]
  E --> I[카드 결제·할부 모달]
  F --> J[나눠서 결제 모달]
  G --> C
  H --> C
  C --> K{POS 연동?}
  K -->|예| L[주문 완료 대기 등록]
  K -->|아니오| M[주문완료 모달 표시]
  L --> N[SSE 수신 대기]
  N --> O[ORDER_COMPLETE 수신]
  N --> P[POS_ERROR 수신]
  O --> Q{대기 중 주문 UUID와 일치?}
  P --> R{대기 중 주문 UUID와 일치?}
  Q -->|예| S[성공 콜백 실행]
  R -->|예| T[실패 콜백 실행]
```

---

## POS 연동 완료 처리

```mermaid
flowchart LR
  subgraph API성공["API 성공 후"]
    A[주문/결제 성공] --> B{POS 연동?}
    B -->|예| C[주문 완료 대기 등록]
    B -->|아니오| D[주문완료 모달 등 즉시 실행]
  end
  subgraph SSE["SSE 수신 시"]
    C --> E[ORDER_COMPLETE]
    C --> F[POS_ERROR]
    E --> G[성공 콜백 실행]
    F --> H[실패 콜백 실행]
  end
```

- **연동 시**: `setPendingOrder(orderGroupUuid, onSuccess, onFailure)` 등록 → UUID 일치하는 SSE 시 콜백 실행.
- **미연동 시**: 성공 콜백 즉시 실행(주문완료 모달 등).
- **판단**: `isPosLinked = !!shopPosCode && shopPosCode !== 'NONE'`

---

## 브릿지 (Payment, @repo/util/app)

| 메서드      | 용도                                                             |
| ----------- | ---------------------------------------------------------------- |
| **approve** | 카드 승인(D1). 실패 시 `Payment.cancel` 호출하여 환불 처리.      |
| **cancel**  | 카드 취소(D4). `postPaymentApproval` 실패 시 사용하여 환불 처리. |
| **stop**    | 결제 중단. 모달 cleanup 시 호출.                                 |

할부: `formatInstallmentMonthsToString` → `"00"`(일시불), `"02"`~`"24"`, `"36"`/`"48"`/`"60"`. 5만 원 미만은 일시불.

---

## 카드 결제 (단일)

**파일**: `CardPaymentInstallmentModal/index.tsx`

```mermaid
flowchart TD
  A[할부 선택] --> B[결제 진행 모달 표시]
  B --> C[카드 단말기 승인 요청]
  C --> D[주문 생성 API]
  D --> E[서버에 결제 승인 전송]
  E --> F{성공?}
  F -->|아니오| G[카드 취소 요청 + 에러 안내]
  F -->|예| H{POS 연동?}
  H -->|예| I[주문 완료 대기 등록]
  H -->|아니오| J[주문완료 모달 표시]
  I --> K[SSE 수신 대기]
  K --> L[ORDER_COMPLETE 수신]
  K --> M[POS_ERROR 수신]
  L --> N{대기 중 주문 UUID와 일치?}
  M --> O{대기 중 주문 UUID와 일치?}
  N -->|예| P[성공 콜백 실행]
  O -->|예| Q[실패 콜백 실행]
  C -.->|사용자 취소| R[모달만 닫기]
```

- 에러: 사용자 취소 → 모달만 닫기. 그 외 → 다이얼로그. POS_ERROR → 실패 콜백.

---

## 나눠서 결제

**파일**: `SplitPaymentModal/index.tsx` · 메뉴별/인원별 나누기, 첫 결제 시에만 `createOrder` 후 동일 주문으로 `postPaymentApproval` 반복.

```mermaid
flowchart TD
  A[결제할 금액 선택] --> B[카드 단말기 승인 요청]
  B --> C{주문 이미 생성됨?}
  C -->|아니오| D[주문 생성 API]
  C -->|예| E[기존 주문 UUID 사용]
  D --> E
  E --> F[서버에 결제 승인 전송]
  F --> G{전체 금액 결제 완료?}
  G -->|아니오| H[성공 토스트 + 모달 유지]
  G -->|예| I{POS 연동?}
  I -->|예| J[주문 완료 대기 등록]
  I -->|아니오| K[주문완료 모달 표시]
  J --> L[SSE 수신 대기]
  L --> M[ORDER_COMPLETE 수신]
  L --> N[POS_ERROR 수신]
  M --> O{대기 중 주문 UUID와 일치?}
  N --> P{대기 중 주문 UUID와 일치?}
  O -->|예| Q[성공 콜백 실행]
  P -->|예| R[실패 콜백 실행]
```

---

## 기타 SSE와 결제

- **ORDER 메시지(handleOrderMessage)**: 주문 데이터 갱신 후, 결제 관련 모달(현금 유도 / 나눠서 / 카드 할부)이 열려 있고, 해당 테이블이 **전액 결제 완료**(totalAmount - paidAmount === 0)이면 `closeAllModals()` 호출. 다른 경로(예: 관리자 측 정산)로 전액 결제된 경우에도 모달이 자동으로 닫힘.

---

## 관련 파일

| 역할                | 파일                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 장바구니·주문 확인  | `CartButton/index.tsx` (executePostpaidOrder, 모달 열기), `CartList/index.tsx` (주문하기 확인, openPaymentsModal) |
| 결제 방법 선택      | `PaymentsModal/index.tsx`                                                                                         |
| 카드(단일) / 나눠서 | `CardPaymentInstallmentModal`, `SplitPaymentModal`                                                                |
| 브릿지·API          | `@repo/util/app` Payment, `usePostPaymentApproval`                                                                |
