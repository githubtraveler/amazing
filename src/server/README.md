Prerequisites: node.js, mongodb

To install dependencies

    cd src
    npm install


To run client page (Temporary requires grunt to run. Install via `npm install -g grunt-cli` )

    cd src
    grunt connect:dev:keepalive


To run server

Make sure proper config files are created inside `src/server/config` folder out of *.sample.js

    mongod --dbpath data/db
    cd server
    node server.js
  



