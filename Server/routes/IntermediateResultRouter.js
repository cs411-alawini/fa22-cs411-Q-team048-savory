import express from 'express';
import { getintermediateresults } from '../Controller/IntermediateResultController/IntermediateResults.js';

const router = express.Router();
/*
Error response:

{
    "status": false,
    "result": "Unknown column 'c.Ti' in 'order clause'"
}
Valid response:
{
    "status": true
    "result": [
        {
            "type": "SELECT",
            "order": 5,
            "output": {
                "rows": [],
                "cols": [
                    "round(min(e.Score), 1)",
                    "Department",
                    "Title"
                ]
            }
        },
        {
            "type": "FROM",
            "order": 1,
            "output": {
                "rows": [
                    {
                        "CRN": 411,
                        "NetId": "0",
                        "Credits": 2,
                        "Score": 76,
                        "Title": "DatabaseSystems",
                        "Department": "CS",
                        "Instructor": "Abdu"
                    },...]
         }}]
         
}
*/
router.post('/', (req, res) => {
    console.log("Hits intr results");
    getintermediateresults(req, res);
  });

  export default router;