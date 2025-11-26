import { useState } from 'react';
import {
  ModalBackground,
  Pagination,
  BasicButton,
  CheckButton,
  ChipButton,
} from '@repo/ui/components';
import { CloseIcon, FullBatteryIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import * as UIStyles from '@repo/ui/styles';
import * as S from './deviceListDialog.style';

const { colors } = theme;

export type DeviceItem = {
  id: string;
  device: string;
  table: string;
  battery: number;
  wifiSignal: number;
  ip: string;
  version: string;
  buildNumber: string;
};

export type DeviceListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  devices?: DeviceItem[];
  itemsPerPage?: number;
};

const mockDevices: DeviceItem[] = [
  {
    id: '1',
    device: '키오스크-01',
    table: '테이블-01',
    battery: 85,
    wifiSignal: 4,
    ip: '192.168.1.100',
    version: '1.2.3',
    buildNumber: '20240115',
  },
  {
    id: '2',
    device: '키오스크-02',
    table: '테이블-02',
    battery: 92,
    wifiSignal: 5,
    ip: '192.168.1.101',
    version: '1.2.3',
    buildNumber: '20240115',
  },
  {
    id: '3',
    device: '태블릿-01',
    table: '테이블-03',
    battery: 45,
    wifiSignal: 2,
    ip: '192.168.1.102',
    version: '1.2.2',
    buildNumber: '20240110',
  },
];

export const DeviceListDialog = ({
  isOpen,
  onClose,
  devices = mockDevices,
  itemsPerPage = 10,
}: DeviceListDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(
    new Set()
  );

  if (!isOpen) {
    return null;
  }

  const totalPages = Math.ceil(devices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevices = devices.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDevices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  return (
    <ModalBackground position="center" onClick={onClose}>
      <S.DialogContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="닫기">
          <CloseIcon width={32} height={32} color={colors.grey[700]} />
        </S.CloseButton>

        <S.Container>
          <S.Header>
            <S.Title>기기관리</S.Title>
          </S.Header>

          <S.ButtonContainer>
            <S.LeftButtons>
              <BasicButton variant="Solid_Navy_XL" onClick={() => {}}>
                업데이트
              </BasicButton>
              <BasicButton variant="Solid_Sky_Blue_XL" onClick={() => {}}>
                화면 켜기
              </BasicButton>
              <BasicButton variant="Outline_Navy_XL" onClick={() => {}}>
                화면 끄기
              </BasicButton>
            </S.LeftButtons>
            <S.RightButtons>
              <BasicButton variant="Outline_Grey_XL" onClick={() => {}}>
                종료
              </BasicButton>
              <BasicButton variant="Outline_Grey_XL" onClick={() => {}}>
                재부팅
              </BasicButton>
            </S.RightButtons>
          </S.ButtonContainer>

          <S.TableContainer>
            <UIStyles.setting.Table>
              <UIStyles.setting.Thead>
                <tr>
                  <th>
                    <S.DeviceHeaderCell>
                      <span>기기</span>
                    </S.DeviceHeaderCell>
                  </th>
                  <th>테이블</th>
                  <th>배터리</th>
                  <th>Wi-Fi 신호</th>
                  <th>IP</th>
                  <th>버전</th>
                  <th>빌드번호</th>
                </tr>
              </UIStyles.setting.Thead>
              <S.Tbody>
                {currentDevices.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <S.DeviceCell>
                        <CheckButton
                          checked={selectedDevices.has(device.id)}
                          onChange={() => handleSelectDevice(device.id)}
                        >
                          <span>{device.device}</span>
                        </CheckButton>
                      </S.DeviceCell>
                    </td>
                    <td>{device.table}</td>
                    <td>
                      <S.BatteryColumn>
                        <FullBatteryIcon
                          width={24}
                          height={24}
                          color={colors.grey[800]}
                        />
                        <span>{device.battery}%</span>
                      </S.BatteryColumn>
                    </td>
                    <td>양호</td>
                    <td style={{ color: colors.grey[500] }}>{device.ip}</td>
                    <td>
                      <S.VersionColumn>
                        <span>{device.version}</span>
                        <ChipButton variant="darkgrey" size="S">
                          최신
                        </ChipButton>
                      </S.VersionColumn>
                    </td>
                    <td style={{ color: colors.grey[400] }}>
                      {device.buildNumber}
                    </td>
                  </tr>
                ))}
              </S.Tbody>
            </UIStyles.setting.Table>
          </S.TableContainer>
        </S.Container>

        <S.Footer>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </S.Footer>
      </S.DialogContainer>
    </ModalBackground>
  );
};
