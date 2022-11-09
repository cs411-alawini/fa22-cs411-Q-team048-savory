import {all} from 'redux-saga/effects'
import { watchCallAPI } from './counterSaga'
import { watchDeleteQuestion, watchEditQuestion, watchGetQuestions, watchSearchQuestion } from './questionSaga'

export default function* rootSaga() {
    yield all([
      watchCallAPI(),
      watchGetQuestions(),
      watchDeleteQuestion(),
      watchEditQuestion(),
      watchSearchQuestion()
    ])
  }