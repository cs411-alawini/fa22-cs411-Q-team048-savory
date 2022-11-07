import mysql from 'mysql2';
import { sqlDBConfig } from '../../config.js';
import {advQueriesDic} from '../../constants.js';



const getAdvancedQueryResult = (req, res) => {
    
    var connection = mysql.createConnection(sqlDBConfig);
  
    const queryType = req.params.type;
    if(queryType in advQueriesDic){
      connection.connect;
      connection.query(advQueriesDic[queryType], (err, result) => {
        if(err) 
          res.send(err);
        else
          res.send(result);
      });
    }
    else{
      res.statusCode = 400;
      res.send("Invalid Advanced Query Type");
    }
}

export default getAdvancedQueryResult;
