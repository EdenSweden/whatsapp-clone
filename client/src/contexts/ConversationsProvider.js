
import React, { useState, useContext, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';


const ConversationsContext = React.createContext();

export function useConversations(){
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }){
    const [conversations, setConversations] = useLocalStorage('conversations', []);
    //select first convo by default:
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

    const { contacts } = useContacts();
    const socket = useSocket();

    function createConversation(recipients){
        setConversations(prevConversations => {
            return [...prevConversations, {recipients, messages: [] }];
        })
    }
    //must be flexible enough to take messages from others and also take our own messages:
    //addMessageToConversation must be wrapped in useCallback because it changes every time it is called, and would otherwise cause needless reruns of the useEffect hook below in which it is called.
    const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prevConversations => {
            //determine if we already have a conversation that matches the recipient(s) in question
            let madeChange = false;
            const newMessage = { sender, text };
            const newConversations = prevConversations.map(conversation => {
                //args are conversation recipients and our own recipients
                if(arrayEquality(conversation.recipients, recipients)){
                    madeChange = true;
                    return { ...conversation, 
                        messages: [...conversation.messages, newMessage]
                    }
                }

                return conversation;
            })
            //don't be confused. This means if(madeChange === false). Aka if we didn't make any changes or if we didn't already have a matching conversation:
            if(madeChange) {
                return newConversations;
            } else {
                return [...prevConversations, 
                    { recipients, messages: [newMessage]}
                ];
            }
        })
    }, [setConversations]);

    useEffect(() => {
        if(socket == null) return;

        socket.on('receive-message', addMessageToConversation);

        //removes event listener for cleanup.
        return () => socket.off('receive-message');
    }, [socket, addMessageToConversation])

    function sendMessage(recipients, text){
        socket.emit('send-message', { recipients, text });

        addMessageToConversation({ recipients, text, sender: id })
    }

    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
                //recipient is just an id so this will work.
                return contact.id === recipient
            })
            const name = (contact && contact.name) || recipient;
            return { id: recipient, name };
        })

        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender
            })
            const name = (contact && contact.name) || message.sender;
            //id here is my own id:
            const fromMe = id === message.sender;

            return { ...message, senderName: name, fromMe }
        })

        const selected = index === selectedConversationIndex; 

        return { ...conversation, messages, recipients, selected };
    })

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        //mapping S.C.I. to a diff. name to make it easier to work with:
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

    return(
        <ConversationsContext.Provider value={value}>
            { children }
        </ConversationsContext.Provider>

    )
}

//this is done outside of component because it depends on nothing within the component.
function arrayEquality(a, b) {
    if(a.length !== b.length) return false;

    a.sort();
    b.sort();

    return a.every((element, index) => {
        //is every element of array 'a' equal to every element of array 'b' at the same index positions?
        return element === b[index];
    })

}