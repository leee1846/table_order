import * as S from '@/pages/MainPage/LanguageSelector/languageSelector.style';
import { jpFlagIcon, koFlagIcon, chFlagIcon, usFlagIcon } from '@repo/ui/icons';
import { useLanguageStore } from '@/stores/data/useLanguageStore';

const FLAG_ICONS = {
  ko: koFlagIcon,
  en: usFlagIcon,
  ch: chFlagIcon,
  jp: jpFlagIcon,
} as const;

export const LANGUAGE_CONFIG_LIST = [
  {
    label: '한국어',
    value: 'ko',
  },
  {
    label: '영어',
    value: 'en',
  },
  {
    label: '중국어',
    value: 'ch',
  },
  {
    label: '일본어',
    value: 'jp',
  },
];

export const LanguageSelector = () => {
  const { setData: setCurrentLanguage } = useLanguageStore();

  return (
    <S.Container>
      <h1>언어 선택</h1>
      <p>주문에 사용하실 언어를 선택해 주세요.</p>
      <S.Buttons>
        {LANGUAGE_CONFIG_LIST.map((lang) => {
          return (
            <S.Button key={lang.value}>
              <button
                type="button"
                onClick={() => setCurrentLanguage(lang.value)}
              >
                <img
                  src={FLAG_ICONS[lang.value as keyof typeof FLAG_ICONS]}
                  alt={lang.label}
                />
                {lang.label}
              </button>
            </S.Button>
          );
        })}
      </S.Buttons>
    </S.Container>
  );
};
