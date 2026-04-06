import React, { useEffect } from 'react';
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
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ form, mode }) => {
  useEffect(() => {
    if (mode === 'edit') {
      // 편집 모드일 경우 샘플 데이터 세팅
      // 실제 API 연동 시에는 id를 받아와 조회 후 setFieldsValue를 호출하면 됩니다.
      form.setFieldsValue({
        campaignName: '수정할 캠페인 이름',
        adDescription: '수정할 별명 테스트',
        advertiser: '테스트 광고주',
        adType: '전면 대기_영상 : (파일명 : 한맥.mp4)',
      });
    }
  }, [mode, form]);

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
      <Form.Item label={<FormLabel>광고주</FormLabel>} name="advertiser">
        <Input placeholder="광고주를 입력하세요." />
      </Form.Item>
      {mode === 'edit' && (
        <Form.Item label={<FormLabel>등록된 광고유형</FormLabel>} name="adType">
          <Input placeholder="전면 대기_영상 : (파일명 : 한맥.mp4)" disabled />
        </Form.Item>
      )}
    </>
  );
};

export default BasicInfoForm;
