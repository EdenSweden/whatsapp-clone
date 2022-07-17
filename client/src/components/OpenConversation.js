import React, { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function OpenConversation() {

    const [text, setText] = useState('');
    const { sendMessage, selectedConversation } = useConversations();

    function handleSubmit(e){
        e.preventDefault();

        sendMessage(selectedConversation.recipients.map(r => r.id), text);

        setText('');
    }

  return (
    <div className="d-flex flex-column flex-grow-1">
        <div className='flex-grow-1 overflow-auto'>

        </div>
        <Form onSubmit={handleSubmit}>
            <Form.Group className='m-2'>
                <InputGroup>
                {/* 'as' attribute may be deprecated. Check. */}
                    <Form.Control as='textarea' 
                    required
                    value={text}
                    onChange={e => setText(e.target.value)}
                    style={{ height: '75px', resize: 'none' }}
                    />
                        <Button type='submit'>Send</Button>
                </InputGroup>
            </Form.Group>
        </Form>
    </div>
  )
}
