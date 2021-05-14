const generateArr = () => {
  let arr = new Array(8).fill(false);
  arr[0] = true;
  return arr;
}

const initialState = {
  xAxis: 'year',
  checked: generateArr(),
  dataset: undefined,
};

export default function(state = initialState, { type, sub, payload }) {
  if (type !== 'graph' || !sub || !(sub in state)) {
    return state;
  }

  let temp = Object.assign({}, state);
  temp[sub] = payload;
  return temp;
}