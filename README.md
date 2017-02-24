# DynaClub

This is a gamification project where employees reward each other. Wins the employee with more rewards (Dyna money) at the end of a period.

The app is used at [Dynamix Software](http://www.dynamix.com.br)

## Prerequisites

* NodeJS and NPM
* Redis
* MongoDB
* Angular-CLI

## Run Server

With Redis and MongoDB running, check connections configurations in `\server\server.js`

If it's the first time running, you must install the dependencies:
```bash
cd server
npm instal
```

To start the Server API:
```bash
cd server
npm start
```

If you want to start with clusters
```bash
cd server
node cluster.js
```

For more info about client build, please check server [README.MD](https://github.com/yuribett/DynaClub/blob/master/server/README.md)

## Run Client

If it's the first time running, you must install the dependencies:
```bash
cd client
npm instal
```

To start the Server API:
```bash
cd client
ng serve
```

For more info about client build, please check client [README.MD](https://github.com/yuribett/DynaClub/blob/master/client/README.md)