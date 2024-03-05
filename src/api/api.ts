const url = "https://ddec-46-29-234-97.ngrok-free.app/getuserinfo?user_id=116496831";
const queryId = '?user_id=116496831';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieW91cl91c2VyX2lkIiwiZXhwIjoxNzEyMjM5ODgzfQ.nupVB2golHbMaZsGF3y-Xka73mm5hdhozZEx0OVBhYE';

const headers = {
  'Authorization': `Bearer ${token}`,
  'ngrok-skip-browser-warning': 'true',
  'Allow-Access-Contor-Origin': 'true',
};

export function getData() {
  fetch(`${url}${queryId}`, {
    method: 'GET',
    mode: 'no-cors',
    headers: headers,
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
};
