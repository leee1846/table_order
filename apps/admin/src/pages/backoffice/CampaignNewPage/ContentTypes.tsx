import React, { useState } from 'react';
import { Tabs, type TabsProps } from 'antd';
import styled from '@emotion/styled';
import UploadContent, { type UploadedFile } from './UploadContent';
import TopMenuAdExposure, {
  type MenuItem,
} from './ContentTypes/TopMenuAdExposure';
import OrderFormImageSettings from './ContentTypes/OrderFormImageSettings';
import { useRecordDragAndDrop } from './useDragAndDrop';

// --- Emotion Styles ---
const InnerContainer = styled.div`
  border: 1px solid #003399;
  padding: 1px;
  background: #fff;
`;

// --- Mock Data ---
export const initialFiles: UploadedFile[] = [
  {
    id: '1',
    name: '새로_여름.mp4',
    duration: '14초',
    size: '8.2MB',
    status: '완료',
  },
  {
    id: '2',
    name: 'test_video.mp4',
    duration: '22초',
    size: '14MB',
    status: '오류 : 15초 초과',
  },
  {
    id: '3',
    name: 'test_video.mp4',
    duration: '15초',
    size: '33MB',
    status: '오류 : 30MB 초과',
  },
];

export const SUB_TABS = ['주문 대기', '상단 배너', '광고 메뉴', '주문 완료'];

export interface ContentTypesProps {
  filesByTab: Record<string, UploadedFile[]>;
  setFilesByTab: React.Dispatch<
    React.SetStateAction<Record<string, UploadedFile[]>>
  >;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  exposureType: 'full' | 'half';
  setExposureType: React.Dispatch<React.SetStateAction<'full' | 'half'>>;
  orderFiles: UploadedFile[];
  setOrderFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const ContentTypes: React.FC<ContentTypesProps> = ({
  filesByTab,
  setFilesByTab,
  menuItems,
  setMenuItems,
  exposureType,
  setExposureType,
  orderFiles,
  setOrderFiles,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // --- Custom Hook 적용 ---
  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useRecordDragAndDrop(setFilesByTab);

  const handleDelete = (id: string, tabKey: string) => {
    setFilesByTab((prev) => ({
      ...prev,
      [tabKey]: (prev[tabKey] || []).filter((file) => file.id !== id),
    }));
  };

  const handleUpload = (file: UploadedFile, tabKey: string) => {
    setFilesByTab((prev) => ({
      ...prev,
      [tabKey]: [...(prev[tabKey] || []), file],
    }));
  };

  const items: TabsProps['items'] = SUB_TABS.map((tab, idx) => {
    const tabKey = String(idx);

    if (idx === 2) {
      return {
        key: tabKey,
        label: tab,
        forceRender: true, // 탭 이동 시 렌더링 파기 방지
        children: (
          <TopMenuAdExposure
            menuItems={menuItems}
            setMenuItems={setMenuItems}
          />
        ),
      };
    }

    if (idx === 3) {
      return {
        key: tabKey,
        label: tab,
        forceRender: true, // 탭 이동 시 렌더링 파기 방지
        children: (
          <OrderFormImageSettings
            exposureType={exposureType}
            setExposureType={setExposureType}
            orderFiles={orderFiles}
            setOrderFiles={setOrderFiles}
          />
        ),
      };
    }

    return {
      key: tabKey,
      label: tab,
      forceRender: true, // 탭 이동 시 렌더링 파기 방지
      children: (
        <UploadContent
          files={filesByTab[tabKey] || []}
          handleDragStart={handleDragStart}
          handleDragEnter={(index) => handleDragEnter(index, tabKey)}
          handleDragEnd={handleDragEnd}
          handleDelete={(id) => handleDelete(id, tabKey)}
          acceptType={idx === 0 ? 'imageAndVideo' : 'image'}
          handleUpload={(file) => handleUpload(file, tabKey)}
        />
      ),
    };
  });

  return (
    <InnerContainer>
      <Tabs
        items={items}
        activeKey={String(activeTab)}
        onChange={(key) => setActiveTab(Number(key))}
        type="line"
        tabBarStyle={{
          marginBottom: 24,
          paddingTop: '8px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      />
    </InnerContainer>
  );
};

export default ContentTypes;
