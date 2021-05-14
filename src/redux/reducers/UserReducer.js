const initialState = {
  authenticated: false,
  email: '',
  redirect: undefined
};

export default function UserReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'userLogin': {
      return {
        authenticated: true,
        email: payload
      };
    }
    case 'userLogout': {
      return {
        authenticated: false,
        email: state.email
      };
    }
    default:
      return state
  }
}

