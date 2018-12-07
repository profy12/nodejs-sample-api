const express = require('express');
const { markdown } = require('markdown');
const favicon = require('serve-favicon');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const redis = require('redis');

const app = express();

let rs = redis.createClient();

/*
* We connect on Redis server
*
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