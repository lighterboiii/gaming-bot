import { getReq, postReq } from "./api";
import { createRoomUri, getRoomsUri } from "./requestData";

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