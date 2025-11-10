// TODO
// 개발 완료시 삭제 예정

export const categories = [
  {
    id: 1,
    name: '카테고리 1',
    startTime: '16:00',
    endTime: '18:00',
    days: ['월', '화', '수', '목', '금', '토', '일'],
    countable: true,
    layout: true,
    isHidden: false,
  },
  {
    id: 2,
    name: '카테고리 2',
    startTime: '03:00',
    endTime: '18:00',
    days: ['월', '화', '토', '일'],
    countable: false,
    layout: false,
    isHidden: true,
  },
  {
    id: 3,
    name: '카테고리 3',
    days: ['월', '화', '수', '목', '금', '토', '일'],
    countable: false,
    layout: true,
    isHidden: false,
  },
  {
    id: 4,
    name: '카테고리 4',
    startTime: '16:00',
    endTime: '18:00',
    days: [],
    countable: true,
    layout: false,
    isHidden: true,
  },
];
