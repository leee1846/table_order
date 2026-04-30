import styled from '@emotion/styled';

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`;

export const InfoText = styled.p`
  margin-bottom: 24px;
  font-size: 14px;
  color: #666;
`;

export const ShopCodeWrapper = styled.span`
  display: block;
  margin-bottom: 12px;
  color: #374151;
`;

export const ShopCodeHighlight = styled.strong`
  color: #111827;
`;

export const InfoListItem = styled.span<{ isLast?: boolean }>`
  display: block;
  margin-bottom: ${({ isLast }) => (isLast ? '0' : '6px')};
`;

export const Dropzone = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${({ isDragging }) => (isDragging ? '#3b82f6' : '#d1d5db')};
  background-color: ${({ isDragging }) => (isDragging ? '#eff6ff' : '#f9fafb')};
  border-radius: 8px;
  padding: 64px 16px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
`;

export const DropzoneText = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

export const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  max-height: 150px;
  overflow-y: auto;
`;

export const FileItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FileName = styled.span`
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background-color: #e5e7eb;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ProgressWrapper = styled.div`
  margin-bottom: 24px;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: #3b82f6; /* 파란색 계열, 테마 색상으로 변경 가능 */
  transition: width 0.3s ease;
`;

export const ProgressText = styled.p`
  font-size: 12px;
  color: #666;
  text-align: right;
  margin: 0;
`;
