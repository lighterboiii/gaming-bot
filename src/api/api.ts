/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable import/no-anonymous-default-export */
type TOptions = {
  headers?: { authorization?: string, 'Content-Type': string };
  method?: string;
  body?: string;
};

type TRequest = {
  uri: string;
  userId?: number;
  data?: any;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
};

const BASE_URL='https://gamebottggw.ngrok.app/'
const token =`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ2FtZWJvdGd3dGciLCJleHAiOjE3MzA4MTY5NDh9.6-w7uCzr2QQ0DkFamtW-OHZRwKsQa4l64Ofu3krwXKE`

const BASE_PARAMS = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json;charset=utf-8',
    'ngrok-skip-browser-warning': 'true',
  }
};

function getRequestParams({ uri, userId, method, data, endpoint }: TRequest) {
  const params: TOptions = {
    ...BASE_PARAMS,
    method
  };
  const path = `${BASE_URL}${uri}${userId ? `${userId}` : ''}${endpoint ? `${endpoint}` : ''}`;
  if (data) {
    params.body = JSON.stringify(data);
  }
  return { path, params };
}
/**
 * @template T
 * @param {IResponse<T>} res объект с полученным от сервера ответом. Должен иметь метод .json()
 * @returns {(Promise<T> | Promise<never>)} промис с парсированным объектом response или Promise.reject([`Ошибка ${res.status}`, res.json()])
 */
function checkRes<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`)
}
/**
 * @template T
 * @param {string} url добавочная строка `${BASE_URL}/${url}`
 * @param {TOptions} options объект настроек для fetch-запроса
 * @returns {Promise<T>} {(Promise<T> | Promise<never>)} промис с парсированным объектом response или `Promise.reject([Ошибка ${res.status}, res.json()])`
 */

function request<T>(url: string, options: TOptions): Promise<T> {
  return fetch(url, options).then(checkRes) as Promise<T>;
}

export function getReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'GET' });
  return request<T>(path, params);
}

export function postReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'POST' });
  return request<T>(path, params);
}

export function putReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'PUT' });
  return request<T>(path, params);
}

export function deleteReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'DELETE' });
  return request<T>(path, params);
}

export default {
  getReq, postReq, putReq, deleteReq
};
