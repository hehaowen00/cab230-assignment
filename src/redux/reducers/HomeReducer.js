const initialState = {
  year: '2020'
};

export default function HomeReducer(state = initialState, action) {
  let { type, sub, payload } = action;

  if (type !== 'home' || !sub || !(sub in state)) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;
  return temp;
}

            
