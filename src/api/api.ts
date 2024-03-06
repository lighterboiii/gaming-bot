const proxyURL = 'https://cors-anywhere.herokuapp.com/';
const URL = "https://ddec-46-29-234-97.ngrok-free.app/getuserinfo?user_id=116496831";
// const queryId = '?user_id=116496831';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieW91cl91c2VyX2lkIiwiZXhwIjoxNzEyMjM5ODgzfQ.nupVB2golHbMaZsGF3y-Xka73mm5hdhozZEx0OVBhYE';

const headers = {
  // 'Authorization': `Bearer ${token}`,
  'ngrok-skip-browser-warning': 'true',
  // 'Allow-Access-Control-Origin': '*', 
  'Origin': 'http://localhost:3001'
};

export async function getData() {
  try {
    const response: Response = await fetch(`${proxyURL}${URL}`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error fetching data:' + error);
  }
};
