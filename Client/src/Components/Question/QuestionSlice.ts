import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../Store/store";

interface Questions {
  questions: Question[];
  filteredQuestions: { ID: number }[];
  allQuestions: Question[];
  isFiltered: boolean;
  isSubmitted: boolean;
  intermediateResults: IntermediateResults | undefined;
  submissionID: number | undefined;
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
  error: string;
  isCorrect: boolean;
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
  intermediateResults: undefined,
  submissionID: undefined
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    getQuestions: (state, {payload}:PayloadAction<string>) => {console.log(payload)},
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
    ) => {
      state.intermediateResults=undefined;
    },
    setSubmissionStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isSubmitted = payload;
    },
    getIntermediateResult: (state, { payload }: PayloadAction<{query: string, submissionId: number | undefined, questionID: number}>) => {console.log(payload.questionID)},
    setIntermediateResult: (state, {payload}: PayloadAction<IntermediateResults>) => {
        state.intermediateResults = payload;
    },
    setSubmissionId: (state, {payload}: PayloadAction<number>) => {
      state.submissionID = payload;
    }
  },
});

export const {
  setSubmissionId,
  setIntermediateResult,
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
