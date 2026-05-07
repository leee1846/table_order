import React from 'react';
import { Typography, Upload, Tooltip, message } from 'antd';
import {
  HolderOutlined,
  DeleteOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { formatFileSizeKbToMb } from '../index';

const { Text } = Typography;
const { Dragger } = Upload;

// --- Types ---
export type UploadStatus = '완료' | '오류 : 15초 초과' | '오류 : 30MB 초과';

export interface UploadedFile {
  id: string;
  url?: string;
  name: string;
  duration?: string;
  durationSec?: number;
  fileSizeKb?: string | number;
  status: UploadStatus;
  originFileObj?: File;
  sortOrder?: number;
}

export type AcceptType =
  | 'orderStandby' // 1. 주문 대기
  | 'topBanner' // 2. 상단 배너
  | 'adMenu' // 3. 광고 메뉴
  | 'fullScreenAd' // 4. 전면 광고
  | 'orderForm'; // 5. 주문서

// --- Constants ---
export const IMAGE_DIMENSIONS: Record<
  AcceptType,
  { width: number; height: number }
> = {
  orderStandby: { width: 1280, height: 720 },
  topBanner: { width: 750, height: 135 },
  adMenu: { width: 336, height: 240 },
  fullScreenAd: { width: 1280, height: 720 },
  orderForm: { width: 480, height: 640 },
};

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

// --- Emotion Styles ---
const UploadSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 0 24px;
`;

const ListContainer = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.div<{ status: UploadStatus }>`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid
    ${(props) => (props.status === '완료' ? '#e6f0e2' : '#ffa39e')};
  background-color: ${(props) =>
    props.status === '완료' ? '#fff' : '#fff1f0'};
  border-radius: 8px;
`;

export const NumberBadge = styled.div<{ status?: UploadStatus | string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) =>
    !props.status || props.status === '완료' ? '#1d2a6d' : '#d9363e'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
`;

const FileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
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

interface UploadContentProps {
  files: UploadedFile[];
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  handleDelete: (id: string) => void;
  acceptType?: AcceptType;
  handleUpload?: (file: UploadedFile) => void;
}

// --- Component ---
const UploadContent: React.FC<UploadContentProps> = ({
  files,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  handleDelete,
  acceptType = 'orderStandby',
  handleUpload,
}) => {
  const getAcceptConfig = (type: AcceptType) => {
    const dim = IMAGE_DIMENSIONS[type];
    const dimText = dim ? `${dim.width}x${dim.height}` : '';

    switch (type) {
      case 'orderStandby':
        return {
          acceptString: '.jpg,.jpeg,.png,.mp4',
          hintText: `jpg, png, mp4 파일 지원 (영상 15초/30MB 이하, 이미지 1MB 이하, ${dimText} 규격)`,
          validExtensions: ['.jpg', '.jpeg', '.png', '.mp4'],
        };
      case 'topBanner':
        return {
          acceptString: '.jpg,.jpeg,.png',
          hintText: `jpg, png 파일 지원 (1MB 이하, ${dimText} 규격)`,
          validExtensions: ['.jpg', '.jpeg', '.png'],
        };
      case 'adMenu':
        return {
          acceptString: '.jpg,.jpeg,.png,.gif',
          hintText: `jpg, png, gif 파일 지원 (1MB 이하, ${dimText} 규격)`,
          validExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
        };
      case 'fullScreenAd':
        return {
          acceptString: '.jpg,.jpeg,.png,.mp4',
          hintText: `jpg, png, mp4 지원 (영상 15초/30MB 이하, 이미지 1MB 이하, ${dimText} 규격)`,
          validExtensions: ['.jpg', '.jpeg', '.png', '.mp4'],
        };
      case 'orderForm':
        return {
          acceptString: '.jpg,.jpeg,.png',
          hintText: `jpg, png 파일 지원 (1MB 이하, ${dimText} 규격)`,
          validExtensions: ['.jpg', '.jpeg', '.png'],
        };
      default:
        return {
          acceptString: '.jpg,.jpeg,.png,.mp4',
          hintText: '파일을 선택해주세요.',
          validExtensions: ['.jpg', '.jpeg', '.png', '.mp4'],
        };
    }
  };

  const { acceptString, hintText, validExtensions } =
    getAcceptConfig(acceptType);

  return (
    <>
      <UploadSection>
        <div style={{ flex: 1 }}>
          <Dragger
            accept={acceptString}
            height={160}
            style={{ backgroundColor: '#f8fafc', borderColor: '#1d2a6d' }}
            showUploadList={false}
            beforeUpload={(file) => {
              const lastDotIndex = file.name.lastIndexOf('.');
              const extension =
                lastDotIndex !== -1
                  ? file.name.substring(lastDotIndex).toLowerCase()
                  : '';
              const isVideo =
                file.type.startsWith('video/') || extension === '.mp4';
              const isImage =
                file.type.startsWith('image/') ||
                ['.jpg', '.jpeg', '.png'].includes(extension);

              return new Promise<string | boolean>((resolve) => {
                if (!validExtensions.includes(extension)) {
                  message.error(`지원하지 않는 파일 형식입니다. (${hintText})`);
                  return resolve(Upload.LIST_IGNORE);
                }

                // 이미지 용량 제한 (1MB 이하)
                if (isImage && file.size > 1 * 1024 * 1024) {
                  message.error('이미지 크기는 1MB 이하여야 합니다.');
                  return resolve(Upload.LIST_IGNORE);
                }

                // 비디오 용량 제한 (30MB 이하)
                if (isVideo && file.size > 30 * 1024 * 1024) {
                  message.error('동영상 크기는 30MB 이하여야 합니다.');
                  return resolve(Upload.LIST_IGNORE);
                }

                const handleSuccess = (
                  durationStr: string,
                  durationSec: number = 0
                ) => {
                  if (handleUpload) {
                    const newFile: UploadedFile = {
                      id: String(Date.now() + Math.random()), // 고유 ID 생성
                      name: file.name,
                      duration: durationStr,
                      durationSec,
                      fileSizeKb: `${file.size / 1024}`,
                      status: '완료',
                      originFileObj: file, // 🚀 실제 File 객체 보관
                    };
                    handleUpload(newFile);
                  }
                  resolve(false); // 브라우저 자동 업로드 방지 처리 완료
                };

                if (isImage) {
                  const expectedDim = IMAGE_DIMENSIONS[acceptType];
                  if (!expectedDim) {
                    handleSuccess('', 0);
                    return;
                  }

                  const img = new Image();
                  img.onload = () => {
                    URL.revokeObjectURL(img.src);

                    if (
                      img.width !== expectedDim.width ||
                      img.height !== expectedDim.height
                    ) {
                      message.error(
                        `이미지 규격이 맞지 않습니다. (권장: ${expectedDim.width} x ${expectedDim.height}, 현재: ${img.width} x ${img.height})`
                      );
                      resolve(Upload.LIST_IGNORE);
                    } else {
                      handleSuccess('', 0);
                    }
                  };
                  img.onerror = () => {
                    URL.revokeObjectURL(img.src);
                    message.error('이미지 파일을 읽을 수 없습니다.');
                    resolve(Upload.LIST_IGNORE);
                  };
                  img.src = URL.createObjectURL(file);
                } else if (isVideo) {
                  const video = document.createElement('video');
                  video.preload = 'metadata';
                  video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);

                    // const expectedDim = IMAGE_DIMENSIONS[acceptType];
                    // if (
                    //   expectedDim &&
                    //   (video.videoWidth !== expectedDim.width ||
                    //     video.videoHeight !== expectedDim.height)
                    // ) {
                    //   message.error(
                    //     `동영상 규격이 맞지 않습니다. (권장: ${expectedDim.width} x ${expectedDim.height}, 현재: ${video.videoWidth} x ${video.videoHeight})`
                    //   );
                    //   resolve(Upload.LIST_IGNORE);
                    //   return;
                    // }

                    const totalSeconds = Math.round(video.duration);

                    if (totalSeconds > 15) {
                      message.error('동영상 길이는 15초 이하여야 합니다.');
                      resolve(Upload.LIST_IGNORE);
                      return;
                    }

                    const m = Math.floor(totalSeconds / 60);
                    const s = totalSeconds % 60;
                    const durationStr = m > 0 ? `${m}분 ${s}초` : `${s}초`;
                    handleSuccess(durationStr, totalSeconds);
                  };
                  video.onerror = () => {
                    URL.revokeObjectURL(video.src);
                    message.error('동영상 파일을 읽을 수 없습니다.');
                    resolve(Upload.LIST_IGNORE);
                  };
                  video.src = URL.createObjectURL(file);
                } else {
                  handleSuccess('', 0);
                }
              });
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#1d2a6d' }} />
            </p>
            <p
              className="ant-upload-text"
              style={{ color: '#1d2a6d', fontWeight: 'bold' }}
            >
              클릭 또는 드래그하여 파일 업로드
            </p>
            <p
              className="ant-upload-hint"
              style={{ fontSize: '12px', color: '#bfbfbf', marginTop: '8px' }}
            >
              {hintText}
            </p>
          </Dragger>
        </div>
      </UploadSection>

      <div style={{ padding: '0 24px 12px 24px' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          • 드래그로 노출 우선순위를 설정하세요. 1번이 가장 먼저 노출됩니다.
        </Text>
      </div>

      <ListContainer>
        {files.map((file, index) => (
          <ListItem
            key={file.id}
            status={file.status}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()} // drop 허용을 위해 필수
          >
            <DragHandle>
              <HolderOutlined style={{ fontSize: '20px', color: '#bfbfbf' }} />
            </DragHandle>
            <NumberBadge status={file.status}>{index + 1}</NumberBadge>
            <FileInfo>
              <Text strong style={{ fontSize: '15px', color: '#262626' }}>
                {file.name}
              </Text>
              <FileMeta>
                {file.duration && file.duration !== '-' && (
                  <MetaBadge>{file.duration}</MetaBadge>
                )}
                <MetaBadge
                  style={{ backgroundColor: '#f5f5f5', color: '#595959' }}
                >
                  {formatFileSizeKbToMb(Number(file.fileSizeKb))}
                </MetaBadge>
              </FileMeta>
            </FileInfo>
            {/* <StatusLabel status={file.status}>{file.status}</StatusLabel> */}
            <Tooltip title="삭제">
              <DeleteOutlined
                style={{
                  fontSize: '16px',
                  marginLeft: '16px',
                  cursor: 'pointer',
                  color: '#8c8c8c',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.id);
                }}
              />
            </Tooltip>
          </ListItem>
        ))}
      </ListContainer>
    </>
  );
};

export default UploadContent;
