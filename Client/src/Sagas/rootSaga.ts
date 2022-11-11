import {all} from 'redux-saga/effects'
import { watchAttemptLogin } from './AuthSaga'
import { watchCallAPI } from './counterSaga'
import { watchDeleteQuestion, watchEditQuestion, watchGetQuestions, watchInsertSubmission, watchSearchQuestion } from './questionSaga'

export default function* rootSaga() {
    yield all([
      watchCallAPI(),
      watchGetQuestions(),
      watchDeleteQuestion(),
      watchEditQuestion(),
      watchSearchQuestion(),
      watchInsertSubmission(),
      watchAttemptLogin()
    ])
  }