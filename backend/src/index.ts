import express from 'express';
import { WebSocketServer } from 'ws';
import useroute from "./routes/user.js"
const app  = express();



app.use(express.urlencoded({ extended :true}));
app.use(express.json())
app.use("/api",useroute)

const httpserver = app.listen(5000,()=>{
    console.log(`you are port runing on 5000`)
})

const wss =  new WebSocketServer({server:httpserver});

wss.on("connection", function connection(ws){
    ws.send("hello world")
})

