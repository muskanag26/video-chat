const express=require("express")
const socket = require("socket.io")
const app=express()

var server=app.listen(3000, function(){
    console.log("Server is running")
})

app.use(express.static("public"))

var io=socket(server)

io.on("connection",function(socket){
    console.log("User connected : " + socket.id)

    socket.on("join",function(roomName){
        var rooms=io.sockets.adapter.rooms
        var room=rooms.get(roomName)
        if(room==undefined){
            socket.join(roomName)
            socket.emit("created")
        }
        else if(room.size==1){
            socket.join(roomName)
            socket.emit("joined")
        }
        else{
            socket.emit("full")
        }

        console.log(rooms)

    })

    socket.on("ready", function (roomName) {
    socket.broadcast.to(roomName).emit("ready")
    })

    socket.on("candidate", function (candidate, roomName) {
    socket.broadcast.to(roomName).emit("candidate", candidate)
    })

    socket.on("offer", function (offer, roomName) {
    socket.broadcast.to(roomName).emit("offer", offer) //Sends Offer to the other peer in the room.
    })

  //Triggered when server gets an answer from a peer in the room.

    socket.on("answer", function (answer, roomName) {
    socket.broadcast.to(roomName).emit("answer", answer) //Sends Answer to the other peer in the room.
    })


})