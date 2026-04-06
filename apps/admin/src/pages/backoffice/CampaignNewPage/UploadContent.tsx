import React from 'react';
import { Typography, Upload, Tooltip, message } from 'antd';
import {
  CaretRightOutlined,
  HolderOutlined,
  DeleteOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';

const { Text } = Typography;
const { Dragger } = Upload;

// --- Types ---
export type UploadStatus = '완료' | '오류 : 15초 초과' | '오류 : 30MB 초과';

export interface UploadedFile {
  id: string;
  name: string;
  duration: string;
  size: string;
  status: UploadStatus;
  originFileObj?: File;
}

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
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const NumberBadge = styled.div<{ status: UploadStatus }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.status === '완료' ? '#1d2a6d' : '#d9363e'};
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

const StatusLabel = styled.div<{ status: UploadStatus }>`
  padding: 6px 16px;
  font-weight: bold;
  font-size: 13px;
  border: 1px solid
    ${(props) => (props.status === '완료' ? '#52c41a' : '#ff4d4f')};
  color: ${(props) => (props.status === '완료' ? '#389e0d' : '#cf1322')};
  background-color: ${(props) =>
    props.status === '완료' ? '#f6ffed' : 'transparent'};
`;

// --- Component Props ---
interface UploadContentProps {
  files: UploadedFile[];
  handleDragStart: (index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
  handleDelete: (id: string) => void;
  acceptType?: 'image' | 'imageAndVideo';
  handleUpload?: (file: UploadedFile) => void;
}

// --- Component ---
const UploadContent: React.FC<UploadContentProps> = ({
  files,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  handleDelete,
  acceptType = 'imageAndVideo',
  handleUpload,
}) => {
  const acceptString =
    acceptType === 'image'
      ? '.jpg,.jpeg,.png,.gif'
      : '.jpg,.jpeg,.png,.gif,.mp4';

  const hintText =
    acceptType === 'image'
      ? 'jpg, png, gif 파일만 지원'
      : 'jpg, png, gif, mp4 파일 지원';

  const validExtensions =
    acceptType === 'image'
      ? ['.jpg', '.jpeg', '.png', '.gif']
      : ['.jpg', '.jpeg', '.png', '.gif', '.mp4'];

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
              const extension = file.name
                .substring(file.name.lastIndexOf('.'))
                .toLowerCase();
              const isValid = validExtensions.includes(extension);

              if (!isValid) {
                message.error(`지원하지 않는 파일 형식입니다. (${hintText})`);
                return Upload.LIST_IGNORE; // antd 내부 리스트에도 추가하지 않음
              }

              const isVideo =
                file.type.startsWith('video/') || extension === '.mp4';

              if (isVideo && file.size > 30 * 1024 * 1024) {
                message.error('동영상 크기는 30MB 이하여야 합니다.');
                return Upload.LIST_IGNORE;
              }

              if (handleUpload) {
                const createAndUploadFile = (durationStr: string) => {
                  const newFile: UploadedFile = {
                    id: String(Date.now() + Math.random()), // 고유 ID 생성
                    name: file.name,
                    duration: durationStr,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
                    status: '완료',
                    originFileObj: file, // 🚀 실제 File 객체 보관
                  };
                  handleUpload(newFile);
                };

                if (isVideo) {
                  const video = document.createElement('video');
                  video.preload = 'metadata';
                  video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);
                    const totalSeconds = Math.round(video.duration);

                    if (totalSeconds > 15) {
                      message.error('동영상 길이는 15초 이하여야 합니다.');
                      return;
                    }

                    const m = Math.floor(totalSeconds / 60);
                    const s = totalSeconds % 60;
                    const durationStr = m > 0 ? `${m}분 ${s}초` : `${s}초`;
                    createAndUploadFile(durationStr);
                  };
                  video.onerror = () => {
                    URL.revokeObjectURL(video.src);
                    message.error('동영상 파일을 읽을 수 없습니다.');
                  };
                  video.src = URL.createObjectURL(file);
                } else {
                  createAndUploadFile('');
                }
              }
              return false; // 브라우저 자동 업로드 방지
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
            <NumberBadge status={file.status}>{index + 1}</NumberBadge>
            <HolderOutlined
              style={{
                fontSize: '20px',
                color: '#bfbfbf',
                marginRight: '16px',
              }}
            />
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
                  {file.size}
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
