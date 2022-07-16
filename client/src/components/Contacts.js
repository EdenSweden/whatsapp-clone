//start from 43:00
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';

export default function Contacts() {
    const { contacts } = useContacts();

  return (
    <ListGroup variant='flush'>
        {contacts.map(contact => (
            <ListGroup.item></ListGroup.item>
        ))}
    </ListGroup>
  )
}
