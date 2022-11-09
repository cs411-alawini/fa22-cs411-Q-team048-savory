import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {advQueriesDic} from '../../constants.js';



const getAdvancedQueryResult = async (queryTypes) => {
    
    const questionMetaData = {};
    for(const queryType of queryTypes)
    {
      if(queryType in advQueriesDic){
        
        const connection = await mysql.createConnection(sqlDBConfig);
        try {
          const [result,fields] = await connection.execute(advQueriesDic[queryType]);
          result.forEach(questionObj => {
            if (!(questionObj['QuestionID'] in questionMetaData))
              questionMetaData[questionObj['QuestionID']] = {}
            questionMetaData[questionObj['QuestionID']][queryType] = questionObj[queryType];
          })
        } catch(e) {
          console.log(e);
          return {};
        }
        
      }
       else{
         console.log("Invalid Advanced Query Type");
         return {};
       }
         
    };
    return questionMetaData;
  }

export default getAdvancedQueryResult;
