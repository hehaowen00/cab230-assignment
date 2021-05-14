import { COUNTRIES_URL, FACTORS_URL, RANKINGS_URL, getCountryCode } from './definitions';
import axios from 'axios';

function formatStr(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, num) {
    return typeof args[num] != undefined ? args[num] : match
  });
};

function replaceSpaces(str) {
  return str.replace(' ', '%20');
}

async function fetchConfig(config, errMsg) {
  return axios(config).catch(err => {
    console.log(err);

    throw {
      type: 'error',
      message: err.toString()
    }
  }).then(resp => {
    if (resp.status === 401) {
      return {
        type: 'error',
        message: 'unauthorized'
      };
    }
    if (!resp.status === 200) {
      return {
        type: 'error',
        message: errMsg,
      };
    }

    return {
      type: 'success',
      data: resp.data,
    };
  }).catch(err => err);
}

export async function fetchCountries() {
  const config = {
    method: 'get',
    url: COUNTRIES_URL,
    headers: {
      'Accept': 'application/json',
    },
    timeout: 1000,
  };

  return await fetchConfig(config, 'could not fetch countries');
};

export async function fetchCountryRankings(country) {
  const encoded = replaceSpaces(country);
  const url = formatStr(RANKINGS_URL.country, encoded);
  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json',
    },
    timeout: 1000
  };

  return await fetchConfig(config, `could not retrieve rankings for ${country}`);
};

export async function fetchRankings(year) {
  const url = formatStr(RANKINGS_URL.year, year);
  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json'
    },
    timeout: 5000
  };

  return await fetchConfig(config, `could not retrieve rankings for ${year}`);
};

export async function fetchFactorsLimit(token, year, limit) {
  const url = formatStr(FACTORS_URL.limited, year, limit);
  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    timeout: 5000
  };

  return await fetchConfig(config, `could not retrieve factors for ${year} ${limit}`);
}

export async function fetchFactorsCountry(token, year, country) {
  const url = formatStr(FACTORS_URL.country, year, country);
  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    timeout: 5000
  };

  return await fetchConfig(config, `could not retrieve factors for ${country} ${year}`);
}

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

