
//start at 53:20
import React, { useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';


const ConversationsContext = React.createContext();

export function useConversations(){
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }){
    const [conversations, setConversations] = useLocalStorage('conversations', []);

    function createConversation(recipients){
        setConversations(prevConversations => {
            return [...prevConversations, {recipients, messages: [] }];
        })
    }

    const formattedConversations = conversations.map(conversation => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
                return contact.id === recipient
            })
        })
    })

    return(
        <ConversationsContext.Provider value={{ conversations, createConversation }}>
            { children }
        </ConversationsContext.Provider>

    )
}