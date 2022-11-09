import express from 'express';
import {insertSubmission} from '../Controller/SubmissionsController/Submissions.js'

const router = express.Router();

router.get('/insert', (req, res) => {
    insertSubmission(req, res);
  });

  export default router;