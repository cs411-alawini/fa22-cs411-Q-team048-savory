import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../Store/store';


interface Questions {
    questions: Question[];
}

export interface Question {
    iD: number;
    description: string;
    difficulty: string;
    avgAttempts: number;
    avgClauses: number;
    status: boolean;
}

const initialState: Questions = {
    questions: [{
        iD: 1,
        description: "abcd",
        difficulty: "easy",
        avgAttempts: 0,
        avgClauses: 0,
        status: false
    },
    {
        iD: 2,
        description: "efgh",
        difficulty: "easy",
        avgAttempts: 0,
        avgClauses: 0,
        status: false
    },
    {
        iD: 3,
        description: "ijkl",
        difficulty: "easy",
        avgAttempts: 0,
        avgClauses: 0,
        status: false
    }]
}

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        getQuestions: () => {

        },
        setQuestions: (state, {payload}: PayloadAction<Question[]>) => {
            state.questions=payload;
        },
        deleteQuestion: (state, {payload}: PayloadAction<number>) => {
            state.questions = state.questions.filter(s => s.iD !== payload);
        }
    },
  })

  export const {getQuestions, setQuestions, deleteQuestion} = questionSlice.actions
  
  export default questionSlice.reducer

  export const questionSelector = (state: RootState) => state.question;