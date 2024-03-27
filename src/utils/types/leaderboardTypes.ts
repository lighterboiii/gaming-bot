export interface ILeader {
avatar: string;
coins: number;
item_mask: string;
item_pic: string;
public_name: string;
user_id: number;
}

export interface ILeaderBoardResponse {
  top_users: ILeader[];
}