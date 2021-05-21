const initialState = {
  authenticated: false,
  email: '',
  redirect: undefined
};

export default function UserReducer(state = initialState, action) {
  const { type, sub, payload } = action;

  if (type !== 'user') {
    return state;
  }

  switch (sub) {
    case 'login': {
      return {
        ...state,
        authenticated: true,
        email: payload
      };
    }
    case 'logout': {
      return {
        ...state,
        authenticated: false,
        email: ''
      };
    }
    case 'setRedirect': {
      return {
        ...state,
        redirect: payload
      }
    }
    default:
      return state
  }
}

