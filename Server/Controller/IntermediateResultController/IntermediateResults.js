import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {spawnSync} from 'child_process'

export const getintermediateresults = async (req, res) => {
    
    const query = req.body["data"]["query"];
    try{
      const result = await runquerygetunpaginatedresponse(query);
     // console.log("Result"+JSON.stringify(result))
      res.statusCode = 200;
      res.send(result);
    }
    catch(e){
      console.log(e);
      res.statusCode = 400;
      res.send({"status":false, "result": e});
    }
    
  }

const runquerygetunpaginatedresponse = async(query) => {
    
    var qStatus = await checkquerycorrectness(query);
    if(qStatus.status){
        console.log(qStatus.result);
        console.log("Run script");  

        // Synchronous
        const pythonProcess =  spawnSync('python3',["util/parser.py", query], { encoding : 'utf8' });
        console.log(pythonProcess.error)
        if(pythonProcess.error){
          console.log(+pythonProcess.stdout)
          return {"status":false, "result":"Script failed"};
        }
        if(pythonProcess.stderr){
          console.log(pythonProcess.stderr)
          return {"status":false, "result":"Script failed"};
        }
        const res = await getintermediatedata(pythonProcess.stdout.toString())
        return res;   

    }
  return qStatus;  
}

const getintermediatedata = async(script_output) => {
  const connection = await mysql.createConnection(sqlDBConfig);
  var resArr = [];
  console.log(script_output+"replacing with double quotes for JSON parsing");
 // script_output = script_output.replace(/'/g, `"`);
  console.log(script_output)
  const script_obj = JSON.parse(script_output)

  for(var x = 0; x < script_obj.clauses.length; x++){
    var clause = script_obj.clauses[x];
    var intr_res = {}
    console.log(clause.iq);
    try{
      var [result,fields] = await connection.execute(clause.iq);
    } catch(e){
      console.log("Intr query error query:",clause.iq, e);
      return {"result": e, "status": false};
    }
    const arr = fields.map((fld) => fld.name);
    console.log("Got result", result.length, arr);
    intr_res["type"] = clause["type"]
    intr_res["order"] = clause["executionOrder"]
    intr_res["output"] = {}

    intr_res["output"]["rows"] = result;
    intr_res["output"]["cols"] = arr;
    console.log("intr res", intr_res);
    resArr.push(intr_res);
  }

  return {"result": resArr, "status":true};

}    

const checkquerycorrectness = async(query) => {
    const connection = await mysql.createConnection(sqlDBConfig);
    try {
      console.log("Executing"+query)
      const [rows, cols] = await connection.execute(query);
      //console.log("Actual query result"+ rows);
      return {"status":true, "result":rows};
    } catch(e) {
      return {"status":false, "result": e.message};
    }    
}


    