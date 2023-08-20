const Chat = require('../models/chatSchema');
const Message = require('../models/messageSchema');

class ChatsModule {

    static find = async function(author, receiver) {
        
        const filter = {users: {$all: [author, receiver]}}
        
        try {
            const foundChat = await Chat.findOne(filter).exec();
            if (foundChat) {
                return foundChat;
            } else {
                return null;
            }; 
        } catch(e) {    
            console.log('Chat finding error: ', e.message);
            return (e);
        }
       
    }

    static sendMessage = async function(author, receiver, message) {
        console.log('Function sendMessage:', author, '/', receiver, '/', message); //*

        const newMessage = new Message ({
            author,
            sentAt: new Date(),
            text: message
        });           
        
        let messageId;
        
        try {
            const savedMessage = await newMessage.save();
            messageId = savedMessage.id;
                try {
                    const foundChat = await ChatsModule.find(author, receiver);
                    if (foundChat) {
                        await chatUpdate(foundChat.id, foundChat.messages, messageId); 
                        return {
                            message: savedMessage,
                            chatId: foundChat.id
                        };
                    } else {
                        const newChat = new Chat({
                            users: [author, receiver],
                            createdAt: new Date(), 
                            messages: [], 
                        });                         
                        try {
                            const savedChat = await newChat.save();
                            await chatUpdate(savedChat.id, [], messageId);
                            return {
                                message: savedMessage,
                                chatId: savedChat.id
                            };
                        } catch(e) {
                            console.log('Chat saving error', e.message);
                            return (e);
                        }
                    }   
                } catch (e) {
                    console.log('Chat finding error', e.message);
                    return (e);                                     
                }
        } catch(e) {
            console.log('Message saving error', e.message);
            return (e);
        }
        
        async function chatUpdate(chatId, messages, messageId) {
            messages.push(messageId);
            try {
                const update = {messages: messages};
                await Chat.findByIdAndUpdate(chatId, update, {new: true});
            } catch(e) {
                console.log('Adding message to chat error: ', e.message);
                return (e);
            }            
        }
    }

        
    static subscribe = async function(socket) {
        
        const userId = socket.request.user.id;
        
        try {
            const chatList = await Chat.find({users: userId});

            if (chatList) {
                chatList.forEach(chat => {
                    socket.join(chat.id);
                });
            }
        } catch(e) {
            console.log('Chat list error: ', e.message);
            return (e);
        }        
    }

    static getHistory = async function(chatId, chatMessages) {

        let chatHistory = [];

        for (const msgId of chatMessages) {
            try {
                const msg = await Message.findOne({_id: msgId}).exec();
                chatHistory.push(msg);
            } catch(e) {
                console.error('Error find chat messages: ', e.message);
                return (e);
            }
        }

        return chatHistory;
    }

}

module.exports = ChatsModule;