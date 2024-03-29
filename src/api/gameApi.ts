import { getReq } from "./api";

export const getOpenedRoomsRequest = async () => {
  return await getReq({
    uri: 'getrooms',
    userId: '',
  });
};