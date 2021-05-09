import { combineReducers } from 'redux';
import DataReducer from './DataReducer';
import UserReducer from './UserReducer'

export default combineReducers({
  data: DataReducer,
  user: UserReducer
});
