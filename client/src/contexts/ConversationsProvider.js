
import React, { useState, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';


const ConversationsContext = React.createContext();

export function useConversations(){
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }){
    const [conversations, setConversations] = useLocalStorage('conversations', []);
    //select first convo by default:
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

    const { contacts } = useContacts();

    function createConversation(recipients){
        setConversations(prevConversations => {
            return [...prevConversations, {recipients, messages: [] }];
        })
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

        const selected = index === selectedConversationIndex; 

        return { ...conversation, recipients, selected };
    })

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
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