import {Server} from "socket.io"
import cors from "cors";

let connections={}
let messages={}
let timeOnline={}
let users = {}
/*
io      → whole server (all users)
socket  → one specific user
Your device is behind a router using Network Address Translation.
You see a private IP like 192.168.x.x, which isn’t reachable from the internet.
*/

export default (server) => {
    const io = new Server(server, {
        cors:{
            origin: "*",
            methods: ["GET","POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });//👉 Initializes WebSocket server
    io.on("connection",(socket)=>{/*
        handle each incoming client connection and get its socket”
        👉 Runs every time a client connects
socket = this specific user’s connection
socket.id = unique ID for that user */    
console.log("SOMETHING CONNECTED");    
        socket.on(
    "join-call",
    ({ path, username })=>{//socket.on() listens for events sent by that specific client
            
            if(connections[path]==undefined){
                connections[path]=[]
            }

            connections[path].push(socket.id);
            timeOnline[socket.id]=new Date();
            users[socket.id] = username;

           /* ConnectionStates[path].forEach(elem=>{
                    io.to(elem)
                })*/

            // ❌ fixed i++ → a++
            for (let a=0 ;a<connections[path].length;a++){
io.to(
    connections[path][a]
).emit(
    "user-joined",
    socket.id,
    connections[path],
    users
)            }

            // ❌ fixed typos message → messages, massages → messages
            if(messages[path]!=undefined){
                for(let a=0;a<messages[path].length;++a){
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][a]['data'],
                        messages[path][a]['sender'],
                        messages[path][a]['socket-id-sender']
                    )
                }
            }

        })

        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id,message);
            /*The Socket.IO server-io...👉 Targets a specific socket (user) -toId = socket ID of receiver*/
        })

        socket.on("chat-message",(data ,sender)=>{

            const[matchingRoom,found]=Object.entries(connections)
            /*👉 converts object into array:
            [
              ["room1", ["A123", "B456"]],
              ["room2", ["C789"]]
            ] 
              array.reduce((accumulator, current) => {
                return updatedAccumulator;
            }, initialValue);*/
            .reduce(([room, isFound],[roomKey,roomValue])=>{
                
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey,true];
                }
                return [room,isFound];

            },['',false]);

            if(found==true){

                if(messages[matchingRoom]==undefined){
                    messages[matchingRoom]=[]
                }

                messages[matchingRoom].push({
                    'sender':sender,
                    'data':data,
                    'socket-id-sender':socket.id
                })

                // ❌ fixed KeyboardEvent
                console.log("message:",sender,data)

                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit("chat-message",data,sender,socket.id)
                })    
            }
        })

        socket.on("disconnect",()=>{

            let diffTime=Math.abs(timeOnline[socket.id]-new Date())
           
            let key 

            // ❌ removed unnecessary JSON parse/stringify
            for(const[k,v] of Object.entries(connections)){
                
                for(let a=0;a<v.length;++a){

                    if(v[a]==socket.id){

                        key=k

                        // ❌ fixed loop condition + emit syntax
                        for(let i=0;i<connections[key].length;++i){
                            io.to(connections[key][i]).emit('user-left',socket.id)
                        }

                        let index = connections[key].indexOf(socket.id)

                        // ❌ safe removal
                        if(index !== -1){
                            connections[key].splice(index,1)
                        }

                        if(connections[key].length==0){
                            delete connections[key]
                        }
                    }
                }
            }
        })

    })
    return io;

}