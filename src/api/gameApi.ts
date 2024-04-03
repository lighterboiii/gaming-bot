import { getReq, postReq, putReq } from "./api";
import { createRoomUri, getCurrentRoomInfo, getRoomsUri, playerChoiceParamString, roomIdParamString, setChoiceUri } from "./requestData";

// получить все комнаты
export const getOpenedRoomsRequest = () => {
  return getReq({
    uri: getRoomsUri,
  });
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
export const getRoomInfoRequest = (roomId: string) => {
  return getReq({
    uri: getCurrentRoomInfo,
    userId: roomId,
  })
};
// отправить выбор игрока на сервер
export const setUserChoice = (userIdValue: string, roomId: string, choice: string) => {
  return putReq({
    uri: setChoiceUri,
    userId: userIdValue,
    endpoint: `${roomIdParamString}${roomId}${playerChoiceParamString}${choice}`
  })
};
// запрос на подключение к комнатеъ
export const joinRoomRequest = (userIdValue: string, roomId: string) => {
  return putReq({
    uri: 'addplayer?user_id=',
    userId: userIdValue,
    endpoint: `&room_id=${roomId}`,
  })
};
// запрос на отключение от комнаты
export const leaveRoomRequest = (userIdValue: string, roomId: string) => {
  return putReq({
    uri: 'kickplayer?user_id=',
    userId: userIdValue,
    endpoint: `&room_id=${roomId}`,
  })
};