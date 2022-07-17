import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';

export default function Conversations() {

  const { conversations, selectConversationIndex } = useConversations();

  return (
    <ListGroup variant='flush'>
      {conversations.map((conversation, index) => (
        //the index won't change here, so it's ok to use it as a key although not normally recommended.
        <ListGroup.Item 
        key={index}
        action
        onClick={() => selectConversationIndex(index)}
        active={conversation.selected}
        >
          {conversation.recipients.map(r => r.name).join(', ')
          }
        </ListGroup.Item>
        ))}
    </ListGroup>
  )
}
