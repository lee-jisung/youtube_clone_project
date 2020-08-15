import { combineReducers } from 'redux';
import user from './user_reducer';

// combineReducers => 여러가지 reducer를 합쳐서 return 해줌

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
