import { TableGridContainer, type TableData } from '@repo/feature/components';
import { Sidebar } from './Sidebar';
import * as S from './orderPage.style';

const sampleTables: TableData[] = [
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

export const OrdersPage = () => {
  const handleTableClick = (_table: TableData) => {
    console.log('Table clicked:', _table);
  };

  return (
    <S.Container>
      <TableGridContainer
        tables={sampleTables}
        onTableClick={handleTableClick}
      />
      <Sidebar />
    </S.Container>
  );
};
