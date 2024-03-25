import { IAppData } from "../utils/types";
import { getReq } from "./api";
import { mainAppDataUri } from "./requestData";

export const getAppData = async (userIdValue: string) => {
  return await getReq<IAppData>({
    uri: mainAppDataUri,
    userId: userIdValue,
  });
}