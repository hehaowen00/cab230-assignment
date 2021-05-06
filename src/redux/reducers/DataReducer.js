const initialState = { countries: [] };

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case 'storeCountries': {
      const { countries } = action.payload
      return {
        ...state,
        countries
      }
    }
    default:
      return state
  }
};
