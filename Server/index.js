import express from 'express';
import bodyParser from 'body-parser';

import path from 'path';
import {fileURLToPath} from 'url';
import { serverConfig } from './config.js';
import advQueryRouter from './routes/AdvancedQueryRouter.js'
import questionsRouter from './routes/Questions.js'
import submissionsRouter from './routes/Submissions.js'
import authRouter from './routes/Auth.js'
import intermediateResultRouter from './routes/IntermediateResultRouter.js'

var app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

app.use("/advqueries", advQueryRouter)
app.use("/questions", questionsRouter)
app.use("/submissions", submissionsRouter)
app.use("/auth", authRouter)
app.use("/intermediate", intermediateResultRouter)


app.listen(serverConfig.PORT, () => {
    console.log('Node app is running on port ' + serverConfig.PORT);
});

