import { Outlet } from 'react-router-dom';
import { GlobalDialogContainer } from '@repo/shared-feature/components';


const App = () => {
  return (
    <div>
      <GlobalDialogContainer />
      <Outlet />
    </div>
  );
};

export default App;
