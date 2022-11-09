import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import sagas from '../Sagas/rootSaga'
import counterReducer from "../Components/Counter/CounterSlice";
import questionReducer from "../Components/Question/QuestionSlice";
const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
    counter: counterReducer,
    question: questionReducer
})

export const store = configureStore({
    reducer: reducer,
    middleware: [...getDefaultMiddleware({thunk: false}), sagaMiddleware],
  });
  
sagaMiddleware.run(sagas);

export type RootState = ReturnType<typeof store.getState>