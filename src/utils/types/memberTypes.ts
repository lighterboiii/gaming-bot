export interface IMember {
  avatar: string;
  coins: number;
  tokens: any;
  item_mask: string;
  item_pic: string;
  public_name: string;
  user_id: number;
  friends: any;
}

export interface IMemberDataResponse {
  top_users: IMember[];
}