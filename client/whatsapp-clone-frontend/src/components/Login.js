import React, { useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { v4 as uuidV4 } from 'uuid';

export default function Login({ onIdSubmit }) {

    const idRef = useRef();

    function handleSubmit(e) {
        e.preventDefault();
        
        onIdSubmit(idRef.current.value);
    }

    function createNewId(){
        onIdSubmit(uuidV4());
    }

  return (
    <Container className='align-items-center d-flex' style={{ height: '100vh' }}>
        <Form onSubmit={handleSubmit} className='w-100'>
            <Form.Group>
                <Form.Label>Enter Your ID</Form.Label>
                <Form.Control type='text' ref={idRef} required />
            </Form.Group>
            <Button type='submit' className='me-2 mt-1'>Login</Button>
            <Button onClick={createNewId}variant='secondary' className='mt-1'>Create a New ID</Button>
        </Form>
    </Container>
  )
}
