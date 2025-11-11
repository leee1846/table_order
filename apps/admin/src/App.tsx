import { Outlet } from 'react-router-dom';
import { GlobalDialogContainer } from '@repo/feature/components';

const App = () => {
  return (
    <div>
      <GlobalDialogContainer />
      <Outlet />
    </div>
  );
};

export default App;
