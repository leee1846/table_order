import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '20px',
      }}
    >
      <h1>404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <button
        type="button"
        onClick={() => navigate(ROUTES.ROOT.generate())}
        style={{
          padding: '10px 20px',
          cursor: 'pointer',
        }}
      >
        홈으로 가기
      </button>
    </div>
  );
};

