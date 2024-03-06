export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieW91cl91c2VyX2lkIiwiZXhwIjoxNzEyMjM5ODgzfQ.nupVB2golHbMaZsGF3y-Xka73mm5hdhozZEx0OVBhYE';
export const userId = '116496831';

export const userIdQuery = `?user_id=${userId}`;

export const getUserInfoUri = `getuserinfo${userIdQuery}`;
export const setTokensValueUri = `settokensnewvalue${userIdQuery}`;