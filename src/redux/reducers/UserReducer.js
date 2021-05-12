const initialState = {
  authenticated: false,
  email: ''
};

export default function UserReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'userLogin': {
      console.log('user login');
      return {
        authenticated: true,
        email: payload
      };
    }
    case 'userLogout': {
      console.log('run');
      return {
        authenticated: false,
        email: state.email
      };
    }
    default:
      return state
  }
}

