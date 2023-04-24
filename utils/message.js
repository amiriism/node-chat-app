const momet=require('moment')
var generatemessage=(from,message)=>{
    return{
        from,
        message,
        createat:momet().valueOf()
    }
}

var generatelocation=(from,latitude,longitude)=>{
    
    return{
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createat:momet().valueOf()
    }
}
module.exports={generatemessage,generatelocation}