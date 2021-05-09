import { createStore } from 'redux';
import RootReducer from '../reducers/RootReducer';

const RootStore = createStore(RootReducer);

export default RootStore;
