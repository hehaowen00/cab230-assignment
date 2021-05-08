const initialState = {
  authenticated: false,
  email: ''
};

function UserReducer(state = initialState, action) {
  switch (action.type) {
    case 'userLogin': {
      const { payload } = action;
      return {
        authenticated: true,
        email: payload
      };
    }
    default:
      return state
  }
}

export default UserReducer;

