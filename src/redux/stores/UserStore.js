import { createStore } from 'redux';
import UserReducer from '../reducers/UserReducer';

const UserStore = createStore(UserReducer);

export default UserStore;
