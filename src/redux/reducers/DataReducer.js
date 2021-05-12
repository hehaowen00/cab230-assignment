import { validCountries } from '../../utils/definitions';

const initialState = {
  rankings: {},
  factors: {},
  countries: new Set(validCountries),
  years: [2015, 2016, 2017, 2018, 2019, 2020]
};

export default function DataReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'addRanking': {
      const { year, entry } = payload;
      let country = entry.country;

      let { countries, rankings } = state;
      countries.add(country);
      rankings[year][country] = entry;

      return {
        countries,
        rankings,
        ...state
      };
    }
    case 'addRankings': {
      let { countries, rankings } = state;
      const { year, data } = payload;

      for (let i = 0; i < data.length; i++) {
        countries.add(data[i].country);
      }

      rankings[year] = data;

      return {
        countries,
        rankings,
        ...state
      };
    }
    case 'setCountries': {
      return state;
    }
    default:
      return state
  }
};

