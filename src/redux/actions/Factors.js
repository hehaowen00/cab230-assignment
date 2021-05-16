export function ViewAction(view) {
  return { type: 'factors', sub: 'view', payload: view };
}

export function YearAction(year) {
  return { type: 'factors', sub: 'year', payload: year };
}

export function LimitAction(limit) {
  return { type: 'factors', sub: 'limit', payload: limit };
}

export function CountryAction(country) {
  return { type: 'factors', sub: 'country', payload: country };
}

export function RangeAction(range) {
  return { type: 'factors', sub: 'range', payload: range };
}

export function OnceAction(once) {
  return { type: 'factors', sub: 'once', payload: once };
}
