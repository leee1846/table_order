import { useEffect } from 'react';
import { Form, Input, Select, Typography } from 'antd';
import styled from '@emotion/styled';
import {
  BOARD_TYPE_OPTIONS,
  type NoticesFormData,
} from '@/feature/backoffice/Notices/constants';

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

const HorizontalLayout = styled.div`
  display: flex;
  gap: 16px;
  max-width: 400px;

  > div {
    flex: 1;
  }
`;

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: NoticesFormData;
  store?: boolean;
  updateFormData: (updates: Partial<NoticesFormData>) => void;
}

export const NoticesForm = ({ mode, formData, updateFormData }: Props) => {
  const isReadOnly = mode === 'detail';
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <Container>
      <SectionTitle level={5}>공지 사항 정보</SectionTitle>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => updateFormData(changedValues)}
        disabled={isReadOnly}
        requiredMark={true}
      >
        <Form.Item
          label={<Text strong>유형</Text>}
          name="boardType"
          rules={[{ required: true, message: '유형을 선택해주세요.' }]}
        >
          <Select
            size="large"
            options={BOARD_TYPE_OPTIONS}
            placeholder="유형 선택"
            style={{ maxWidth: 400 }}
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>제목</Text>}
          name="title"
          rules={[{ required: true, message: '제목을 입력해주세요.' }]}
        >
          <Input
            size="large"
            placeholder="제목을 입력하세요"
            maxLength={200}
            style={{ maxWidth: 800 }}
          />
        </Form.Item>

        <Form.Item
          label={<Text strong>내용</Text>}
          name="content"
          rules={[{ required: true, message: '내용을 입력해주세요.' }]}
          getValueFromEvent={(e) => e.target.value.slice(0, 200)}
        >
          <Input.TextArea
            size="large"
            placeholder="내용을 입력하세요"
            maxLength={200}
            autoSize={{ minRows: 6 }}
            showCount={!isReadOnly}
            style={{ maxWidth: 800 }}
          />
        </Form.Item>

        {(mode === 'edit' || mode === 'detail') && (
          <HorizontalLayout>
            <Form.Item
              label={<Text strong>생성일자</Text>}
              name="createdAt"
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="생성일자" disabled />
            </Form.Item>
            <Form.Item
              label={<Text strong>수정일자</Text>}
              name="updatedAt"
              style={{ flex: 1 }}
            >
              <Input size="large" placeholder="수정일자" disabled />
            </Form.Item>
          </HorizontalLayout>
        )}
      </Form>
    </Container>
  );
};
