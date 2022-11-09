import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {getQuestionsQuery, getSuccessfulQuestionsQuery, deleteQuestionsQuery, updateQuestionsQuery, searchQuestionQuery} from '../../constants.js'
import getAdvancedQueryResult from '../AdvancedQueryController/advQueries.js';


export const searchQuestion = async (req, res) => {
  const searchKey = req.body["search_key"];
  try{
    const QnIds = await searchquestion(searchKey);
    res.statusCode = 200;
    res.send(QnIds);
  }
  catch(e){
    console.log(e);
    res.statusCode = 400;
    res.send(e);
  }
  
}


export const deleteQuestion = async (req, res) => {
  const qid = req.params.qid;
  try{
    await deletequestion(qid);
    getQuestions(req, res);
  }
  catch(e){
    console.log(e);
    res.statusCode = 400;
    res.send(e);
  }
  
}

export const updateQuestion = async (req, res) => {
  const qid = req.params.qid;
  const newDescription = req.body["new_description"]
  try{
    await updatequestion(qid,newDescription);
    getQuestions(req, res);
  }
  catch(e){
    console.log(e);
    res.statusCode = 400;
    res.send(e);
  }
  
}


export const getQuestions = async (req, res) => {
    
  try{  
    const username = req.params.uname;
    const questionMetaData = await getAdvancedQueryResult(["avg_clauses", "avg_attempts"]);
    const successfulQns = await getSuccessfulQuestions(username);
    const questionsData = await getQuestionDetails();
    let brand_new_qns_data = [];
    for(var qns of questionsData){
      let new_qn = {...qns};
      new_qn["Status"] = checkQnStatus(successfulQns, qns["ID"]);
      var qx = questionMetaData[qns["ID"].toString()]
      console.log(new_qn);
      let brand_new_qn = {...questionMetaData[qns["ID"].toString()], ...new_qn}
      brand_new_qns_data.push(brand_new_qn);
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

const deletequestion = async (id) => {
  const connection = await mysql.createConnection(sqlDBConfig);
  try {
    await connection.execute(deleteQuestionsQuery(id));
    return true;
  } catch(e) {
    console.log(e);
    return false;
  }
}

const updatequestion = async (id, new_description) => {
  const connection = await mysql.createConnection(sqlDBConfig);
  try {
    console.log(updateQuestionsQuery(id, new_description))
    await connection.execute(updateQuestionsQuery(id, new_description));
    return true;
  } catch(e) {
    console.log(e);
    return false;
  }
}

const searchquestion = async (searchKey) => {
  const connection = await mysql.createConnection(sqlDBConfig);
  try {
    console.log(searchQuestionQuery(searchKey))
    const [rows, cols] = await connection.execute(searchQuestionQuery(searchKey));
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
