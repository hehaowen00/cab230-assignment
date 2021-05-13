export function AddRankings(year, data) {
  return { type: 'addRankings', payload: { year, data } };
}

export function AddRanking(year, entry) {
  return {
    type: 'addRanking', payload: { year, entry }
  }
}

export function AddFactorsYear(year, data) {
  return { type: 'addFactorsYear', payload: { year, data } };
}
