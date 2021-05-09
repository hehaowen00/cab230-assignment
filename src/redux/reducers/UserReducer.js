const initialState = {
  authenticated: false,
  email: ''
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
    default:
      return state
  }
}

