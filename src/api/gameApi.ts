/* eslint-disable @typescript-eslint/no-explicit-any */
import { getReq, postReq, putReq } from "./api";
import {
  addPlayerUri,
  createRoomUri,
  gameIdParamString,
  getGamesUri,
  kickPlayerUri,
  roomIdParamString,
  rulesUri,
  useEnergyDrinkUri
} from "./requestData";

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
// использовать энергетик
export const energyDrinkRequest = (userIdValue: number) => {
  return getReq({
    uri: useEnergyDrinkUri,
    userId: userIdValue,
  })
};
// установить флаг просмотр правил игры
export const setGameRulesWatched = (userIdValue: number, gameId: string) => {
  return putReq({
    uri: rulesUri,
    userId: userIdValue,
    endpoint: `${gameIdParamString}${gameId}`
  })
};
