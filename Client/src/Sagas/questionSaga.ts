import { put, takeEvery } from "redux-saga/effects";
import { getQuestions, Question, setQuestions } from "../Components/Question/QuestionSlice";
import {CatData, GET} from "../Services/HttpService";
function* FetchAPIDataAsync() {
    try {
        
        const apiResult: Question[] = yield GET<Question[]>('http://localhost:8080/questions');
        yield put(setQuestions(apiResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

export function* watchCallAPI() {
    yield takeEvery(getQuestions, FetchAPIDataAsync);
}