const initialState = {
  rankings: {},
  factors: {},
  countries: [],
  years: [2015, 2016, 2017, 2018, 2019, 2020]
};

export default function DataReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'addRanking': {
      const { year, entry } = payload;
      let country = entry.country;

      let { rankings } = state;
      rankings[year][country] = entry;

      return {
        rankings,
        ...state
      };
    }
    case 'addRankings': {
      let { rankings } = state;
      const { year, data } = payload;

      rankings[year] = data;

      return {
        rankings,
        ...state
      };
    }
    default:
      return state
  }
};

