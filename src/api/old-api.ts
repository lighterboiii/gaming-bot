/* eslint-disable @typescript-eslint/no-unused-vars */
const userId = '116496831';
const proxyURL = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://8da8-46-29-234-97.ngrok-free.app/';
const getUserInfoRoute = "getuserinfo";
const setTokensValueRoute = 'settokensnewvalue';
const userIdQuery = `?user_id=${userId}`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieW91cl91c2VyX2lkIiwiZXhwIjoxNzEyMjM5ODgzfQ.nupVB2golHbMaZsGF3y-Xka73mm5hdhozZEx0OVBhYE';

const headers = {
  // 'Authorization': `Bearer ${token}`,
  'ngrok-skip-browser-warning': 'true',
  // 'Allow-Access-Control-Origin': '*', 
  // 'Origin': 'http://localhost:3001'
};

export async function getUserData() {
  try {
    const response: Response = await fetch(`${proxyURL}${BASE_URL}${getUserInfoRoute}${userIdQuery}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error('Ошибка получения данных');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Ошибка получения данных:' + error);
  }
};

export async function sendData(method: string, route: string, data: any) {
  try {
    const response: Response = await fetch(`${proxyURL}${BASE_URL}${route}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Ошибка отправки данных');
    }
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    throw new Error('Ошибка отправки данных:' + error);
  }
};
