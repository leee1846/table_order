import React from 'react';
import { Form, Input, type FormInstance } from 'antd';
import styled from '@emotion/styled';

const FormLabel = styled.span<{ isMain?: boolean }>`
  font-weight: bold;
  font-size: 15px;
  color: ${(props) => (props.isMain ? 'inherit' : '#595959')};
`;

const RequiredMark = styled.span`
  color: #ff4d4f;
  margin-left: 4px;
`;

export interface BasicInfoFormProps {
  form: FormInstance;
  mode: 'new' | 'edit';
  registeredAdTypeText?: string;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  mode,
  registeredAdTypeText,
}) => {
  return (
    <>
      <Form.Item
        label={
          <FormLabel isMain>
            캠페인명<RequiredMark>*</RequiredMark>
          </FormLabel>
        }
        name="campaignName"
        //rules={[{ required: true, message: '캠페인명을 입력해주세요.' }]}
      >
        <Input placeholder="캠페인명을 입력해주세요" />
      </Form.Item>
      <Form.Item label={<FormLabel>광고 별명</FormLabel>} name="adDescription">
        <Input placeholder="광고 별명을 입력하세요." />
      </Form.Item>
      <Form.Item label={<FormLabel>광고주</FormLabel>} name="advertiserName">
        <Input placeholder="광고주를 입력하세요." />
      </Form.Item>
      {mode === 'edit' && (
        <Form.Item label={<FormLabel>등록된 광고유형</FormLabel>}>
          <Input.TextArea autoSize disabled value={registeredAdTypeText} />
        </Form.Item>
      )}
    </>
  );
};

export default BasicInfoForm;
