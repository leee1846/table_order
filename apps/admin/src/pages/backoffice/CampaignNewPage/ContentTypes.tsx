import React, { useState } from 'react';
import { Tabs, type TabsProps } from 'antd';
import styled from '@emotion/styled';
import UploadContent, { type UploadedFile } from './ContentTypes/UploadContent';
import AdMenuContent, {
  type AdMenuContentProps,
} from './ContentTypes/AdMenuContent';
import OrderFormImageSettings from './ContentTypes/OrderFormImageSettings';
import { useRecordDragAndDrop } from './useDragAndDrop';

// --- Emotion Styles ---
const InnerContainer = styled.div`
  border: 1px solid #003399;
  padding: 1px;
  background: #fff;
`;

export const SUB_TABS = ['주문 대기', '상단 배너', '광고 메뉴', '주문 완료'];

export interface ContentTypesProps extends AdMenuContentProps {
  filesByTab: Record<string, UploadedFile[]>;
  setFilesByTab: React.Dispatch<
    React.SetStateAction<Record<string, UploadedFile[]>>
  >;
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
          <AdMenuContent menuItems={menuItems} setMenuItems={setMenuItems} />
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
          acceptType={idx === 0 ? 'orderStandby' : 'topBanner'}
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
