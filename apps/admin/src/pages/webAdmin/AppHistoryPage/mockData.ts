export interface AppHistoryItem {
  id: number;
  type: string; // 구분
  deployDateTime: string; // 배포일시
  version: string; // 버전
  title: string; // 제목
}

export const MOCK_APP_HISTORY_DATA: AppHistoryItem[] = [
  {
    id: 1,
    type: '배포',
    deployDateTime: '2024-01-15 14:30:00',
    version: '1.2.3',
    title: '주문 관리 기능 개선',
  },
  {
    id: 2,
    type: '롤백',
    deployDateTime: '2024-01-14 10:15:00',
    version: '1.2.2',
    title: '결제 시스템 업데이트',
  },
  {
    id: 3,
    type: '배포',
    deployDateTime: '2024-01-13 16:45:00',
    version: '1.2.1',
    title: 'UI 개선 및 버그 수정',
  },
  {
    id: 4,
    type: '배포',
    deployDateTime: '2024-01-12 09:20:00',
    version: '1.2.0',
    title: '신규 기능 추가',
  },
  {
    id: 5,
    type: '배포',
    deployDateTime: '2024-01-11 13:00:00',
    version: '1.1.9',
    title: '성능 최적화',
  },
  {
    id: 6,
    type: '롤백',
    deployDateTime: '2024-01-10 11:30:00',
    version: '1.1.8',
    title: '보안 패치',
  },
  {
    id: 7,
    type: '배포',
    deployDateTime: '2024-01-09 15:20:00',
    version: '1.1.7',
    title: '데이터베이스 마이그레이션',
  },
  {
    id: 8,
    type: '배포',
    deployDateTime: '2024-01-08 10:00:00',
    version: '1.1.6',
    title: 'API 개선',
  },
  {
    id: 9,
    type: '배포',
    deployDateTime: '2024-01-07 14:15:00',
    version: '1.1.5',
    title: '알림 기능 추가',
  },
  {
    id: 10,
    type: '배포',
    deployDateTime: '2024-01-06 16:00:00',
    version: '1.1.4',
    title: '리포트 기능 개선',
  },
];

export const MOCK_TOTAL_PAGES = 5;

