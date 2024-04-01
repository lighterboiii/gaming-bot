import { getReq, postReq, putReq } from "./api";
import { createRoomUri, getRoomsUri, roomIdValue, setChoiceUri } from "./requestData";

// получить все комнаты
export const getOpenedRoomsRequest = () => {
  return getReq({
    uri: getRoomsUri,
    userId: '',
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
    uri: `getroominfo?room_id=`,
    userId: roomId,
  })
};
// отправить выбор игрока на сервер
export const setUserChoice = (userIdValue: string, roomId: string, choice: string) => {
  return putReq({
    uri: setChoiceUri,
    userId: userIdValue,
    endpoint: `${roomIdValue}${roomId}&choice=${choice}`
  })
};