import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {getMaxSubmissionId, insertSubmissionQuery} from '../../constants.js'

 
export const insertSubmission = async (req, res) => {
    const query = req.body["Query"];
    const qid = req.body["Qid"];
    const uid = req.body["Uid"];
    const connection = await mysql.createConnection(sqlDBConfig);
    try {
        
      let [maxId,cols] = await connection.execute(getMaxSubmissionId());
      maxId = maxId[0]['MID'];
      
      const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
      await connection.execute(insertSubmissionQuery(maxId+1,query, qid, uid, ts));
      
      res.statusCode = 200;
      res.send("Inserted Submission");
    } catch(e) {
        res.statusCode = 400;
        res.send(e);
    }
};
  