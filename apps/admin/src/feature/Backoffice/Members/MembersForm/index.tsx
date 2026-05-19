import { allowOnlyNumbers } from '@repo/util/string';
import { Form, Input, Select, Typography } from 'antd';
import styled from '@emotion/styled';
import {
  MEMBER_ROLE_OPTIONS,
  type MembersFormData,
} from '@/feature/backoffice/Members/constants';
import { useEffect } from 'react';

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

const FormRow = styled.div`
  display: flex;
  gap: 24px;
  max-width: 824px;

  > div {
    flex: 1;
    min-width: 0;
  }
`;

type Mode = 'create' | 'edit' | 'detail';

interface Props {
  mode: Mode;
  formData: MembersFormData;
  updateFormData: (updates: Partial<MembersFormData>) => void;
}

export const MembersForm = ({ mode, formData, updateFormData }: Props) => {
  const isReadOnly = mode === 'detail';
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData, form]);

  return (
    <Container>
      <SectionTitle level={5}>기본 정보</SectionTitle>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => updateFormData(changedValues)}
        disabled={isReadOnly}
        requiredMark={true}
      >
        <FormRow>
          <Form.Item
            label={<Text strong>이름</Text>}
            name="memberName"
            rules={[{ required: true, message: '이름을 입력해주세요.' }]}
          >
            <Input size="large" placeholder="이름을 입력하세요" />
          </Form.Item>

          <Form.Item
            label={<Text strong>이메일</Text>}
            name="memberEmail"
            rules={[{ required: true, message: '이메일을 입력해주세요.' }]}
          >
            <Input size="large" placeholder="이메일을 입력하세요" />
          </Form.Item>
        </FormRow>

        <FormRow>
          <Form.Item
            label={<Text strong>핸드폰번호</Text>}
            name="memberTel"
            rules={[{ required: true, message: '핸드폰번호를 입력해주세요.' }]}
            getValueFromEvent={(e) => allowOnlyNumbers(e.target.value)}
          >
            <Input
              size="large"
              placeholder="핸드폰번호를 입력하세요 (- 없이)"
              inputMode="numeric"
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>소속</Text>}
            name="memberDepartment"
            rules={[{ required: true, message: '소속을 입력해주세요.' }]}
          >
            <Input size="large" placeholder="소속을 입력하세요" />
          </Form.Item>
        </FormRow>

        <FormRow>
          <Form.Item
            label={<Text strong>권한</Text>}
            name="memberRole"
            rules={[{ required: true, message: '권한을 선택해주세요.' }]}
          >
            <Select
              size="large"
              options={MEMBER_ROLE_OPTIONS}
              placeholder="권한 선택"
            />
          </Form.Item>
          <div style={{ flex: 1 }} />
        </FormRow>

        {(mode === 'edit' || mode === 'detail') && (
          <FormRow>
            <Form.Item label={<Text strong>생성일자</Text>} name="createdAt">
              <Input size="large" placeholder="생성일자" disabled />
            </Form.Item>
            <Form.Item label={<Text strong>수정일자</Text>} name="updatedAt">
              <Input size="large" placeholder="수정일자" disabled />
            </Form.Item>
          </FormRow>
        )}
      </Form>
    </Container>
  );
};
