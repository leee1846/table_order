import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';
import { Home } from '@/pages/HomePage/Home';
import { isEmpty } from '@repo/util';
import * as S from '@/pages/HomePage/HomePage.style';
import { Test } from '@repo/feature/components';

export const HomePage = () => {
  const title = 'Turborepo Example';
  const checked = isEmpty(title) ? 'no title' : title;

  return (
    <S.HomePageContainer>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} alt="React logo" />
        </a>
      </div>

      <h1>{checked}</h1>

      <Test />
      <Home />
    </S.HomePageContainer>
  );
};
