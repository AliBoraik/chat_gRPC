import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';

const MessageListContainer = () => {

    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [chat, setChat] = useState([]);

    const { ChatClient } = require('../protos/chat_grpc_web_pb');
    const { Message } = require('../protos/chat_pb.js');

    const client= new ChatClient('https://localhost:7144', null, null);
    
    useEffect(() => {
        let streamRequest = new Message();
        const id = Math.random().toString(16).slice(-4)
        streamRequest.setUser(id);
        var stream = client.join(
            streamRequest
        );  

        stream.on('data', function(response) {
            console.log("data "+response);
            setChat(c=>[...c, { name : response.array[0], msg : response.array[1] }]);
        });

        return () => {
        };
        
    },[]);
    
    const onNameChange = e => {
        setName(e.target.value);
    }

    const onMsgChange = e => {
        setMsg(e.target.value);
    }

    const onMessageSubmit = () => {
        setMsg("");
        const request = new Message();
        request.setText(msg);
        request.setUser(name);
        client.send(request, {}, (err, response) => {
            if (response == null) {
              console.error(err)
            }else {
              console.log("response : "+response)
            }
        });
    }

    return (
        <div>
            <MessageList chat={chat} />
            
            <span>Nickname : </span>
            <input
                name="name"
                onChange={onNameChange}
                value={name}
            />
            <br />
            <span>Message : </span>
            <input
                name="msg"
                onChange={onMsgChange}
                value={msg}
            />
            <button onClick={onMessageSubmit}>Send</button>

        </div>
    );
};

export default MessageListContainer;
