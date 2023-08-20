const chatsModule = require('../modules/chatsModule');

module.exports = (io) => {
    
    const getHistory = async function(msg) {
    const socket = this;

    const authorId = socket.request.user._id || null;
    const receiverId = msg.receiver? msg.receiver.trim() : null;

    if (authorId && receiverId) {
        try {
            const foundChat = await chatsModule.find(authorId, receiverId);
            if (foundChat) {
                try {
                    const messages = await chatsModule.getHistory(foundChat.id, foundChat.messages);                        
                    if (messages) {
                        const strg = JSON.stringify(messages);
                        socket.emit('chatHistory', {
                            text: strg
                        });
                    }
                } catch(e) {
                    console.log('Error calling getHistory: ', e.message);
                }
            } else {
                const strg = JSON.stringify({
                    error: `Chat doesn't exist`
                });
                socket.emit('chatHistory', {
                    text: strg
                });
            }
        } catch(e) {
            console.log('Error calling find Chat: ', e.message);
        }
    }
}

const sendMessage = async function(msg) {
    const socket = this;
            
    const authorId = socket.request.user._id || null;
    const receiverId = msg.receiver ? msg.receiver.trim() : null;
    const message = msg.text ? msg.text.trim() : null;
    let roomId;
    let newMessage;

    if (authorId && receiverId && message) {
        try {
            const data = await chatsModule.sendMessage(authorId, receiverId, message);
            newMessage = data.message;
            roomId = data.chatId;
            console.log('Message to be sent: ');
            console.log(newMessage);   
            console.log(roomId);   
        } catch(e) {
            newMessage = {
                error: e.message,
                status: "error"
            }    
        }

        if (roomId && newMessage) {
            const sockets = await io.fetchSockets();
            const loggedSockets = sockets.filter(socket => (socket.request.user));
            const targetSocket = loggedSockets.find(socket => (socket.request.user._id == receiverId));
            
            if (targetSocket) {
                targetSocket.join(roomId);
            }   

            const strg = JSON.stringify(newMessage);
            socket.join(roomId);
            socket.to(roomId).emit('newMessage', {text: strg});
            socket.emit('newMessage', {text: strg});     
        }    
                
    }        
}

    return {
        getHistory,
        sendMessage
    }
}