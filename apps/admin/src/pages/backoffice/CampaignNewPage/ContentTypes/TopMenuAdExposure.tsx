import React, { useState } from 'react';
import { Typography, Button, Tag, Tooltip, Space, Alert } from 'antd';
import { MenuOutlined, PictureFilled, DeleteOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import AdTagSearchModal, { type AdTagData } from '../AdTagSearchModal';
import { useListDragAndDrop } from '../useDragAndDrop';

const { Text } = Typography;

// --- Types ---
export interface MenuItem {
  id: string;
  name: string;
  code: string;
  price: string;
  status: string;
}

// --- Emotion Styles ---
const Container = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 32px;
  background-color: #fff;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fff;
  cursor: grab;
  transition: box-shadow 0.2s;

  &:active {
    cursor: grabbing;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DragHandle = styled.div`
  color: #bfbfbf;
  font-size: 18px;
  margin-right: 24px;
  display: flex;
  align-items: center;
`;

const ImagePlaceholder = styled.div`
  width: 56px;
  height: 56px;
  background-color: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #adb5bd;
  font-size: 24px;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// --- Mock Data ---
export const initialMenuItems: MenuItem[] = [
  { id: '1', name: '크러시', code: 'G121', price: '5,000원', status: '진행중' },
  { id: '2', name: '새로', code: 'G122', price: '4,500원', status: '진행중' },
  { id: '3', name: '콜라', code: 'G123', price: '2,000원', status: '진행중' },
];

// --- Sub Components ---
interface TopMenuAdListItemProps {
  item: MenuItem;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
}

const TopMenuAdListItem: React.FC<TopMenuAdListItemProps> = ({
  item,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDelete,
}) => {
  return (
    <ListItem
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()} // 드롭 허용 필수
    >
      <DragHandle>
        <MenuOutlined />
      </DragHandle>
      <ImagePlaceholder>
        <PictureFilled />
      </ImagePlaceholder>
      <ItemInfo>
        <Text strong style={{ fontSize: '15px', color: '#262626' }}>
          {item.name} ({item.code})
        </Text>
      </ItemInfo>
      <Space size="middle">
        <Tooltip title="삭제">
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: '#8c8c8c' }} />}
            onClick={(e) => {
              e.stopPropagation(); // ListItem 클릭 이벤트 방지
              onDelete(item.id);
            }}
          />
        </Tooltip>
      </Space>
    </ListItem>
  );
};

export interface TopMenuAdExposureProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const TopMenuAdExposure: React.FC<TopMenuAdExposureProps> = ({
  menuItems,
  setMenuItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Custom Hook 적용 ---
  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useListDragAndDrop(menuItems, setMenuItems);

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmAdTag = (data: AdTagData) => {
    if (!data.selectedItem) {
      // 메뉴가 선택되지 않았으면 아무것도 하지 않음
      return;
    }

    // 새 메뉴 아이템 생성
    const newMenuItem: MenuItem = {
      id: String(Date.now()), // 고유 ID 생성
      name: data.selectedItem,
      // 나머지 정보는 임시 데이터로 채움
      code: `AD-${Math.floor(Math.random() * 1000)}`,
      price: '광고 상품',
      status: '진행중',
    };

    setMenuItems([...menuItems, newMenuItem]);
  };

  return (
    <Container>
      {/* 1. 상단 타이틀 및 버튼 */}
      <HeaderRow>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={menuItems.length >= 3} // 3개 이상일 경우 비활성화
        >
          광고 메뉴 추가
        </Button>
      </HeaderRow>

      {/* 2. 드래그 가능한 리스트 영역 */}
      <ListContainer>
        {menuItems.map((item, index) => (
          <TopMenuAdListItem
            key={item.id}
            item={item}
            index={index}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onDelete={handleDelete}
          />
        ))}
      </ListContainer>

      {/* 4. 푸터 텍스트 */}
      <Text type="secondary" style={{ fontSize: '13px', paddingLeft: '8px' }}>
        • 광고 메뉴는 최대 3개만 노출됩니다.
      </Text>
      <AdTagSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAdTag}
      />
    </Container>
  );
};

export default TopMenuAdExposure;
