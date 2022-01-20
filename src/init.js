import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locale.ru.json';

const init = () => {
  const i18n = i18next.createInstance();

  i18n
    .use(initReactI18next)
    .init({
      debug: true,
      resources: { ru },
      lng: 'ru',
    });

  return { i18n };
};

export default init;
