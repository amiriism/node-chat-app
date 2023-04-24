const socket=io();


function scrollfunction(){
    var messages=jQuery('#messages')
    var newmessage=messages.children('li:last-child')

    var clientheight=messages.prop('clientHeight')
    var scrolltop=messages.prop('scrollTop')
    var scrollHeight=messages.prop('scrollHeight')

    var newmessageheight=newmessage.innerHeight();
    var lsatmessaageheight=newmessage.prev().innerHeight();

    if(clientheight+scrolltop+newmessageheight+lsatmessaageheight>=scrollHeight){
        messages.scrollTop(scrollHeight)
    }
}

socket.on('connect',()=>{
    var params=jQuery.deparam(window.location.search)

    socket.emit('join',params,function(err){
        if(err){
            alert(err)
            window.location.href='/'
        }
        else{
            console.log('no error');
        }
    })
})




socket.on('newmessage',(message)=>{
    
    const saytime=moment(message.createat).format('hh:mm a')
    var template=jQuery('#message-template').html()
    var html=Mustache.render(template,{
        text:message.message,
        from:message.from,
        createdat:saytime
    })


    jQuery('#messages').append(html)
    scrollfunction()
})




socket.on('updateuserlist',function(users){
    var ol=jQuery('<ol></ol>')
    users.forEach(function  (user){
        ol.append(jQuery('<li></li>').text(user))
    })
    jQuery('#users').html(ol)
}) 


jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    socket.emit('createmessage',{
        from:'user',
        message:jQuery('[name=message]').val()
    },()=>{
        jQuery('[name=message]').val('')
    })
})



var locationbutton=jQuery('#send-location')
locationbutton.on('click',()=>{
    locationbutton.attr('disabled','disabled').text('sending location...')
    if(!navigator.geolocation){
        return alert('geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        locationbutton.removeAttr('disabled').text('send loction')
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        })
       
    },()=>{
        alert('unbale to fetch location')
        locationbutton.removeAttr('disabled').text('send loction')
    })
})

socket.on('newlocation',(message)=>{
    const saytime=moment(message.createat).format('hh:mm a')
    var template=jQuery('#location-message-template').html()
    var html=Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdat:saytime
    })
   
    jQuery('#messages').append(html)
    scrollfunction()


})



