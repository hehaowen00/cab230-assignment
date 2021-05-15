export function XAxisAction(value) {
  return { type: 'graph', sub: 'xAxis', payload: value };
}

export function CheckedAction(value) {
  return { type: 'graph', sub: 'checked', payload: value };
}

export function LastAction(value) {
  return { type: 'graph', sub: 'last', payload: value };
}

export function DatasetAction(value) {
  return { type: 'graph', sub: 'dataset', payload: value };
}

