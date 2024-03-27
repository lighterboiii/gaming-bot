import { IAppData } from "../utils/types/appType";
import { UserPhoto } from "../utils/types/mainTypes";
import { getReq, putReq } from "./api";
import { getLeadersUri, getRefsUri, getUserAvatarUri, mainAppDataUri, setTransferCoinsUri } from "./requestData";

// получить все данные юзера
export const getAppData = async (userIdValue: string) => {
  return await getReq<IAppData>({
    uri: mainAppDataUri,
    userId: userIdValue,
  });
};
// Получить фото пользователя
export const getUserAvatarRequest = async (userIdValue: string) => {
  return await getReq<UserPhoto>({
    uri: getUserAvatarUri,
    userId: userIdValue,
  });
};
// получить данные рефералов юзера
export const getReferralsData = async (userIdValue: string) => {
  return await getReq({ uri: getRefsUri, userId: userIdValue });
};
// получить данные о лидерах 
export const getTopUsers = async () => {
  return await getReq({ uri: getLeadersUri, userId: '' });
};
// перевести коины юзера на баланс юзера
export const transferCoinsToBalanceReq = async (userIdValue: string) => {
  return await putReq({ uri: setTransferCoinsUri, userId: userIdValue });
};