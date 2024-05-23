import { IBonus, IUserData } from "./mainTypes";
import { ItemData, ILavkaData } from "./shopTypes";


export interface IAppData {
  collectibles_data: ItemData[];
  daily_bonus: IBonus;
  shop_available: ItemData[];
  user_info: IUserData;
  lavka_available: ILavkaData[];
  translate: any;
  tasks_available: any;
  ad_info: any;
  avatar: string;
}