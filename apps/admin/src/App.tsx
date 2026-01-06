import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { disconnectSse, initializeSseConnection } from '@/utils/sseConnection';
import { TheftAlertDialog } from '@/feature/dialogs/TheftAlertDialog';
import { useTheftAlertStore } from '@/stores/useTheftAlertStore';
import { useShopDetailData } from '@/hooks/useShopDetailData';
import { setAdminLanguage } from '@/config/i18n';

const App = () => {
  const { isOpen, tableNumber, closeAlert } = useTheftAlertStore();
  const { data: shopDetail } = useShopDetailData();

  useEffect(() => {
    initializeSseConnection();

    return () => {
      disconnectSse();
    };
  }, []);

  // shopSetting.shopLanguage가 업데이트되면 전역 i18n 언어를 변경한다.
  useEffect(() => {
    setAdminLanguage(shopDetail?.shopSetting?.shopLanguage);
  }, [shopDetail?.shopSetting?.shopLanguage]);

  return (
    <div>
      <Outlet />
      <TheftAlertDialog
        isOpen={isOpen}
        tableNumber={tableNumber}
        onClose={closeAlert}
      />
    </div>
  );
};

export default App;
