const initialState = {
  authenticated: false,
  email: ''
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'userAuthenticated': {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
