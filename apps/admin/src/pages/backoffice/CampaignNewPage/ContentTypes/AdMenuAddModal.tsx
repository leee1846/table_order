import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Input,
  Upload,
  Button,
  App,
  Select,
  type UploadFile,
} from 'antd';
import { CloseOutlined, PictureFilled } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useGetMenuGroupList } from '@repo/api/queries';
import type { IMenuGroup } from '@repo/api/types';
import { IMAGE_DIMENSIONS } from './UploadContent';
import type { MenuItem } from './AdMenuContent';
import type { RcFile } from 'antd/es/upload';

const { Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// --- Types ---
interface AdMenuAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: adMenuData) => void;
  initialData?: MenuItem;
}

export interface adMenuData {
  selectedItem?: IMenuGroup | null;
  adImage?: UploadFile | undefined;
  adDescription?: string;
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

const RequiredMark = styled.span`
  color: #ff4d4f;
  margin-left: 4px;
`;

// --- Component ---
const AdMenuAddModal: React.FC<AdMenuAddModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}) => {
  const [selectedSeq, setSelectedSeq] = useState<string | null>(null);
  const [adDescription, setAdDescription] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { message } = App.useApp();

  // API에서 메뉴 그룹 목록 조회
  const { data: menuGroupResponse, isFetching } = useGetMenuGroupList({
    page: 0,
    size: 10000, // 메뉴 그룹을 충분히 불러오기 위해 넉넉한 사이즈 지정
  });

  const menuGroupOptions = (menuGroupResponse?.data?.content || []).map(
    (group: IMenuGroup) => ({
      value: String(group.menuGroupSeq),
      label: `${group.menuGroupName} (${group.menuGroupTag})`,
    })
  );

  const resetState = () => {
    setSelectedSeq(null);
    setAdDescription('');
    setFileList([]);
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setSelectedSeq(String(initialData.menuGroupSeq));
        setAdDescription(initialData.contentDescription || '');
        if (initialData.originFileObj || initialData.filePath) {
          setFileList([
            {
              uid: String(initialData.id) || '',
              name: initialData.fileName || '',
              status: 'done',
              url: initialData.filePath || undefined,
              size: initialData.fileSizeKb * 1024,
              originFileObj: initialData.originFileObj as RcFile,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        resetState();
      }
    }
  }, [isOpen, initialData]);

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedSeq) {
      message.warning('메뉴 그룹을 선택해주세요.');
      return;
    }

    const file = fileList[0];
    if (!file) {
      message.warning('광고 이미지를 업로드해주세요.');
      return;
    }
    onConfirm({
      selectedItem:
        menuGroupResponse?.data?.content.find(
          (group: IMenuGroup) => group.menuGroupSeq === Number(selectedSeq)
        ) || null,
      adImage: {
        ...file,
        name: file.name,
        url: file.url,
        size: file.size,
        originFileObj: file as RcFile,
      },
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
            메뉴 그룹 선택<RequiredMark>*</RequiredMark>
            {/* <Text type="secondary" style={{ fontWeight: 'normal' }}>
              (1개만 선택 가능)
            </Text> */}
          </Text>

          <Select
            size="large"
            value={selectedSeq}
            onChange={(value) => setSelectedSeq(value)}
            placeholder="메뉴 그룹을 선택해주세요."
            style={{ width: '100%' }}
            allowClear
            loading={isFetching}
            options={menuGroupOptions}
          />

          {/* <Text style={{ color: '#ff4d4f', fontSize: '13px' }}>
            ※ 광고 태그는 메뉴당 1개 캠페인에만 적용됩니다. 중복 선택 불가.
          </Text> */}
        </Section>

        {/* 2. 광고 이미지 업로드 영역 */}
        <Section>
          <LabelWrapper>
            <Text strong style={{ fontSize: '14px', color: '#262626' }}>
              광고 이미지<RequiredMark>*</RequiredMark>
            </Text>
            {/* <PriorityBadge>매장 설정보다 우선 적용</PriorityBadge> */}
          </LabelWrapper>
          <Dragger
            accept=".jpg,.jpeg,.png,.gif"
            height={140}
            style={{ backgroundColor: '#fff', borderColor: '#d9d9d9' }}
            fileList={fileList}
            maxCount={1}
            beforeUpload={(file) => {
              return new Promise<string | boolean>((resolve) => {
                const extension = file.name
                  .substring(file.name.lastIndexOf('.'))
                  .toLowerCase();
                const isImage =
                  file.type.startsWith('image/') ||
                  ['.jpg', '.jpeg', '.png', '.gif'].includes(extension);

                if (!['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
                  message.error(
                    '지원하지 않는 파일 형식입니다. (jpg, png, gif만 지원)'
                  );
                  return resolve(Upload.LIST_IGNORE);
                }
                if (isImage && file.size > 1 * 1024 * 1024) {
                  message.error('이미지 크기는 1MB 이하여야 합니다.');
                  return resolve(Upload.LIST_IGNORE);
                }

                const img = new Image();
                const adMenuDim = IMAGE_DIMENSIONS.adMenu;
                img.onload = () => {
                  URL.revokeObjectURL(img.src);
                  if (
                    img.width !== adMenuDim.width ||
                    img.height !== adMenuDim.height
                  ) {
                    message.error(
                      `이미지 규격이 맞지 않습니다. (권장: ${adMenuDim.width} x ${adMenuDim.height}, 현재: ${img.width} x ${img.height})`
                    );
                    resolve(Upload.LIST_IGNORE);
                  } else {
                    setFileList([file]);
                    resolve(false); // 자동 업로드 방지
                  }
                };
                img.onerror = () => {
                  URL.revokeObjectURL(img.src);
                  message.error('이미지 파일을 읽을 수 없습니다.');
                  resolve(Upload.LIST_IGNORE);
                };
                img.src = URL.createObjectURL(file);
              });
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
              {`jpg, png, gif 파일만 지원 (1MB 이하, ${
                IMAGE_DIMENSIONS.adMenu.width
              } x ${IMAGE_DIMENSIONS.adMenu.height})`}
            </p>
          </Dragger>
        </Section>

        {/* 3. 광고 설명 문구 영역 */}
        <Section>
          <LabelWrapper>
            <Text strong style={{ fontSize: '14px', color: '#262626' }}>
              광고 설명
            </Text>
            {/* <PriorityBadge>매장 설정보다 우선 적용</PriorityBadge> */}
          </LabelWrapper>
          <TextArea
            rows={3}
            value={adDescription}
            onChange={(e) => setAdDescription(e.target.value)}
            placeholder="입력하세요."
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

export default AdMenuAddModal;
