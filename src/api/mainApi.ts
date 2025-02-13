import { IAppData, IUserPhoto } from "utils/types";

import { getReq, putReq } from "./api";
import {
activeEmojiPackUri,
fortuneUri,
fortuneWheelUri,
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
export const getAppData = (userIdValue: number) => {
  return getReq<IAppData>({
    uri: mainAppDataUri,
    userId: userIdValue,
  });
};
// Получить фото пользователя
export const getUserAvatarRequest = (userIdValue: number) => {
  return getReq<IUserPhoto>({
    uri: getUserAvatarUri,
    userId: userIdValue,
  });
};
// получить данные рефералов юзера
export const getReferralsData = (userIdValue: number) => {
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
export const transferCoinsToBalanceReq = (userIdValue: number) => {
  return putReq({
    uri: setTransferCoinsUri,
    userId: userIdValue
  });
};
// получить активный пак эмодзи
export const getActiveEmojiPack = (userIdValue: number) => {
  return getReq({
    uri: activeEmojiPackUri,
    userId: userIdValue,
  })
};
// получить инфу о колесе удачи
export const getLuckInfo = (userIdValue: number) => {
  return getReq({
    uri: fortuneWheelUri,
    userId: userIdValue,
  })
};
// прокрутка колеса удачи
export const spinWheelRequest = (userIdValue: number) => {
  return getReq({
    uri: fortuneUri,
    userId: userIdValue,
  })
};
// проверка выполнения таска
export const taskStepRequest = (userIdValue: number, taskId: number, stepId: number) => {
  return getReq({
    uri: taskStepButtonUri,
    userId: userIdValue,
    endpoint: `${taskIdParamString}${taskId}${stepIdParamString}${stepId}`
  })
};
// забрать награду за таск
export const taskResultRequest = (userIdValue: number, taskId: number) => {
  return getReq({
    uri: taskResultUri,
    userId: userIdValue,
    endpoint: `${taskIdParamString}${taskId}`
  })
};
