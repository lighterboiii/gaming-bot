import { IAppData } from "../utils/types/appType";
import { IUserPhoto } from "../utils/types/mainTypes";
import { getReq, putReq } from "./api";
import { activeEmojiPackUri, fortuneWheelUri, getLeadersUri, getRefsUri, getUserAvatarUri, mainAppDataUri, setTransferCoinsUri } from "./requestData";

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
    uri: 'fortune_button?user_id=',
    userId: userIdValue,
  })
};
// забрать приз
export const getWheelPrizeRequest = (userIdValue: string, itemId: number, count: number) => {
  return getReq({
    uri: 'fortune_prize?user_id=',
    userId: userIdValue,
    endpoint: `&fortune_item_id=${itemId}&fortune_item_count=${count}`
  })
};
// проверка выполнения таска
export const taskStepRequest = (userIdValue: string, taskId: number, stepId: number) => {
  return getReq({
    uri: 'task_step_button?user_id=',
    userId: userIdValue,
    endpoint: `&task_id=${taskId}&step_id=${stepId}`
  })
};
// забрать награду за таск
export const taskResultRequest = (userIdValue: string, taskId: number) => {
  return getReq({
    uri: 'task_result_button?user_id=',
    userId: userIdValue,
    endpoint: `&task_id=${taskId}`
  })
};
