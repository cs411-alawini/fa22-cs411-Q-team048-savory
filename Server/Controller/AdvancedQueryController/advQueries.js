import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import { questionMetadataStoredProc } from '../../constants.js';
const getAdvancedQueryResult = async (queryTypes) => {
    
  const qMetaData = {};
  const connection = await mysql.createConnection(sqlDBConfig);
  const [result, fields] = await connection.execute(questionMetadataStoredProc);
  result[0].forEach(questionObj => {
    qMetaData[questionObj["QuestionId"]] = {}
    qMetaData[questionObj["QuestionId"]]["avg_clauses"] = questionObj["avg_clauses"]
    qMetaData[questionObj["QuestionId"]]["avg_attempts"] = questionObj["avg_attempts"]
  })
  console.log(qMetaData);

  return qMetaData;
}

export default getAdvancedQueryResult;
