import { COUNTRIES_URL, FACTORS_URL, RANKINGS_URL, getCountryCode } from './definitions';
import axios from 'axios';

export function formatStr(format, ...args) {
  return format.replace(/{(\d+)}/g, function(match, num) {
    return typeof args[num] != undefined ? args[num] : match
  });
};

function replaceSpaces(str) {
  return str.replace(' ', '%20');
}

export function fetchCountries() {
  const config = {
    method: 'get',
    url: COUNTRIES_URL,
    headers: {
      'Accept': 'application/json',
    },
    timeout: 1000,
  };

  return axios(config).catch(err => {
    console.log(err);

    throw {
      type: 'error',
      message: err.toString()
    }
  }).then(resp => {
    if (!resp.status === 200) {
      return {
        type: 'error',
        message: 'could not fetch countries',
      };
    }

    return {
      type: 'success',
      data: resp.data,
    };
  }).catch(err => err);
};

export function fetchCountryRankings(country, year) {
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

  return axios(config).catch(err => {
    console.log(err);

    throw {
      type: 'error',
      message: err.toString()
    };
  }).then(resp => {
    if (!resp.status === 200) {
      return {
        type: 'error',
        message: 'could not fetch json',
      };
    }

    return {
      type: 'success',
      data: resp.data,
    };
  }).catch(err => err);
};

export function fetchRankings(year) {
  const url = formatStr(RANKINGS_URL.year, year);

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
      message: err.toString()
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
  }).catch(err => err);
};

export function getFactorsYear(token, year, limit) {
  const url = formatStr(FACTORS_URL.limited, year, limit);

  console.log(url);

  const config = {
    method: 'get',
    url,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    timeout: 5000
  };

  return axios(config).catch(err => {
    console.log(err);

    throw {
      type: 'error',
      message: err.toString()
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
  }).catch(err => err);
}

export function getFactorsCountry(country) {

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

