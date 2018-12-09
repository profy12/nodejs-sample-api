const express = require('express');
const { markdown } = require('markdown');
const favicon = require('serve-favicon');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();

/*
* We connect on Heroku Redis server
*
* If none we try to connect localy (dev env)
*
*/


let rs = null;
if (process.env.REDISTOGO_URL) {
    console.log('Detected env var:' + process.env.REDISTOGO_URL);
    let rtg  = require("url").parse(process.env.REDISTOGO_URL);
    rs = redis.createClient(rtg.port, rtg.hostname);
    rs.auth(rtg.auth.split(":")[1]);
} else {
    rs = redis.createClient();
}

//let rs = redis.createClient();

/*
* Evenemential is so beautiful, that if redis server is lost it will reconnect, calling theses two parts of code.
*/
rs.on('connect', ()=>{
    console.log('Connected on Redis');
})
.on('error',(err)=>{
    console.log(`Unable to connect redis: ${err}`);
});

/*
* First we need logs, we commented the basic one and activate the logrotated file
*
* let accessLogStream = fs.createWriteStream(path.join(__dirname,'logs/access.log'), { flags: 'a'});
*
*/
let accessLogStream = rfs(path.join(__dirname,'log/access.log'), {
    size: '10M',
    interval: '1d',
    compress: 'gzip'
});
app.use(morgan('combined', {stream: accessLogStream }));

/*
* Basic favicon service
*/
app.use(favicon('./public/favicons.png'));

/*
* body parser
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/*
* Defaut root with nothink, maybe some tests
*/
app.get('/', (req,res)=>{
    // On default page I don't want to speak about myself I override the express one
    res.set('X-Powered-By','Custom agent');
    res.send('Nothink here!');
})

/*
*  Documentation is always a good point, never forget it !
*/
.get('/doc', (req,res)=>{
    let content = fs.readFileSync('README.md','utf8');
    res.send(markdown.toHTML(content));
})

/*
*  Here start our API system
*/
.get('/api', (req,res)=>{
    let apiContent = fs.readFileSync('API.md','utf-8');
    res.send(markdown.toHTML(apiContent));
})
.get('/api/domain', (req,res)=>{
    let list = rs.smembers('domain.list',(err,reply)=>{
        console.log(reply);
        res.status(200).send(reply);
    });
})
.post('/api/domain', (req,res)=>{
    console.log(req.body.name);
    let domain = req.body.name;
    rs.sadd('domain.list',domain,(err,reply)=>{
        console.log('reply: ' + reply)
        res.status(201).send({message: 'ok'});
    });
})
.delete('/api/domain/:domain', (req,res)=>{
    console.log('delete ' + req.params.domain);
    rs.srem('domain.list',req.params.domain,(err,reply)=>{
        res.status(200).send({message: 'ok deleted'});
    });
});

/* 
* Here we bind the local port
*
* We configure port with the Heroku style
*
*/

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port, ()=>{
    console.log('App listening on port 3000');
});