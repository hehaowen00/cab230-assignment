import { RANKINGS_URL, getCountryCode } from './definitions';

export function formatStr(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, num) {
    return typeof args[num] != undefined ? args[num] : match
  });
};

export async function fetchRankings(year) {
  let url = formatStr(RANKINGS_URL.year, year);

  let resp = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  });

  if (resp.status === 200) {
    return {
      type: 'success',
      rankings: await resp.json()
    };
  }

  return {
    type: 'error',
    message: 'failed to load rankings from API'
  };
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
