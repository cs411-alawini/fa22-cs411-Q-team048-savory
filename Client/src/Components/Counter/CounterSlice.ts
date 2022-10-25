import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../Store/store';

interface Counter {
    count: number;
    apiResult: string;
}

const initialState: Counter = {
    count: 0,
    apiResult: "",
}

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementCount: (state) => {
            state.count=state.count+1;
        },
        decrementCount: (state) => {
            state.count=state.count-1;
        },
        callAPI: () => {

        },
        setAPIResult: (state, {payload}: PayloadAction<string>) => {
            state.apiResult=payload;
        }
    },
  })

  export const {incrementCount, decrementCount, callAPI, setAPIResult} = counterSlice.actions
  
  export default counterSlice.reducer

  export const counterSelector = (state: RootState) => state.counter;