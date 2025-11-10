import { Outlet } from 'react-router-dom';
import { GlobalModalContainer } from '@repo/ui/components';

const App = () => {
  return (
    <div className="app">
      <Outlet />
      <GlobalModalContainer />
    </div>
  );
};

export default App;
