import express from 'express';
import {getQuestions, deleteQuestion, updateQuestion, searchQuestion} from '../Controller/QuestionsController/Questions.js'

const router = express.Router();

/*
  /advqueries/<avg_clauses/avg_attempts> are supported
  Returns: [{"QuestionId":<>,"avg_clauses":<>},{"QuestionId":<>,"avg_clauses":<>},...]
*/
router.get('/getbyuser/:uname', (req, res) => {
    getQuestions(req, res);
  });

router.post('/deletequestion/:qid', (req, res) => {
    deleteQuestion(req, res);
});

router.post('/update/:qid', (req, res) => {
    //console.log("Hits update"+req.body["new_description"]);
    updateQuestion(req,res);
    
});

router.post('/search', (req, res) => {
    //console.log("Hits search"+req.body["search_key"]);
    searchQuestion(req,res);
    
});
export default router;