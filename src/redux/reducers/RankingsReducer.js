const initialState = {
  view: 'Country',
  plot: 'Rank',
  countries: [undefined, undefined],
  years: [undefined, undefined]
};

export default function RankingsReducer(state = initialState, action) {
  let { type, sub, payload } = action;

  if (type !== 'rankings' || !sub || !(sub in state)) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;
  return temp;
}

