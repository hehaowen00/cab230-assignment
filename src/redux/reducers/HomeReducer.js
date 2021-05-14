const initialState = {
  year: '2020'
};


export default function(state = initialState, { type, sub, payload }) {
  if (type !== 'home' && !sub || !(sub in state)) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;
  return temp;
}

