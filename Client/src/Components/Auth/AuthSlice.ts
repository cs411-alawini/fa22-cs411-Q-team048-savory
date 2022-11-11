import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../Store/store';

interface Auth {
    userName: string;
    password: string;
    loginResult: boolean | undefined;
}

const initialState: Auth = {
    userName: "",
    password: "",
    loginResult: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, {payload}: PayloadAction<{userName: string, password: string}>) => {
            state.userName=payload.userName;
            state.password=payload.password;
        },
        setLoginResult: (state, {payload}: PayloadAction<boolean | undefined>) => {
            state.loginResult=payload; 
        }
    },
  })

  export const {login, setLoginResult} = authSlice.actions
  
  export default authSlice.reducer

  export const authSelector = (state: RootState) => state.auth;