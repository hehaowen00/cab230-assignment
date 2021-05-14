import { combineReducers } from 'redux';
import DataReducer from './DataReducer';
import UserReducer from './UserReducer';
import SessionReducer from './SessionReducer';

export default combineReducers({
  data: DataReducer,
  user: UserReducer
});
