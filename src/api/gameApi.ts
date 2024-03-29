import { getReq, postReq } from "./api";

// получить все комнаты
export const getOpenedRoomsRequest = () => {
  return getReq({
    uri: 'getrooms',
    userId: '',
  });
};
// создать игру 
export const postNewRoomRequest = (data: any, userIdValue: string) => {
  return   postReq({
    uri: `createroom?user_id=${userIdValue}`,
    data: data
  });
};