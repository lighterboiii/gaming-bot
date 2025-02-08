/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

interface UserConfig {
  DEV_USER_ID: number;
  PROD_USER_ID: number | undefined;
}

const config: UserConfig = {
  DEV_USER_ID: 5858080651,
  // DEV_USER_ID: 172359056,
  PROD_USER_ID: (window as any).Telegram.WebApp.initDataUnsafe?.user?.id
};

export const getUserId = (): number => {
  return IS_DEVELOPMENT ? config.DEV_USER_ID : config.PROD_USER_ID!;
}; 