export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieW91cl91c2VyX2lkIiwiZXhwIjoxNzEyNjk0MDQwfQ.Yj9qWHJZMSl6yg-Xb5tnZeZniCK0FsNwBa1MS4VynxE';
export const userId = '116496831';

export const userIdQuery = `?user_id=${userId}`;

export const getUserInfoUri = `getuserinfo?user_id=`;
export const getUserPhotoUri = `getuserpic?user_id=`;
export const setTokensValueUri = `settokensnewvalue${userIdQuery}`;