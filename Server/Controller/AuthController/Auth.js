import mysql from 'mysql2/promise';
import { sqlDBConfig } from '../../config.js';
import {getuserauthQuery} from '../../constants.js'

export const checkuser = async (req, res) => {
    const uname = req.body["data"]["userName"];
    const pwd = req.body["data"]["password"]
    try{
      const result = await checkusercreds(uname);
      console.log(result);
      let status;
      if(result.length == 0)  { res.statusCode = 200; res.send(false); return;}
      console.log(result[0]["Password"], result[0]["Password"].length, pwd,pwd.length)
      status = (result[0]["Password"] == pwd);
      res.statusCode = 200;
      res.send(status);
    }
    catch(e){
      console.log(e);
      res.statusCode = 400;
      res.send(false);
    }
    
  }

const checkusercreds = async (uname) => {
    const connection = await mysql.createConnection(sqlDBConfig);
    try {
      console.log(getuserauthQuery(uname))
      const [rows, cols] = await connection.execute(getuserauthQuery(uname));
      return rows;
    } catch(e) {
      console.log(e);
      return [];
    }
  }
    