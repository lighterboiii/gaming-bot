import { IAppData } from "../utils/types/appType";
import { IUserPhoto } from "../utils/types/mainTypes";
import { getReq, putReq } from "./api";
import {
  activeEmojiPackUri,
  fortuneIdParamString,
  fortuneItemCountParamString,
  fortuneUri,
  fortuneWheelUri,
  getFortunePrizeUri,
  getLeadersUri,
  getRefsUri,
  getUserAvatarUri,
  mainAppDataUri,
  setTransferCoinsUri,
  stepIdParamString,
  taskIdParamString,
  taskResultUri,
  taskStepButtonUri

} from "./requestData";

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
// получить активный пак эмодзи
export const getActiveEmojiPack = (userIdValue: string) => {
  return getReq({
    uri: activeEmojiPackUri,
    userId: userIdValue,
  })
};
// получить инфу о колесе удачи
export const getLuckInfo = (userIdValue: string) => {
  return getReq({
    uri: fortuneWheelUri,
    userId: userIdValue,
  })
};
// прокрутка колеса удачи
export const spinWheelRequest = (userIdValue: string) => {
  return getReq({

    uri: fortuneUri,
    userId: userIdValue,
  })
};
// забрать приз
export const getWheelPrizeRequest = (userIdValue: string, itemId: number, count: number) => {
  return getReq({
    uri: getFortunePrizeUri,
    userId: userIdValue,
    endpoint: `${fortuneIdParamString}${itemId}${fortuneItemCountParamString}${count}`
  })
};
// проверка выполнения таска
export const taskStepRequest = (userIdValue: string, taskId: number, stepId: number) => {
  return getReq({
    uri: taskStepButtonUri,
    userId: userIdValue,
    endpoint: `${taskIdParamString}${taskId}${stepIdParamString}${stepId}`
  })
};
// забрать награду за таск
export const taskResultRequest = (userIdValue: string, taskId: number) => {
  return getReq({
    uri: taskResultUri,
    userId: userIdValue,
    endpoint: `${taskIdParamString}${taskId}`
  })
};
