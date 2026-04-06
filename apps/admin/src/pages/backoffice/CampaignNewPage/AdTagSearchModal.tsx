import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Input,
  Upload,
  Button,
  Space,
  Select,
  type UploadFile,
} from 'antd';
import { CloseOutlined, PictureFilled, WarningFilled } from '@ant-design/icons';
import styled from '@emotion/styled';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// --- Types ---
interface AdTagSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: AdTagData) => void;
}

export interface AdTagData {
  selectedItem: string | null;
  adImage?: UploadFile;
  adDescription: string;
}

// --- Emotion Styles ---
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// "매장 설정보다 우선 적용" 하늘색 뱃지
const PriorityBadge = styled.span`
  background-color: #e6f7ff;
  color: #1677ff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: normal;
`;

// 하단 노란색 안내 배너
const WarningBanner = styled.div`
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// --- Component ---
const AdTagSearchModal: React.FC<AdTagSearchModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [adDescription, setAdDescription] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const resetState = () => {
    setSelectedItem(null);
    setAdDescription('');
    setFileList([]);
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm({
      selectedItem,
      adImage: fileList.length > 0 ? fileList[0] : undefined,
      adDescription,
    });
    resetState();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      width={600}
      centered
      // 모달 헤더 커스텀 (이미지처럼 남색 배경에 흰색 텍스트)
      title={
        <span style={{ color: '#fff', fontSize: '18px' }}>광고 메뉴 추가</span>
      }
      closeIcon={<CloseOutlined style={{ color: '#fff' }} />}
      styles={{
        header: {
          backgroundColor: '#1d2a6d',
          padding: '20px 24px',
          margin: 0,
          borderRadius: '8px 8px 0 0',
        },
        container: { padding: 0 },
        body: { padding: '32px 24px' },
      }}
      // 모달 푸터 (취소, 선택 완료 버튼)
      footer={
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <Button size="large" onClick={handleCancel}>
            취소
          </Button>
          <Button
            size="large"
            type="primary"
            //style={{ backgroundColor: '#1d2a6d' }}
            onClick={handleConfirm}
          >
            저장
          </Button>
        </div>
      }
    >
      <ContentWrapper>
        {/* 1. 선택된 메뉴 영역 */}
        <Section>
          <Text strong style={{ fontSize: '14px', color: '#262626' }}>
            메뉴 그룹 선택{' '}
            {/* <Text type="secondary" style={{ fontWeight: 'normal' }}>
              (1개만 선택 가능)
            </Text> */}
          </Text>

          <Select
            size="large"
            value={selectedItem}
            onChange={(value) => setSelectedItem(value)}
            placeholder="메뉴 그룹을 선택해주세요."
            style={{ width: '100%' }}
            allowClear
            options={[
              { value: '크러시', label: '크러시' },
              { value: '콜라', label: '콜라' },
              { value: '테라', label: '테라' },
              { value: '새로', label: '새로' },
            ]}
          />

          {/* <Text style={{ color: '#ff4d4f', fontSize: '13px' }}>
            ※ 광고 태그는 메뉴당 1개 캠페인에만 적용됩니다. 중복 선택 불가.
          </Text> */}
        </Section>

        {/* 2. 광고 이미지 업로드 영역 */}
        <Section>
          <LabelWrapper>
            <Text strong style={{ fontSize: '14px', color: '#262626' }}>
              광고 이미지
            </Text>
            {/* <PriorityBadge>매장 설정보다 우선 적용</PriorityBadge> */}
          </LabelWrapper>
          <Dragger
            accept=".jpg,.png,.gif"
            height={140}
            style={{ backgroundColor: '#fff', borderColor: '#d9d9d9' }}
            fileList={fileList}
            maxCount={1}
            beforeUpload={(file) => {
              setFileList([file]);
              return false; // 자동 업로드 방지
            }}
            onRemove={() => {
              setFileList([]);
            }}
          >
            <p className="ant-upload-drag-icon" style={{ margin: '0 0 8px 0' }}>
              <PictureFilled style={{ color: '#8c8c8c', fontSize: '36px' }} />
            </p>
            <p
              className="ant-upload-text"
              style={{ fontSize: '14px', color: '#8c8c8c', margin: 0 }}
            >
              클릭 또는 드래그하여 이미지 업로드
            </p>
            <p
              className="ant-upload-hint"
              style={{ fontSize: '12px', color: '#bfbfbf' }}
            >
              jpg, png, gif 파일만 지원
            </p>
          </Dragger>
        </Section>

        {/* 3. 광고 설명 문구 영역 */}
        <Section>
          <LabelWrapper>
            <Text strong style={{ fontSize: '14px', color: '#262626' }}>
              광고 설명 문구
            </Text>
            {/* <PriorityBadge>매장 설정보다 우선 적용</PriorityBadge> */}
          </LabelWrapper>
          <TextArea
            rows={3}
            value={adDescription}
            onChange={(e) => setAdDescription(e.target.value)}
            placeholder="예: 지금 주문하면 10% 할인! 한정 이벤트 진행 중"
            style={{ resize: 'none', borderRadius: '6px' }}
          />
        </Section>

        {/* 4. 하단 안내 배너 */}
        {/* <WarningBanner>
          <WarningFilled style={{ color: '#faad14' }} />
          <Text style={{ fontSize: '13px', color: '#595959' }}>
            여기서 입력한 이미지/설명은 매장 상세의 광고 설명보다 우선
            적용됩니다.
          </Text>
        </WarningBanner> */}
      </ContentWrapper>
    </Modal>
  );
};

export default AdTagSearchModal;
