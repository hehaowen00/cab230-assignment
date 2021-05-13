const initialState = {
  rankings: {},
  countries: [],
  factors: {},
  years: [2015, 2016, 2017, 2018, 2019, 2020]
};

export default function DataReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'addRanking': {
      const { year, entry } = payload;
      let country = entry.country;

      let { countries, rankings } = state;
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

      rankings[year] = data;

      return {
        countries,
        rankings,
        ...state
      };
    }
    case 'addFactorsYear': {
      let { factors } = state;
      let { year, data } = payload;

      if (year in factors) {
        let set = new Set(factors[year]);

        for (let i = 0; i < data.length; i++) {
          set.add(data[i]);
        }

        let temp = factors;
        temp[year] = Array.from(set);

        return {
          ...state,
          factors: temp
        }
      }
      else {
        let temp = factors;
        temp[year] = data;
        return {
          ...state,
          factors: temp
        }
      }
    }
    case 'setCountries': {
      let countries = payload;

      return {
        ...state,
        countries,
      };
    }
    default:
      return state
  }
};

