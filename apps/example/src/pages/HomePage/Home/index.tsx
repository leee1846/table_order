import { useNavigate } from 'react-router-dom';
import { BasicButton, Input } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { TYPOGRAPHY } from '@repo/ui';
import { MenuIcon, ArrowBackIcon, ArrowForwardIcon } from '@repo/ui/icons';
import { useState } from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const isInvalid = inputValue.length > 4;

  return (
    <div>
      <h2>Welcome to Home Page??</h2>
      <p style={TYPOGRAPHY.MT_4}>Main Title 1</p>
      <MenuIcon color="red" />
      <ArrowBackIcon color="green" />
      <ArrowForwardIcon color="blue" />
      <div style={{ marginTop: '20px' }}>
        <BasicButton
          variant="Solid_Navy_M"
          onClick={() => navigate(ROUTES.ABOUT.path)}
        >
          Solid_Navy_M
        </BasicButton>
        <Input
          label="타이틀"
          placeholder="Input"
          clearable
          description="추가 설명이 필요할 경우 제공되는 영역입니다."
          width="400px"
          required
          value={inputValue}
          onChange={setInputValue}
          invalid
          validationMessage={isInvalid ? '5글자 이하로 입력하세요' : ''}
          password
        />
        <Input
          label="타이틀"
          placeholder="Input"
          clearable
          description="추가 설명이 필요할 경우 제공되는 영역입니다."
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          invalid
          disabled
        />

        <Input
          label="타이틀"
          placeholder="Input"
          clearable
          description="추가 설명이 필요할 경우 제공되는 영역입니다."
          width="200px"
          value={inputValue}
          onChange={setInputValue}
          invalid
          price
        />
      </div>

      <UserList />
    </div>
  );
};
