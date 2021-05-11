import { RANKINGS_URL, getCountryCode } from './definitions';
const axios = require('axios');

export function formatStr(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, num) {
    return typeof args[num] != undefined ? args[num] : match
  });
};

export async function fetchRankings(year) {
  let url = formatStr(RANKINGS_URL.year, year);

  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json'
    },
    timeout: 5000
  };

  return axios(config).catch(err => {
    console.log('error', err);

    throw {
      type: 'error',
      message: err
    };
  }).then(resp => {
    if (!resp.status === 200) {
      return {
        type: 'error',
        message: 'could not fetch json'
      };
    }

    return {
      type: 'success',
      rankings: resp.data
    };
  }).catch(err => {
    return err;
  });
};

export function mapRankingsToMapData(data) {
  let mapData = [];
  let errors = [];

  for (let i = 0; i < data.length; i++) {
    let entry = data[i];
    let { country, score } = entry;
    let code = getCountryCode(country);

    if (code !== undefined) {
      mapData.push({ country: getCountryCode(country), value: score });
    } else {
      console.log('Unable to get country code for', country);
      errors.push(country);
    }
  }

  return {
    mapData,
    errors
  };
}
