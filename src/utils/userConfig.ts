/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Создаем .env файл в корне проекта
// const IS_DEVELOPMENT = process.env.REACT_APP_ENV === 'development';
const IS_DEVELOPMENT = true; 

interface UserConfig {
  DEV_USER_ID: number;
  PROD_USER_ID: number | undefined;
}

const config: UserConfig = {
  // DEV_USER_ID: 172359056,
  DEV_USER_ID: 5858080651,
  PROD_USER_ID: (window as any).Telegram.WebApp.initDataUnsafe?.user?.id
};

export const getUserId = (): number => {
  return IS_DEVELOPMENT ? config.DEV_USER_ID : config.PROD_USER_ID!;
}; 