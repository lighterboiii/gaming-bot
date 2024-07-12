/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBannerData, IBonus, ITask, IUserData } from "./mainTypes";
import { ILavkaData, ItemData } from "./shopTypes";

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
  game_rule_1_url: string;
  game_rule_2_url: string;
  game_rule_1_show: boolean;
  game_rule_2_show: boolean;
}