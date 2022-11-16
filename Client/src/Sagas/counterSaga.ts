import { put, takeEvery } from "redux-saga/effects";
import { callAPI, setAPIResult } from "../Components/Counter/CounterSlice";
import {CatData, GET} from "../Services/HttpService";
function* FetchAPIDataAsync() {
    try {
        const apiResult: CatData = yield GET<CatData>('https://catfact.ninja/fact');
        yield put(setAPIResult(apiResult.fact));
    }
    catch(e)
    {
        console.log(e);
    }
}

export function* watchCallAPI() {
    yield takeEvery(callAPI, FetchAPIDataAsync);
}