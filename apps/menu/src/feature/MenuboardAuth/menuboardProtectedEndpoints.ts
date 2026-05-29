/** URL 세그먼트 플레이스홀더 (슬래시를 제외한 임의 문자열) */
const SEG = '[^/]+';

const toPattern = (path: string): RegExp =>
  new RegExp(`^${path.replace(/\//g, '\\/')}$`);

/**
 * 관리자 모드에서 사용되는 API 목록 (X-Menuboard-Token 헤더 필요)
 * method + URL 패턴으로 정확히 식별
 */
const ADMIN_API_LIST: { method: string; pattern: RegExp }[] = [
  { method: 'GET', pattern: toPattern(`/order/${SEG}`) }, // 테이블별 현재 주문 목록 조회
  { method: 'GET', pattern: toPattern(`/device/list/${SEG}`) }, // 매장 디바이스 목록 조회
  { method: 'GET', pattern: toPattern(`/device/${SEG}/table/${SEG}`) }, // 테이블 선택 전 점유 여부 확인
  { method: 'POST', pattern: toPattern(`/order-group/${SEG}/${SEG}`) }, // 주문 그룹 생성
  { method: 'POST', pattern: toPattern(`/order/${SEG}/${SEG}`) }, // 테이블 주문 생성
  { method: 'PUT', pattern: toPattern(`/order/move/${SEG}`) }, // 드래그로 주문 테이블 이동
  { method: 'PUT', pattern: toPattern(`/order/share/${SEG}`) }, // 드래그로 주문 테이블 합석
  { method: 'PUT', pattern: toPattern(`/order/cancel/menu`) }, // 선택 메뉴 취소
  { method: 'PUT', pattern: toPattern(`/order/cancel/${SEG}/${SEG}`) }, // 전체 메뉴 취소
  { method: 'PUT', pattern: toPattern(`/order/clear/${SEG}/${SEG}`) }, // 테이블 초기화
  { method: 'POST', pattern: toPattern(`/order/custom-amount`) }, // 금액 변경/할인/서비스
  { method: 'POST', pattern: toPattern(`/order/pickup/${SEG}/${SEG}`) }, // 주문 알림 전송
  { method: 'GET', pattern: toPattern(`/sales/card-approval/${SEG}`) }, // 카드 승인 내역 조회
  { method: 'POST', pattern: toPattern(`/log/${SEG}/${SEG}`) }, // 디바이스 로그 전송
];

export const isMenuboardProtectedUrl = (
  url: string,
  method: string
): boolean => {
  const [path = ''] = url.split('?');
  return ADMIN_API_LIST.some(
    (api) => api.method === method.toUpperCase() && api.pattern.test(path)
  );
};
