const initialState = {
  view: 'Country',
  year: undefined,
  limit: undefined,
  country: undefined,
  range: [undefined, undefined],
  once: false,
};

const allowed = [
  'view',
  'year',
  'limit',
  'once',
];

export default function FactorsReducer(state = initialState, action) {
  let { type, sub, payload } = action;

  if (type !== 'factors' || !(!sub || !(sub in state))) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;

  if (!allowed.includes(sub)) {
    temp['once'] = false;
  }

  return temp;
}
