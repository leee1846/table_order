import React, { useState } from 'react';
import { Typography, Button, Tooltip, Space, App } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import AdMenuAddModal, { type adMenuData } from './AdMenuAddModal';
import { useListDragAndDrop } from '../useDragAndDrop';
import { NumberBadge } from './UploadContent';
import { formatFileSizeKbToMb } from '../index';

const { Text } = Typography;

// --- Types ---
export interface MenuItem {
  id?: string | number;
  adType: string;
  filePath: string;
  fileName: string;
  fileSizeKb: number;
  menuGroupSeq: number;
  contentDescription: string;
  sortOrder: number;
  menuGroupName?: string;
  originFileObj?: File;
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

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FileMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetaBadge = styled.span`
  background-color: #f0f5ff;
  color: #1d2a6d;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

// --- Mock Data ---
export const initialMenuItems: MenuItem[] = [];

// --- Sub Components ---
interface TopMenuAdListItemProps {
  item: MenuItem;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItem) => void;
}

const TopMenuAdListItem: React.FC<TopMenuAdListItemProps> = ({
  item,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDelete,
  onEdit,
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
        {/*  <MenuOutlined /> */}
        <HolderOutlined style={{ fontSize: '20px', color: '#bfbfbf' }} />
      </DragHandle>
      {/*       <ImagePlaceholder>
        <PictureFilled />
        
      </ImagePlaceholder> */}
      <NumberBadge status="완료">{index + 1}</NumberBadge>
      <ItemInfo>
        <Text strong style={{ fontSize: '15px', color: '#262626' }}>
          {item.menuGroupName}
          {item.contentDescription ? ` (${item.contentDescription})` : ''}
        </Text>
        {item.fileName && (
          <FileMeta>
            <MetaBadge>{item.fileName}</MetaBadge>
            <MetaBadge style={{ backgroundColor: '#f5f5f5', color: '#595959' }}>
              {formatFileSizeKbToMb(item.fileSizeKb)}
            </MetaBadge>
          </FileMeta>
        )}
      </ItemInfo>
      <Space size="middle">
        <Tooltip title="수정">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#8c8c8c' }} />}
            onClick={(e) => {
              e.stopPropagation(); // ListItem 클릭 이벤트 방지
              onEdit(item);
            }}
          />
        </Tooltip>
        <Tooltip title="삭제">
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: '#8c8c8c' }} />}
            onClick={(e) => {
              e.stopPropagation(); // ListItem 클릭 이벤트 방지
              onDelete(String(item.id));
            }}
          />
        </Tooltip>
      </Space>
    </ListItem>
  );
};

export interface AdMenuContentProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

const AdMenuContent: React.FC<AdMenuContentProps> = ({
  menuItems,
  setMenuItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { message } = App.useApp();

  // --- Custom Hook 적용 ---
  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useListDragAndDrop(menuItems, setMenuItems);

  const handleDelete = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => String(item.id) !== id));
  };

  const handleConfirmAdTag = (data: adMenuData) => {
    if (!data.selectedItem) {
      // 메뉴가 선택되지 않았으면 아무것도 하지 않음
      return;
    }

    const selectedMenuGroupSeq = data.selectedItem?.menuGroupSeq;

    // 수정 모드가 아닐 때, 또는 수정 모드이지만 menuGroupSeq가 변경되었을 때 중복 체크
    const isDuplicate = menuItems.some(
      (item) =>
        item.menuGroupSeq === selectedMenuGroupSeq &&
        item.id !== editingItem?.id
    );

    if (isDuplicate) {
      message.warning('이미 추가된 메뉴 그룹입니다.');
      return;
    }

    const uploadFile = data.adImage;

    if (editingItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                filePath: uploadFile?.url || '',
                fileName: uploadFile?.name || '',
                fileSizeKb:
                  uploadFile && uploadFile.size
                    ? Math.round(uploadFile.size / 1024)
                    : 0,
                menuGroupSeq: data.selectedItem!.menuGroupSeq,
                contentDescription: data.adDescription || '',
                menuGroupName: data.selectedItem!.menuGroupName || '',
                originFileObj: uploadFile
                  ? uploadFile.originFileObj
                  : undefined,
              }
            : item
        )
      );
    } else {
      // 새 메뉴 아이템 생성
      const newMenuItem: MenuItem = {
        id: `new-${Date.now()}`,
        adType: 'AD_MENU_IMAGE',
        filePath: '',
        fileName: uploadFile?.name || '',
        fileSizeKb:
          uploadFile && uploadFile.size
            ? Math.round(uploadFile.size / 1024)
            : 0,
        menuGroupSeq: data.selectedItem.menuGroupSeq,
        contentDescription: data.adDescription || '',
        sortOrder: menuItems.length + 1,
        menuGroupName: data.selectedItem.menuGroupName || '',
        originFileObj: uploadFile ? uploadFile.originFileObj : undefined,
      };
      setMenuItems([...menuItems, newMenuItem]);
    }
  };

  return (
    <Container>
      {/* 1. 상단 타이틀 및 버튼 */}
      <HeaderRow>
        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          disabled={menuItems.length >= 3} // 3개 이상일 경우 비활성화
        >
          광고 메뉴 추가
        </Button>
      </HeaderRow>

      {/* 2. 드래그 가능한 리스트 영역 */}
      <ListContainer>
        {menuItems.map((item, index) => (
          <TopMenuAdListItem
            key={Number(index)}
            item={item}
            index={index}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onDelete={handleDelete}
            onEdit={(item) => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
          />
        ))}
      </ListContainer>

      {/* 4. 푸터 텍스트 */}
      <Text type="secondary" style={{ fontSize: '13px', paddingLeft: '8px' }}>
        • 광고 메뉴는 최대 3개만 노출됩니다.
      </Text>
      <AdMenuAddModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onConfirm={handleConfirmAdTag}
        initialData={editingItem || undefined}
      />
    </Container>
  );
};

export default AdMenuContent;
