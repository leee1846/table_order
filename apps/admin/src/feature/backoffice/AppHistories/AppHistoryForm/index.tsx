import { Input, Typography, Button, Space } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import type { AppHistoriesFormData } from '@/feature/backoffice/AppHistories/constants';
import type { TAppType } from '@repo/api/types';

const { Title, Text } = Typography;

// --- Emotion Styles ---
const Container = styled.div`
  padding: 8px 0;
`;

const SectionTitle = styled(Title)`
  && {
    margin-top: 0;
    margin-bottom: 24px;
    color: #1d2a6d;
    font-size: 16px;
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldGroup = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled(Text)`
  font-weight: 600;
  color: #262626;

  span {
    color: #ff4d4f;
    margin-left: 4px;
  }
`;

const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;
  max-width: 800px;

  > div {
    flex: 1;
  }
`;

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: AppHistoriesFormData;
  updateFormData: (updates: Partial<AppHistoriesFormData>) => void;
  appFile?: File | null;
  onSelectAppFileClick: () => void;
  onRemoveAppFile: () => void;
  isService?: boolean;
}

export const AppHistoryForm = ({
  mode,
  formData,
  updateFormData,
  appFile,
  onSelectAppFileClick,
  onRemoveAppFile,
  isService,
}: Props) => {
  const isReadOnly = mode === 'detail';

  return (
    <Container>
      <SectionTitle level={5}>배포 정보</SectionTitle>
      <FormContent>
        {/* 생성 모드일 때만 파일 업로드 노출 */}
        {!isService && (
          <>
            <FieldGroup>
              <Label>
                앱 파일 (APK/ZIP) <span>*</span>
              </Label>
              {mode === 'detail' && formData.downloadPath ? (
                <FileUploadWrapper>
                  <Button
                    icon={<DownloadOutlined />}
                    href={formData.downloadPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {formData.downloadPath.replace(/^.*\//, '')}
                  </Button>
                </FileUploadWrapper>
              ) : (
                <FileUploadWrapper>
                  <Button
                    icon={<UploadOutlined />}
                    onClick={onSelectAppFileClick}
                    disabled={isReadOnly}
                  >
                    파일 선택
                  </Button>
                  {appFile && (
                    <Space>
                      <Text>{appFile.name}</Text>
                      {!isReadOnly && (
                        <Button
                          type="text"
                          //danger
                          icon={<DeleteOutlined />}
                          onClick={onRemoveAppFile}
                        />
                      )}
                    </Space>
                  )}
                </FileUploadWrapper>
              )}
            </FieldGroup>
            <HorizontalLayout>
              <FieldGroup>
                <Label>
                  구분 <span>*</span>
                </Label>
                <Input
                  size="large"
                  placeholder="파일 업로드 시 자동 입력됩니다."
                  value={formData.type}
                  onChange={(e) =>
                    updateFormData({ type: e.target.value as TAppType })
                  }
                  disabled={true}
                />
              </FieldGroup>
              <FieldGroup>
                <Label>
                  버전 <span>*</span>
                </Label>
                <Input
                  size="large"
                  placeholder="파일 업로드 시 자동 입력됩니다."
                  value={formData.version}
                  onChange={(e) => updateFormData({ version: e.target.value })}
                  disabled={true}
                />
              </FieldGroup>
            </HorizontalLayout>
            <FieldGroup>
              <Label>
                배포일시 <span>*</span>
              </Label>
              <Input
                size="large"
                type="datetime-local"
                placeholder="배포일시를 입력하세요"
                value={formData.deployDateTime}
                onChange={(e) =>
                  updateFormData({ deployDateTime: e.target.value })
                }
                disabled={isReadOnly}
                style={{ maxWidth: 400 }}
              />
            </FieldGroup>
          </>
        )}
        {isService && (
          <HorizontalLayout>
            <FieldGroup>
              <Label>
                버전 <span>*</span>
              </Label>
              <Input
                size="large"
                placeholder="버전을 입력하세요"
                value={formData.version}
                onChange={(e) => updateFormData({ version: e.target.value })}
                disabled={isReadOnly}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>
                배포일시 <span>*</span>
              </Label>
              <Input
                size="large"
                type="datetime-local"
                placeholder="배포일시를 입력하세요"
                value={formData.deployDateTime}
                onChange={(e) =>
                  updateFormData({ deployDateTime: e.target.value })
                }
                disabled={isReadOnly}
                style={{ maxWidth: 400 }}
              />
            </FieldGroup>
          </HorizontalLayout>
        )}
        <FieldGroup>
          <Label>
            제목 <span>*</span>
          </Label>
          <Input
            size="large"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            disabled={isReadOnly}
            style={{ maxWidth: 800 }}
          />
        </FieldGroup>
        <FieldGroup>
          <Label>
            내용 <span>*</span>
          </Label>
          <Input.TextArea
            size="large"
            placeholder="배포 내용을 입력하세요"
            value={formData.content}
            onChange={(e) => updateFormData({ content: e.target.value })}
            disabled={isReadOnly}
            autoSize={{ minRows: 6 }}
            style={{ maxWidth: 800 }}
          />
        </FieldGroup>
      </FormContent>
    </Container>
  );
};
