import axios from 'axios';

export function queryUrl(url, params) {
  if (Object.keys(params).length === 0) {
    return url;
  }

  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(entry => entry.map(encodeURIComponent))
    .reduce((acc, [key, value]) => acc + `${key}=${value}`, url + '?');
}

export async function sendRequest(config) {
  return axios(config).then(resp => {
    const { status } = resp;

    return {
      type: 'success',
      status,
      data: resp.data,
    };
  }).catch(err => {
    console.log(`error: `, JSON.stringify(config));

    if (err.response) {
      const { status, data } = err.response;
      const message = data.message;

      return {
        type: 'error', status, message
      }
    }

    return {
      type: 'error', status: err.code, message: err.message
    };
  });
}

