import { IBannerData, IBonus, ITask, IUserData } from "./mainTypes";
import { ItemData, ILavkaData } from "./shopTypes";


export interface IAppData {
  collectibles_data: ItemData[];
  daily_bonus: IBonus;
  shop_available: ItemData[];
  user_info: IUserData;
  lavka_available: ILavkaData[];
  translate: string[];
  tasks_available: ITask[] | any;
  ad_info: IBannerData[];
  avatar: string;
  shop_image_url: string;
}