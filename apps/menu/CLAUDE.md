# CLAUDE.md — apps/menu

This file provides guidance to Claude Code when working with the menu app.

> 코드 수정 전 관련 참조 문서를 먼저 읽을 것.

## 참조 문서

| 작업 범위 | 문서 |
|-----------|------|
| 결제·주문 코드 수정 | `apps/menu/docs/payment-flow.md` |
| 카테고리 노출·SSE MENU 수정 | `apps/menu/docs/category-visibility.md` |
| 광고 기능 수정 (AdMediaSlider·TopBannerAd·AdStore·SSE AD_MENU 등) | `apps/menu/docs/ad-system.md` |
| 컴포넌트·스타일·타입 작성 | `docs/conventions.md` |

## 문서 최신화 규칙

참조 문서가 있는 작업 범위의 코드를 수정한 경우, 수정 완료 후 반드시 아래 절차를 따를 것:

1. 변경한 내용이 해당 참조 문서의 설명과 일치하는지 확인한다.
2. 문서 내용이 코드와 달라진 부분이 있으면 즉시 문서를 업데이트한다.
3. 사용자가 별도로 요청하지 않아도 이 절차를 수행한다.
