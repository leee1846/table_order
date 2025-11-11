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

export const menus = [
  {
    id: 1,
    name: '불고기 전골',
    description:
      '불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명',
    price: 10000,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    isBest: true,
    isNew: true,
    isSoldOut: false,
    isHidden: false,
    spicyLevel: 1,
  },
  {
    id: 2,
    name: '불고기 전골2',
    description:
      '불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    isBest: false,
    isNew: true,
    isSoldOut: true,
    isHidden: true,
    spicyLevel: 2,
  },
  {
    id: 3,
    name: '불고기 전골3',
    description:
      '불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명',
    price: 1000000,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    isBest: true,
    isNew: false,
    isSoldOut: true,
    isHidden: false,
    spicyLevel: 3,
  },
  {
    id: 4,
    name: '불고기 전골4',
    description:
      '불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명불고기 전골 설명',
    price: 1000000,
    image: '',
    isBest: false,
    isNew: false,
    isSoldOut: false,
    isHidden: false,
    spicyLevel: 0,
  },
];
