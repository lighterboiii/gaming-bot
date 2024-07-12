/* eslint-disable @typescript-eslint/no-explicit-any */
import { getReq, postReq, putReq } from "./api";
import {
  addPlayerUri,
  createRoomUri,
  emotionIdParamString,
  getEmojiPhUri,
  getGamesUri,
  getRoomsUri,
  kickPlayerUri,
  packIdParamString,
  pollingUri,
  roomIdParamString,
  useEnergyDrinkUri,
  whoIsWinUri
} from "./requestData";

// получить все комнаты
export const getOpenedRoomsRequest = () => {
  return getReq({
    uri: getRoomsUri,
  });
};
// получить список доступных игр
export const getExistingGamesRequest = () => {
  return getReq({
    uri: getGamesUri,
  })
};
// создать игру
export const postNewRoomRequest = (data: any, userIdValue: number) => {
  return postReq({
    uri: createRoomUri,
    userId: userIdValue,
    data: data
  });
};
// запрос на подключение к комнатеъ
export const joinRoomRequest = (userIdValue: number, roomId: string) => {
  return putReq({
    uri: addPlayerUri,
    userId: userIdValue,
    endpoint: `${roomIdParamString}${roomId}`,
  })
};
// запрос на отключение от комнаты
export const leaveRoomRequest = (userIdValue: number) => {
  return putReq({
    uri: kickPlayerUri,
    userId: userIdValue,
  })
};
// запрос на отправку определения победителя
export const whoIsWinRequest = (roomId: string) => {
  return getReq({
    uri: whoIsWinUri,
    endpoint: `${roomIdParamString}${roomId}`,
  })
};
// получить активный пак эмодзи пользователя
export const getEmojiRequest = (packId: string, emojiId: string) => {
  return getReq({
    uri: getEmojiPhUri,
    endpoint: `${packIdParamString}${packId}${emotionIdParamString}${emojiId}`,
  })
};
// запрос на получение данных внутри игры
export const getPollingRequest = (userIdValue: number, data: any) => {
  return postReq({
    uri: pollingUri,
    userId: userIdValue,
    data: data,
  })
};
// использовать энергетик
export const energyDrinkRequest = (userIdValue: number) => {
  return getReq({
    uri: useEnergyDrinkUri,
    userId: userIdValue,
  })
};

export const setGameRulesWatched = (userIdValue: number, gameId: string) => {
  return putReq({
    uri: 'game_rule_watched?user_id=',
    userId: userIdValue,
    endpoint: `&game_id=${gameId}`
  })
};
