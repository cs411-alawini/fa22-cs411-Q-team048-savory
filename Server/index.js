const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
var connection = mysql.createConnection({
    host: '34.71.210.233',
    user: 'root',
    password: 'cs411',
    database: 'QueryViz'
});

const PORT = 3000;

connection.connect;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Attendance marked successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var netid = req.body.netid;
   
  var sql = `SELECT * FROM Submission LIMIT 5`;
  console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      console.log(err);
      return;
    }
    else{
      console.log(result);
    }
    res.redirect('/success');
  });
});

app.listen(PORT, function () {
    console.log('Node app is running on port 80');
});

