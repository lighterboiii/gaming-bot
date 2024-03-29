import { getReq } from "./api";

export const getOpenedRoomsRequest = () => {
  return getReq({
    uri: 'getrooms',
    userId: '',
  });
};