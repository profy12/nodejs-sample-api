# Sample domain API with Express JS and Redis

## Run and Debug

To avoid restart manually install the nodemon cli :

`sudo yarn global add nodemon`

Now run the app like that

`nodemon app.js`

If you want usefull debug message for your daemon you can launch like it

`DEBUG=express:* nodemon app.js`

## Usage

### Get documentation

`curl http://127.0.0.1:3000/doc`

### Get empty root

`curl http://127.0.0.1:3000`

### Get API documentation

`curl http://127.0.0.1:3000/api`
