import { useNavigate } from 'react-router-dom';
import { BasicButton, Input } from '@repo/ui/components';

import { ROUTES } from '@/constants/routes';
import { UserList } from '@/pages/HomePage/UserList';
import { theme, TYPOGRAPHY } from '@repo/ui';
import {
  MenuIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
  VisibilityIcon,
} from '@repo/ui/icons';
import { useState } from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

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
        />
        <Input
          placeholder="Input"
          width="400px"
          value={inputValue}
          onChange={setInputValue}
          disabled
        />

        <Input
          placeholder="Input"
          width="200px"
          value={inputValue}
          onChange={setInputValue}
          type="password"
          iconComponent={
            <VisibilityIcon
              width={20}
              height={20}
              color={theme.colors.grey[500]}
            />
          }
          onIconClick={() => console.log('icon clicked')}
        />
      </div>

      <UserList />
    </div>
  );
};
