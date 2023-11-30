#!/usr/bin/env babel
import authentication, {authorize} from 'shyntech-api-authentications';
import module from '../src/index';
import morgan from 'morgan';
import cors from 'cors';
import zeromq from 'zeromq';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
let config = require('dotenv').config();
let app = require('express')()
let onenote = require('shyntech-api-onenotes');
const DATABASE_URL = process.env.MONGO_ADDRESS||"mongodb://localhost:27017";
const HOST_PORT = process.env.HOST_PORT;
const WESOCKET_PUB_PIPE="tcp://*:4242";
const WESOCKET_SUB_PIPE="tcp://*:4243";
let subSocket = zeromq.socket("sub");
let pubSocket = zeromq.socket("pub");





async function init(){
    //const auth=null;
    //const mongodb=null;
    app.use(cors())
    app.use(morgan('dev'))
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    const auth=await authorize()
    const mongodb = (await getDBHandler(DATABASE_URL)).db('base');
    app.use(await module(auth, mongodb, subSocket, pubSocket))
    app.listen(HOST_PORT, function () {
        //initSubSocket(subSocket);
        //initPubSocket(pubSocket);
        console.log(`JSON Server is running on ${HOST_PORT}`)
    })
}



async function getDBHandler(uri){
    let mongodb = null;
    try {
       mongodb = new MongoClient(uri);
       console.log('Connecting to MongoDB Atlas cluster...');
       await mongodb.connect();
       console.log('Successfully connected to MongoDB Atlas!');

       return mongodb;
   } catch (error) {
       console.error('Connection to MongoDB Atlas failed!', error);
       process.exit();
   }
}



init();