import React from 'react';
import { Typography, Divider, Radio } from 'antd';
import styled from '@emotion/styled';
import UploadContent, { type UploadedFile } from './UploadContent';
import { useListDragAndDrop } from '../useDragAndDrop';

const { Title, Text } = Typography;

// --- Emotion Styles ---
const LayoutWrapper = styled.div`
  display: flex;
  min-height: 500px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

// 왼쪽 영역 (비워둠)
const LeftArea = styled.div`
  flex: 1;
  padding: 24px;
`;

// 오른쪽 설정 패널
const RightArea = styled.div`
  width: 360px;
  background-color: #fff;
  border-left: 1px solid #e2e8f0;
  padding: 24px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const SectionLabel = styled.div`
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 8px;

  .required {
    color: #ff4d4f;
    margin-left: 4px;
  }
`;

// 카드 형태의 커스텀 라디오 버튼
const TypeCard = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid ${(props) => (props.selected ? '#1d2a6d' : '#d9d9d9')};
  background-color: ${(props) => (props.selected ? '#f0f5ff' : '#fff')};
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => (props.selected ? '#1d2a6d' : '#1d2a6d')};
  }

  .ant-radio-wrapper {
    margin-right: 0;
  }

  .ant-radio {
    margin-top: 2px;
    margin-right: 12px;
  }

  /* 라디오 버튼 선택 시 내부 동그라미 색상 커스텀 */
  .ant-radio-checked .ant-radio-inner {
    border-color: #1d2a6d;
    background-color: #1d2a6d;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export interface OrderFormImageSettingsProps {
  exposureType: 'full' | 'half';
  setExposureType: React.Dispatch<React.SetStateAction<'full' | 'half'>>;
  orderFiles: UploadedFile[];
  setOrderFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const OrderFormImageSettings: React.FC<OrderFormImageSettingsProps> = ({
  exposureType,
  setExposureType,
  orderFiles,
  setOrderFiles,
}) => {
  // --- Custom Hook 적용 ---
  const { handleDragStart, handleDragEnter, handleDragEnd } =
    useListDragAndDrop(orderFiles, setOrderFiles);

  const handleDelete = (id: string) => {
    setOrderFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleUpload = (file: UploadedFile) => {
    setOrderFiles((prev) => [...prev, file]);
  };

  return (
    <LayoutWrapper>
      {/* 1. 왼쪽 파일 업로드 영역 */}
      <LeftArea>
        <UploadContent
          files={orderFiles}
          handleDragStart={handleDragStart}
          handleDragEnter={handleDragEnter}
          handleDragEnd={handleDragEnd}
          handleDelete={handleDelete}
          acceptType={exposureType === 'full' ? 'fullScreenAd' : 'orderForm'}
          handleUpload={handleUpload}
        />
      </LeftArea>

      {/* 2. 오른쪽 설정 영역 */}
      <RightArea>
        <Title level={5} style={{ color: '#1d2a6d', margin: 0 }}>
          주문서 광고 설정
        </Title>
        <Divider style={{ margin: '16px 0', borderColor: '#e2e8f0' }} />

        {/* 광고 노출 유형 선택 */}
        <div style={{ marginBottom: '24px' }}>
          <SectionLabel>
            광고 노출 유형 <span className="required">*</span>
          </SectionLabel>

          <Radio.Group
            value={exposureType}
            onChange={(e) => {
              setExposureType(e.target.value);
              setOrderFiles([]); // 유형이 변경될 때 파일 목록 초기화
            }}
            style={{ width: '100%' }}
          >
            <TypeCard selected={exposureType === 'full'}>
              <Radio value="full" />
              <CardContent>
                <Text strong style={{ color: '#262626' }}>
                  전면 (영상/이미지)
                </Text>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  주문 완료 후 전체 영역에 노출
                </Text>
              </CardContent>
            </TypeCard>

            <TypeCard selected={exposureType === 'half'}>
              <Radio value="half" />
              <CardContent>
                <Text strong style={{ color: '#262626' }}>
                  주문서 (이미지)
                </Text>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  주문 완료 후 좌측 영역에 노출
                </Text>
              </CardContent>
            </TypeCard>
          </Radio.Group>
        </div>

        {/* 주의사항 알림창 */}
        {/*         <Alert
          title="광고 설정이 매장 설정보다 우선 적용됩니다."
          type="warning"
          showIcon
          style={{
            marginBottom: '24px',
            backgroundColor: '#fffbe6',
            borderColor: '#ffe58f',
          }}
        /> */}

        {/* 업로드 가능 포맷 안내 */}
        {/* <div>
          <SectionLabel>업로드 가능 포맷</SectionLabel>
          <Space size="small" style={{ marginBottom: '12px' }}>
            <FormatTag>mp4</FormatTag>
            <FormatTag>jpg</FormatTag>
            <FormatTag>png</FormatTag>
          </Space>
          <Text type="secondary" style={{ display: 'block', fontSize: '13px' }}>
            풀스크린: 영상(mp4) 또는 이미지(jpg, png)
          </Text>
        </div> */}
      </RightArea>
    </LayoutWrapper>
  );
};

export default OrderFormImageSettings;
