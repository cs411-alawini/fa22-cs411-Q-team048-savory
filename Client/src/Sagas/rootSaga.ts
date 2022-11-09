import {all} from 'redux-saga/effects'
import { watchAttemptLogin } from './AuthSaga'
import { watchCallAPI } from './counterSaga'

export default function* rootSaga() {
    yield all([
      watchCallAPI(),
      watchAttemptLogin()
    ])
  }