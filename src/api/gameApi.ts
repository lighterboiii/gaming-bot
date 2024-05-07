/* eslint-disable @typescript-eslint/no-unused-vars */
import { getReq, postReq, putReq } from "./api";
import {
  addPlayerUri,
  createRoomUri,
  emojiIdParamString,
  getCurrentRoomInfo,
  getRoomsUri,
  kickPlayerUri,
  playerChoiceParamString,
  roomIdParamString,
  setEmojiUri,
  setUserChoiceUri,
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
    uri: 'get_existing_games',
  })
};
// создать игру 
export const postNewRoomRequest = (data: any, userIdValue: string) => {
  return postReq({
    uri: createRoomUri,
    userId: userIdValue,
    data: data
  });
};
// получить инфо о комнате по айди
// export const getRoomInfoRequest = (roomId: string) => {
//   return getReq({
//     uri: getCurrentRoomInfo,
//     userId: roomId,
//   })
// };
// запрос на подключение к комнатеъ
export const joinRoomRequest = (userIdValue: string, roomId: string) => {
  return putReq({
    uri: addPlayerUri,
    userId: userIdValue,
    endpoint: `${roomIdParamString}${roomId}`,
  })
};
// запрос на отключение от комнаты
export const leaveRoomRequest = (userIdValue: string) => {
  return putReq({
    uri: kickPlayerUri,
    userId: userIdValue,
  })
};
// запрос на отправку выбора 
// export const setChoiceRequest = (userIdValue: string, roomId: string, choice: string) => {
//   return putReq({
//     uri: setUserChoiceUri,
//     userId: userIdValue,
//     endpoint: `${roomIdParamString}${roomId}${playerChoiceParamString}${choice}`,
//   })
// };
// запрос на отправку эмодзи 
// export const setEmojiRequest = (userIdValue: string, roomId: string, emoji: string) => {
//   return putReq({
//     uri: setEmojiUri,
//     userId: userIdValue,
//     endpoint: `${roomIdParamString}${roomId}${emojiIdParamString}${emoji}`,
//   })
// };
// запрос на отправку определения победителя
export const whoIsWinRequest = (roomId: string) => {
  return putReq({
    uri: whoIsWinUri,
    // userId: userId,
    endpoint: `${roomIdParamString}${roomId}`,
  })
};
// получить активный пак эмодзи пользователя
export const getEmojiRequest = (packId: string, emojiId: string) => {
  return getReq({
    uri: 'getemojiphoto',
    endpoint: `&pack_id=${packId}&emotion_id=${emojiId}`,
  })
};

// запрос на получение данных внутри игры 
export const getPollingRequest = (userIdValue: string, data: any) => {
  return postReq({
    uri: 'polling?user_id=',
    userId: userIdValue,
    data: data,
  })
};