import { Bonus, UserInfo } from "./mainTypes";
import { ItemData, LavkaData } from "./shopTypes";


export interface IAppData {
  collectibles_data: ItemData[];
  daily_bonus: Bonus;
  shop_available: ItemData[];
  user_info: UserInfo;
  lavka_available: LavkaData[];
}