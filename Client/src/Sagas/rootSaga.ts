import {all} from 'redux-saga/effects'
import { watchCallAPI } from './counterSaga'

export default function* rootSaga() {
    yield all([
      watchCallAPI(),
    ])
  }