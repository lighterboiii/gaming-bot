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
  return   postReq({
    uri: createRoomUri,
    userId: userIdValue,
    data: data
  });
};