import { IAppData } from "../utils/types/appType";
import { IUserPhoto } from "../utils/types/mainTypes";
import { getReq, putReq } from "./api";
import { getLeadersUri, getRefsUri, getUserAvatarUri, mainAppDataUri, setTransferCoinsUri } from "./requestData";

// получить все данные юзера
export const getAppData = (userIdValue: string) => {
  return getReq<IAppData>({
    uri: mainAppDataUri,
    userId: userIdValue,
  });
};
// Получить фото пользователя
export const getUserAvatarRequest = (userIdValue: string) => {
  return getReq<IUserPhoto>({
    uri: getUserAvatarUri,
    userId: userIdValue,
  });
};
// получить данные рефералов юзера
export const getReferralsData = (userIdValue: string) => {
  return getReq({
    uri: getRefsUri,
    userId: userIdValue
  });
};
// получить данные о лидерах
export const getTopUsers = () => {
  return getReq({
    uri: getLeadersUri,
  });
};
// перевести коины юзера на баланс юзера
export const transferCoinsToBalanceReq = (userIdValue: string) => {
  return putReq({
    uri: setTransferCoinsUri,
    userId: userIdValue
  });
};