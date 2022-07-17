const io = require('socket.io')(5000);

io.on('connection', socket => {
    //allows us to keep the same id consistently. Otherwise by default, socket creates a new id every time you use it.
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on('send-message', ({ recipients, text }) => {
        recipients.forEach(recipient => {
            //removes current recipient so that it can switch recipients. When you send a message, the other person is the recipient. When they send a message back, they should not be the recipient anymore, so they must be removed from the recipients list. And back and forth.
            const newRecipients = recipients.filter(r => r!== recipient);
            //pushes the id of the person sending the message:
            newRecipients.push(id);
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            })
        })
    })    
})