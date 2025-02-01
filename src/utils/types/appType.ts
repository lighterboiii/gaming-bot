/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBannerData, IBonus, ITask, IUserData } from "./mainTypes";
import { ItemData } from "./shopTypes";

export interface IAppData {
  collectibles_data: ItemData[];
  daily_bonus: IBonus;
  shop_available: ItemData[];
  user_info: IUserData;
  lavka_available: ItemData[];
  translate: string[];
  tasks_available: ITask[];
  ad_info: IBannerData[];
  avatar: string;
  shop_image_url: string;
  game_rule_1_url: string;
  game_rule_2_url: string;
  game_rule_3_url: string;
  game_rule_4_url: string;
  game_rule_1_show: boolean;
  game_rule_2_show: boolean;
  game_rule_3_show: boolean;
  game_rule_4_show: boolean;
  warning?: 'warning';
  warning_message?: string;
}