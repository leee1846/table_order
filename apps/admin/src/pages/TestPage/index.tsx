'use client';

import * as S from './testPage.styles';
import { Dropdown } from '@repo/ui/components';
import { useState } from 'react';

export const TestPage = () => {
  const [value, setValue] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [value3, setValue3] = useState<string>('');
  const [value4, setValue4] = useState<string>('');
  const [value5, setValue5] = useState<string>('');
  const [value6, setValue6] = useState<string>('');

  return (
    <S.TestPage>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value={value}
          onChange={(value) => setValue(value as string)}
        />
      </div>
      <div style={{ position: 'absolute', top: '50%', left: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value={value2}
          onChange={(value) => setValue2(value as string)}
        />
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value={value3}
          onChange={(value) => setValue3(value as string)}
        />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value={value4}
          onChange={(value) => setValue4(value as string)}
        />
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '11111111111111111' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
            { value: '2', label: '22222222222222222222222' },
          ]}
          value={value5}
          onChange={(value) => setValue5(value as string)}
        />
      </div>
      <div style={{ position: 'absolute', top: '50%', right: 0 }}>
        <Dropdown
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
          ]}
          value={value6}
          onChange={(value) => setValue6(value as string)}
        />
      </div>
    </S.TestPage>
  );
};
