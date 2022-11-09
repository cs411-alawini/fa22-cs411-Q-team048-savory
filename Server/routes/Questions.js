import express from 'express';
import {getQuestions} from '../Controller/QuestionsController/Questions.js'

const router = express.Router();

/*
  /advqueries/<avg_clauses/avg_attempts> are supported
  Returns: [{"QuestionId":<>,"avg_clauses":<>},{"QuestionId":<>,"avg_clauses":<>},...]
*/
router.get('/:uname', (req, res) => {
    console.log("Got user name", req.params.uname);
    getQuestions(req, res);
  })

export default router;