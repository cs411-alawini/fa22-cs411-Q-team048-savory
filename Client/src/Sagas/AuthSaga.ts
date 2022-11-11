import { put, takeEvery } from "redux-saga/effects";
import { login, setLoginResult } from "../Components/Auth/AuthSlice";
import {CatData, GET, Login} from "../Services/HttpService";

function* FetchLoginResult(props: any) {
    try {
        console.log(props);
        const loginResult: boolean = yield Login<boolean>(props.payload.userName, props.payload.password);
        yield put(setLoginResult(loginResult));
    }
    catch(e)
    {
        console.log(e);
    }
}

export function* watchAttemptLogin() {
    yield takeEvery(login, FetchLoginResult);
}