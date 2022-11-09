import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {getQuestionsQuery, getSuccessfulQuestionsQuery} from '../../constants.js'
import getAdvancedQueryResult from '../AdvancedQueryController/advQueries.js';


export const getQuestions = async (req, res) => {
    
  try{  
  const username = req.params.uname;
    //console.log("Username"+ username);
    const questionMetaData = await getAdvancedQueryResult(["avg_clauses", "avg_attempts"]);
    //console.log(JSON.stringify(questionMetaData));
    const successfulQns = await getSuccessfulQuestions(username);
    //console.log(successfulQns)
    const questionsData = await getQuestionDetails();
   // console.log(questionsData);
    let brand_new_qns_data = [];
    for(var qns of questionsData){
      //console.log(qns,checkQnStatus(successfulQns, qns["Id"]));
      let new_qn = {...qns};
      new_qn["Status"] = checkQnStatus(successfulQns, qns["ID"]);
      var qx = questionMetaData[qns["ID"].toString()]
      console.log(new_qn);
      let brand_new_qn = {...questionMetaData[qns["ID"].toString()], ...new_qn}
      brand_new_qns_data.push(brand_new_qn);
      //console.log("TEST"+JSON.stringify(qns));
    }
    res.statusCode = 200;
    res.send(brand_new_qns_data);
  } catch(e) {
    console.log(e);
    res.statusCode = 400;
    res.send(e);
  }
}

const getSuccessfulQuestions = async (username) => {
  const connection = await mysql.createConnection(sqlDBConfig);
  try {
    const [rows,fields] = await connection.execute(getSuccessfulQuestionsQuery(username));
    return rows;
  } catch(e) {
    console.log(e);
    return [];
  }

};

const getQuestionDetails = async () => {
  const connection = await mysql.createConnection(sqlDBConfig);
  try {
    const [rows,fields] = await connection.execute(getQuestionsQuery);
    return rows;
  } catch(e) {
    console.log(e);
    return [];
  }

}

const checkQnStatus = (successQn, qid) => {
  //console.log(JSON.stringify(successQn));
  for(var qns of successQn){
    //console.log(JSON.stringify(qns), qid, qns["QuestionID"] == qid)
    if(qns["QuestionID"] == qid)
      return true;
  }
  return false;
}


export default getQuestions;
