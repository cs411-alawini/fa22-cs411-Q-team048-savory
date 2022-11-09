import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../Store/store';


interface Questions {
    questions: Question[];
    filteredQuestions: number[];
}

export interface Question {
    ID: number;
    Description: string;
    Difficulty: string;
    avg_attempts: number;
    avg_clauses: number;
    Status: boolean;
    Solution: string;
}

const initialState: Questions = {
    questions: [],
    filteredQuestions: []
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
        },
        editQuestion: (state, {payload}: PayloadAction<{id: number, desc: string}>) => {
        },
        searchQuestion: (state, {payload}: PayloadAction<string>) => {
        },
        setFilteredQuestionList: (state, {payload}: PayloadAction<number[]>) => {
            state.filteredQuestions = payload;
        }

    },
  })

  export const {getQuestions, setQuestions, deleteQuestion, editQuestion, searchQuestion, setFilteredQuestionList} = questionSlice.actions
  
  export default questionSlice.reducer

  export const questionSelector = (state: RootState) => state.question;