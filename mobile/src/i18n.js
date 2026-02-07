import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './translations/en.json';
import ru from './translations/ru.json';
import hy from './translations/hy.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  hy: { translation: hy },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
