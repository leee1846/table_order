// TODO
// 개발 완료시 삭제 예정

import type { TableData } from '@repo/feature/components';

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

// /tables 페이지 목업 데이터
export const sampleTables: TableData[] = [
  {
    id: 1,
    tableNumber: 1,
    orderTime: '12:14',
    menuItems: [
      { name: 'Menu', quantity: 2 },
      { name: 'Menu', quantity: 1 },
      { name: 'Menu', quantity: 1 },
    ],
    batteryLevel: 85,
    totalAmount: 21000,
  },
  {
    id: 2,
    tableNumber: 2,
    orderTime: '11:30',
    menuItems: [
      { name: 'Menu', quantity: 3 },
      { name: 'Menu', quantity: 2 },
    ],
    batteryLevel: 40,
    totalAmount: 35000,
  },
  {
    id: 3,
    tableNumber: 3,
    batteryLevel: 30,
  },
  {
    id: 4,
    tableNumber: 4,
    batteryLevel: 100,
  },
  {
    id: 5,
    tableNumber: 5,
    orderTime: '13:05',
    menuItems: [
      { name: 'Menu', quantity: 1 },
      { name: 'Menu', quantity: 1 },
    ],
    batteryLevel: 20,
    totalAmount: 15000,
  },
  {
    id: 6,
    tableNumber: 6,
    batteryLevel: 100,
  },
  {
    id: 7,
    tableNumber: 11,
    orderTime: '12:45',
    menuItems: [{ name: 'Menu', quantity: 4 }],
    batteryLevel: 65,
    totalAmount: 28000,
  },
  {
    id: 8,
    tableNumber: 10,
    batteryLevel: 100,
  },
  {
    id: 9,
    tableNumber: 9,
    batteryLevel: 100,
  },
  {
    id: 10,
    tableNumber: 8,
    orderTime: '11:20',
    menuItems: [
      { name: 'Menu', quantity: 2 },
      { name: 'Menu', quantity: 2 },
      { name: 'Menu', quantity: 1 },
    ],
    batteryLevel: 78,
    totalAmount: 42000,
  },
  {
    id: 11,
    tableNumber: 7,
    batteryLevel: 100,
  },
  {
    id: 12,
    tableNumber: 12,
    batteryLevel: 19,
  },
];
