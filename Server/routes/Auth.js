import express from 'express';
import {checkuser} from '../Controller/AuthController/Auth.js'

const router = express.Router();

router.post('/', (req, res) => {
    console.log("Hits auth");
    checkuser(req, res);
  });

  export default router;