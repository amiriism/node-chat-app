const express=require('express');
const path=require('path');
const dotenv=require('dotenv').config();
const http=require('http');
const socketio=require('socket.io');
const {generatemessage,generatelocation}=require('../utils/message');
const {isrealstring}=require('../utils/validation')
const app=express();
const server=http.createServer(app)
const io=socketio(server)
const {Users}=require('../utils/user')
const publicPath=path.join(__dirname,'../public')
app.use(express.static(publicPath))
var users=new Users()
io.on('connection',(socket=>{
    



    socket.on('join', (params, callback)=>{
       
        if(!isrealstring(params.name) || !isrealstring(params.room)){
           return callback("name or room are required")
        }
        socket.join(params.room)
        users.removeuser(socket.id)
        users.adduser(socket.id,params.name,params.room)
        io.to(params.room).emit('updateuserlist',users.getuserlist(params.room))
        socket.emit('newmessage',generatemessage('admin','wellcome to the chat app'))

        socket.broadcast.to(params.room).emit('newmessage',generatemessage('admin',`${params.name} joined`))
        callback()
    })

    socket.on('createmessage',(message,callback)=>{
        var user=users.getuser(socket.id)
        if(user && isrealstring(message.message)){
            io.to(user.room).emit('newmessage',generatemessage(user.name,message.message))
        }

       
        callback()
    })

    socket.on('sendlocation',(cords)=>{
        var user=users.getuser(socket.id)
        if(user){
            io.to(user.room).emit('newlocation',generatelocation(user.name,cords.latitude, cords.longitude))
        }
       
    })


    
    

    socket.on('disconnect',()=>{
        console.log('user disconnected');
        var user=users.removeuser(socket.id)
       
        if(user){
            io.to(user.room).emit('updateuserlist',users.getuserlist(user.room))
            io.to(user.room).emit('newmessage',generatemessage('admin',`${user.name} has left`))
        }
    })


}))

server.listen(process.env.PORT,()=>{
    console.log('server runnig on port 3000');
})