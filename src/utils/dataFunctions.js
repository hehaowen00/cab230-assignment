import { URL_PREFIX, getCountryCode } from './definitions';
import { queryUrl, sendRequest } from './functions';

const COUNTRIES_URL = `${URL_PREFIX}/countries`;
const RANKINGS_URL = `${URL_PREFIX}/rankings`;
const FACTORS_URL = `${URL_PREFIX}/factors/`;

export async function fetchCountries() {
  const config = getConfig(countriesUrl());
  return await sendRequest(config);
};

export async function fetchRankings(params) {
  const config = getConfig(rankingsUrl(params));
  return await sendRequest(config);
};

export async function fetchFactors(params, token) {
  const config = getConfig(factorsUrl(params), token);
  return await sendRequest(config);
};

function getConfig(url, token = undefined) {
  return {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json',
      ...(token && {'Authorization': 'Bearer ' + token})
    },
    timeout: 1000
  };
}

function countriesUrl() {
  return COUNTRIES_URL;
}

function factorsUrl({year, ...params}) {
  let url = FACTORS_URL + encodeURIComponent(year) + '/';
  return queryUrl(url, params);
}

function rankingsUrl(params) {
  return queryUrl(RANKINGS_URL, params);
}

export function mapRankingsToCountries(data) {
  let mapData = [];
  let errors = [];

  for (let i = 0; i < data.length; i++) {
    let entry = data[i];
    let { country, score } = entry;
    let code = getCountryCode(country);

    if (code) {
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
