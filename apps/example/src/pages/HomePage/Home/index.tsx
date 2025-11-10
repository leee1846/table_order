import { useNavigate } from 'react-router-dom';
import { BasicButton, Input, ModalBackground } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { TYPOGRAPHY } from '@repo/ui';
import {
  MenuIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  VisibilityIcon,
} from '@repo/ui/icons';
import { useState } from 'react';
import { css } from '@emotion/react';

export const Home = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const doSomething = () => {
    console.log('icon clicked');
  };

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
          icon={<MenuIcon color="red" />}
          iconPosition="right"
        >
          Solid_Navy_M
        </BasicButton>
        <Input
          placeholder="Input"
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          type="text"
          customStyle={css`
            width: 400px;
          `}
          name="text"
        />
        <Input
          placeholder="Input"
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          disabled
          customStyle={css`
            width: 400px;
          `}
          name="email"
        />

        <Input
          value={inputValue}
          onChange={setInputValue}
          type="password"
          rightComponent={
            <div onClick={() => doSomething()}>
              <VisibilityIcon color="red" width={20} height={20} />
            </div>
          }
          customStyle={css`
            width: 200px;
          `}
          name="password"
        />
      </div>

      {/* <ModalBackground>
        <div>Hello</div>
      </ModalBackground> */}

      <UserList />
    </div>
  );
};
