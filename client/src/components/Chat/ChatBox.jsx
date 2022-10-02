import {useContext} from 'react'
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { Input, HStack, Button } from '@chakra-ui/react';
import socket from '../../Socket';
import { MessagesContext } from './Home';

const ChatBox = ( {userid} ) => {
    const {setMessages} = useContext(MessagesContext);
  return (
    <Formik initialValues={{message: ""}} validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
    })} onSubmit={(values, actions) => {
        const message = {to: userid, from: null, content: values.message};
        if (values.message === "") {
            return;
        }
        socket.emit('sendMessage', message);
        setMessages(previousMessages => [message, ...previousMessages]);
        actions.resetForm();
    }}>

        <HStack as={Form} w="95%" pb={10} >
            <Input as={Field} name="message" placeholder="Type..." size="lg" autoComplete="off" /> 
            <Button variant="outline" type="submit" size="lg" colorScheme="blue">Send</Button>
        </HStack>
    </Formik>
  )
}

export default ChatBox