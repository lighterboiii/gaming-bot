import { IAppData, UserPhoto } from "../utils/types";
import { getReq } from "./api";
import { getLeadersUri, getRefsUri, getUserAvatarUri, mainAppDataUri } from "./requestData";

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
  return await getReq<any>({ uri: getRefsUri, userId: userIdValue });
};
// получить данные о лидерах 
export const getTopUsers = async () => {
  return await getReq<any>({ uri: getLeadersUri, userId: '' });
};