import { Outlet } from 'react-router-dom';
import { GlobalDialogContainer } from '@repo/shared-feature/components';

const App = () => {
  return (
    <div>
      <Outlet />
      <GlobalDialogContainer  />
    </div>
  );
};

export default App;
