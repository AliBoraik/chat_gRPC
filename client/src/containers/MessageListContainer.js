import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import './MessageListContainer.css'


const MessageListContainer = () => {

    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [chat, setChat] = useState([]);

    const { ChatClient } = require('../protos/chat_grpc_web_pb');
    const { Message } = require('../protos/chat_pb.js');

    const client= new ChatClient('http://localhost:5050', null, null);
    
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
        <div className="chat-container">
            <div className="input-container">
                <span className="input-label">Nickname:</span>
                <input
                    className="input-field"
                    name="name"
                    onChange={onNameChange}
                    value={name}
                />
            </div>

            <div className="input-container">
                <span className="input-label">Message:</span>
                <input
                    className="input-field"
                    name="msg"
                    onChange={onMsgChange}
                    value={msg}
                />
                <button className="send-button" onClick={onMessageSubmit}>
                    Send
                </button>
            </div>
            <div className="message-list">
                {chat.map(({ name, msg }, idx) => (
                    <div key={idx} className="message-container">
                        <span className="nickname-label">{name}:</span>
                        <span>{msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageListContainer;
