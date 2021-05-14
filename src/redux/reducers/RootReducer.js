import { combineReducers } from 'redux';
import DataReducer from './DataReducer';
import UserReducer from './UserReducer';
import HomeReducer from './HomeReducer';
import RankingsReducer from './RankingsReducer';
import FactorsReducer from './FactorsReducer';
import GraphReducer from './GraphReducer';

export default combineReducers({
  data: DataReducer,
  user: UserReducer,
  home: HomeReducer,
  rankings: RankingsReducer,
  factors: FactorsReducer,
  graph: GraphReducer
});
