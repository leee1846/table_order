import { Outlet } from 'react-router-dom';
import { GlobalDialogContainer } from '@repo/feature/components';

const App = () => {
  return (
    <div className="app">
      <Outlet />
      <GlobalDialogContainer />
    </div>
  );
};

export default App;
