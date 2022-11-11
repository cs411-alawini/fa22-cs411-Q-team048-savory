import express from 'express';
import {insertSubmission} from '../Controller/SubmissionsController/Submissions.js'

const router = express.Router();

router.post('/insert', (req, res) => {
    insertSubmission(req, res);
  });

  export default router;