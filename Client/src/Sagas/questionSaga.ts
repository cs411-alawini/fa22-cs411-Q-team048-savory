import { put, takeEvery } from "redux-saga/effects";
import { deleteQuestion, editQuestion, getQuestions, Question, searchQuestion, setAllQuestions, setFilteredQuestionList, setQuestions } from "../Components/Question/QuestionSlice";
import {CatData, DELETE, GET, SEARCH, UPDATE} from "../Services/HttpService";
function* FetchAPIDataAsync() {
    try {
        const apiResult: Question[] = yield GET<Question[]>('http://localhost:8081/questions/getbyuser/kihow0');
        yield put(setQuestions(apiResult));
        yield put(setAllQuestions(apiResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

function* DeleteQuestionAsync(props: any) {
    try {
        const apiResult: Question[] = yield DELETE<Question[]>('http://localhost:8081/questions/deletequestion/'+props.payload);
        yield put(setQuestions(apiResult));
        yield put(setAllQuestions(apiResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

function* EditQuestionAsync(props: any) {
    try {
        console.log(props.payload);
        const apiResult: Question[] = yield UPDATE<Question[]>('http://localhost:8081/questions/update/'+props.payload.id, props.payload.desc);
        yield put(setQuestions(apiResult));
        yield put(setAllQuestions(apiResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

function* SearchQuestionAsync(props: any) {
    try {
        const apiResult: {ID: number}[] = yield SEARCH<{ID: number}[]>('http://localhost:8081/questions/search/', props.payload);
        yield put(setFilteredQuestionList(apiResult));
    }
    catch(e)
    {
        console.log(e);
    }
}
export function* watchGetQuestions() {
    yield takeEvery(getQuestions, FetchAPIDataAsync);
}

export function* watchDeleteQuestion() {
    yield takeEvery(deleteQuestion, DeleteQuestionAsync);
}

export function* watchEditQuestion() {
    yield takeEvery(editQuestion, EditQuestionAsync);
}

export function* watchSearchQuestion() {
    yield takeEvery(searchQuestion, SearchQuestionAsync);
}