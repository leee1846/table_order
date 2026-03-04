import { ModalBackground, BasicButton } from '@repo/ui/components';
import { css } from '@emotion/react';
import { ReactQRCode } from '@lglab/react-qr-code';
import * as S from './QRCodeModal.style';
import type { ITokenPayload } from '@repo/api/types';
import { getAccessToken } from '@repo/api/auth';
import { decodeJwtToken } from '@repo/util/function';
import { useAdminTranslation } from '@/config/i18n';

interface Props {
  onClose: () => void;
}

export const QRCodeModal = ({ onClose }: Props) => {
  const { t } = useAdminTranslation();

  const token = getAccessToken();
  const payload = decodeJwtToken<ITokenPayload>(token ?? '');

  return (
    <ModalBackground position="center">
      <S.Container>
        <S.Title>{t('로그인 QR 코드')}</S.Title>

        <S.QRCodeWrapper>
          <ReactQRCode
            value={payload?.memberUuid ?? ''}
            size={280}
            level="M"
            background="#ffffff"
            dataModulesSettings={{ color: '#000000' }}
          />
        </S.QRCodeWrapper>

        <S.Description>{t('QR 코드를 스캔하여 로그인하세요')}</S.Description>

        <S.ButtonGroup>
          <BasicButton
            variant="Solid_Navy_2XL"
            onClick={onClose}
            customStyle={css`
              width: 100%;
            `}
          >
            {t('닫기')}
          </BasicButton>
        </S.ButtonGroup>
      </S.Container>
    </ModalBackground>
  );
};
