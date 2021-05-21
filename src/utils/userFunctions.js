import { URL_PREFIX } from './definitions';
import { queryUrl, sendRequest } from './functions';

const LOGIN_URL = `${URL_PREFIX}/user/login`;
const REGISTER_URL = `${URL_PREFIX}/user/register`;

export async function loginUser(data) {
  const config = generateConfig(LOGIN_URL, data);
  return await sendRequest(config);
}

export async function registerUser(data) {
  const config = generateConfig(REGISTER_URL, data);
  return await sendRequest(config);
}

function generateConfig(url, data) {
  return {
    method: 'POST',
    url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data,
    timeout: 1000
  }
}
