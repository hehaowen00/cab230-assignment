const initialState = {
  view: undefined,
  plot: 'Rank',
  countries: [undefined, undefined],
  years: [undefined, undefined]
};

export default function(state = initialState, { type, sub, payload }) {
  if (type !== 'rankings' || !sub || !(sub in state)) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;
  return temp;
}
