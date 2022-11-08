import express from 'express';
import getAdvancedQueryResult from '../Controller/AdvancedQueryController/advQueries.js'

const router = express.Router();

/*
  /advqueries/<avg_clauses/avg_attempts> are supported
  Returns: [{"QuestionId":<>,"avg_clauses":<>},{"QuestionId":<>,"avg_clauses":<>},...]
*/
router.get('/:type', (req, res) => {
    getAdvancedQueryResult(req, res);
  })

export default router;