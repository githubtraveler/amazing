## Prerequisites

* [node.js](https://nodejs.org/) 
* [mongodb](https://www.mongodb.org/)

## To install dependencies

    cd src
    npm install


## To run client page 
(Temporary requires grunt to run. Install via `npm install -g grunt-cli` )

    cd src
    grunt connect:dev:keepalive


## To run server 

Make sure proper config files are created inside `src/server/config` folder out of *.sample.js

### Start database server

    mongod --dbpath data/db


### Create database 
(Mongo should create all the collections automatically, but I haven't tested the auto mode yet)
    
    
### Start backend server    
    
    cd server
    node server.js
  



