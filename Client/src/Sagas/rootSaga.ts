import {all} from 'redux-saga/effects'
import { watchAttemptLogin } from './AuthSaga'
import { watchDeleteQuestion, watchEditQuestion, watchGetIntermediateResult, watchGetQuestions, watchInsertSubmission, watchSearchQuestion } from './questionSaga'

export default function* rootSaga() {
    yield all([
      watchGetQuestions(),
      watchDeleteQuestion(),
      watchEditQuestion(),
      watchSearchQuestion(),
      watchInsertSubmission(),
      watchAttemptLogin(),
      watchGetIntermediateResult()
    ])
  }