import { useState, useCallback, useContext } from 'react'
import { Modal, ModalHeader, ModalContent, ModalBody, ModalFooter, ModalCloseButton} from '@chakra-ui/modal';
import { ModalOverlay, Button, Input, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import TextField from '../../TextField';
import * as Yup from 'yup';
import socket from '../../Socket';
import { FriendContext } from './Home';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'

const AddFriend = ({isOpen, onOpen, onClose}) => {
    const [placement, setPlacement] = useState('left');
    const friendSchema = Yup.object({
        friendName: Yup.string().required("Username Required").min(5, "Invalid").max(30, "Invalid")
    })
    const { setFriendList } = useContext(FriendContext);
    const closeDrawer = useCallback(
      () => {
        setError("");
        onClose();
      },
      [onClose],
    )
    const [error, setError] = useState("");
  return (
    <Drawer placement={placement} onClose={closeDrawer} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>Add Friend</DrawerHeader>
        <Formik initialValues={{friendName: ""}} onSubmit={(values, actions) => {
            socket.emit("addFriend", values.friendName, ({error, friendAdded, newFriendData}) => {
                if (friendAdded) {
                    setFriendList(existingList => [newFriendData, ...existingList]);
                    closeDrawer();
                    return;
                } 
                setError(error);
            });
        }} validationSchema={friendSchema}>
            <Form>
                <DrawerBody>
                    <TextField label="Friend Name" placeholder="" autoComplete="off" name="friendName" />
                </DrawerBody>
                <DrawerFooter>
                    <Button colorScheme="blue" rightIcon={<ArrowForwardIcon />} variant="outline" type="submit" w="100%">
                        Submit
                    </Button>
                </DrawerFooter>
                <Heading pt={2} as="p" color="red" fontSize="small" textAlign="center">{error}</Heading>
            </Form>
        </Formik>
    </DrawerContent>
    </Drawer>
    
  )
}

export default AddFriend;