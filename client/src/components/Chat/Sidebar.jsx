import { useContext } from 'react'
import { VStack, HStack, Heading, Button, Divider, TabList, Tabs, Tab, Text, Circle, useDisclosure } from '@chakra-ui/react'
import { ChatIcon } from '@chakra-ui/icons'
import { BeatLoader } from 'react-spinners';
import { FriendContext } from './Home'
import AddFriend from './AddFriend';
import { LayoutGroupContext } from 'framer-motion';
import { useNavigate } from 'react-router';
import LogoutButton from './LogoutButton';
import { AccountContext } from '../AccountContext';

const Sidebar = () => {
  const {friendList, setFriendList} = useContext(FriendContext);
  const { user } = useContext(AccountContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
        <VStack py="1rem">
                <VStack as={TabList}>
                    {friendList.map((friend) => (
                        <>
                            <HStack as={Tab} key={`friend:${friend}`} w="100%">
                                <Text> {friend.username}</Text>
                                <Circle bg={"" + friend.connected === "true" ? "green" : "red"} w="10px" h="10px"/>
                            </HStack>
                            <Divider />
                        </>
                    ))}
                </VStack>
            <VStack position="fixed" bottom={10} w="15%">
                <Divider m={5}/>
                <Text pb={5}><b>Username: {user.username}</b></Text>
                <Button onClick={onOpen} w="100%">Add Friend &nbsp;<ChatIcon /></Button>
                <LogoutButton />
            </VStack>
            
        </VStack>
        <AddFriend isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
    </>
  )
}

export default Sidebar;