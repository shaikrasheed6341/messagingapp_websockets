import express from 'express';
import { WebSocketServer } from 'ws';
const app  = express();

const httpserver = app.listen(5000,()=>{
    console.log(`you are port runing on 5000`)
})

const wss =  new WebSocketServer({server:httpserver});

wss.on("connection", function connection(ws){
    ws.send("hello world")
})

