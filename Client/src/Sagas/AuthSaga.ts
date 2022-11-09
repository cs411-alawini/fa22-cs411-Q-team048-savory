import { put, takeEvery } from "redux-saga/effects";
import { login, setLoginResult } from "../Components/Auth/AuthSlice";
import { callAPI, setAPIResult } from "../Components/Counter/CounterSlice";
import {CatData, GET,Login} from "../Services/HttpService";

function* FetchLoginResult(props: any) {
    try {
        const loginResult: boolean = yield Login<boolean>(props.userName, props.password);
        yield put(setLoginResult(loginResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

export function* watchCallAPI() {
    yield takeEvery(login, FetchLoginResult);
}