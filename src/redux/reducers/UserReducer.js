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
    case 'userLogin': {
      return {
        ...state,
        authenticated: true,
        email: payload
      };
    }
    case 'userLogout': {
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
    case 'clearRedirect': {
      return {
        ...state,
        redirect: undefined
      }
    }
    default:
      return state
  }
}

