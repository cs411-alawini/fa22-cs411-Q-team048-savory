import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { RootState } from "../../Store/store";

interface Questions {
  questions: Question[];
  filteredQuestions: { ID: number }[];
  allQuestions: Question[];
  isFiltered: boolean;
  isSubmitted: boolean;
}

export interface IntermediateResults {
  result: [
    {
      type: string;
      order: number;
      output: {
        rows: object[];
        cols: string[];
      };
    }
  ];
  status: boolean;
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
  filteredQuestions: [],
  allQuestions: [],
  isFiltered: false,
  isSubmitted: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    getQuestions: () => {},
    setIsFiltered: (state, { payload }: PayloadAction<boolean>) => {
      state.isFiltered = payload;
    },
    setAllQuestions: (state, { payload }: PayloadAction<Question[]>) => {
      state.allQuestions = payload;
    },
    setQuestions: (state, { payload }: PayloadAction<Question[]>) => {
      state.questions = payload;
    },
    deleteQuestion: (state, { payload }: PayloadAction<number>) => {},
    editQuestion: (
      state,
      { payload }: PayloadAction<{ id: number; desc: string }>
    ) => {},
    searchQuestion: (state, { payload }: PayloadAction<string>) => {},
    setFilteredQuestionList: (
      state,
      { payload }: PayloadAction<{ ID: number }[]>
    ) => {
      state.filteredQuestions = payload;
      state.isFiltered = true;
    },
    executeSubmission: (
      state,
      { payload }: PayloadAction<{ qid: number; query: string; uid: string }>
    ) => {},
    setSubmissionStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isSubmitted = payload;
    },
    getIntermediateResult: (state, { payload }: PayloadAction<string>) => {},
  },
});

export const {
  getIntermediateResult,
  getQuestions,
  setSubmissionStatus,
  setQuestions,
  setAllQuestions,
  setIsFiltered,
  deleteQuestion,
  editQuestion,
  searchQuestion,
  setFilteredQuestionList,
  executeSubmission,
} = questionSlice.actions;

export default questionSlice.reducer;

export const questionSelector = (state: RootState) => state.question;
