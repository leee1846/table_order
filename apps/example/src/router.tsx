import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { ROUTES } from '@/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME.path,
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.ABOUT.path,
        element: <AboutPage />,
      },
      {
        path: ROUTES.USER_PROFILE.path,
        element: <UserProfilePage />,
      },
    ],
  },
]);
