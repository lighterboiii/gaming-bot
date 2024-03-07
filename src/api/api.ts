import { token } from "./requestData";

/* eslint-disable import/no-anonymous-default-export */
type TOptions = {
  headers?: { authorization?: string, 'Content-Type': string };
  method?: string;
  body?: string;
};

type TRequest = {
  uri: string;
  data?: any;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  proxyUrl?: string; // на время разработки для обхода ошибок cors
};

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://8da8-46-29-234-97.ngrok-free.app/';

const BASE_PARAMS = {
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json;charset=utf-8',
    'ngrok-skip-browser-warning': 'true', // на время разработки для обхода ошибок cors
  }
};

function getRequestParams({ uri, method, data }: TRequest) {
  const params: TOptions = {
    ...BASE_PARAMS,
    method
  };
  const path = `${PROXY_URL}${BASE_URL}${uri}`;
  if (data) {
    params.body = JSON.stringify(data);
  }
  return { path, params };
};
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
};
/**
 * @template T
 * @param {string} url добавочная строка `${BASE_URL}/${url}`
 * @param {TOptions} options объект настроек для fetch-запроса
 * @returns {Promise<T>} {(Promise<T> | Promise<never>)} промис с парсированным объектом response или `Promise.reject([Ошибка ${res.status}, res.json()])`
 */

function request<T>(url: string, options: TOptions): Promise<T> {
  return fetch(url, options).then(checkRes) as Promise<T>; 
};

export function getReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'GET' });
  return request<T>(path, params);
};

export function postReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'POST' });
  return request<T>(path, params);
};

export function patchReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'PATCH' });
  return request<T>(path, params);
};

export function deleteReq<T>(options: TRequest) {
  const { path, params } = getRequestParams({ ...options, method: 'DELETE' });
  return request<T>(path, params);
};

export default {
  getReq, postReq, patchReq, deleteReq
};