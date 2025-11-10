import { Outlet } from 'react-router-dom';
import { GlobalModalContainer } from '@repo/ui/components';

const App = () => {
  return (
    <div>
      <GlobalModalContainer />
      <Outlet />
    </div>
  );
};

export default App;
