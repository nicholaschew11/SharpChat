import { useState, useContext, useEffect } from 'react'
import { Grid , GridItem, Tabs} from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import SocketSetup from './SocketSetup';
import { createContext } from 'react';
import { AccountContext } from '../AccountContext';

export const FriendContext = createContext();
export const MessagesContext = createContext();

const Home = () => {
  const [friendList, setFriendList] = useState([]);
  const [friendIndex, setFriendIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const {user} = useContext(AccountContext);
  SocketSetup(setFriendList, setMessages);
  return (
    <FriendContext.Provider value={{friendList, setFriendList}}>
        <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs} variant="soft-rounded" onChange={(index) => setFriendIndex(index)}>
            <GridItem colSpan={2} borderRight="1px solid gray">
                <Sidebar />
            </GridItem>
            <GridItem colSpan={8} maxH="100vh">
                <MessagesContext.Provider value={{messages, setMessages}}>
                  <Chat userid={friendList[friendIndex]?.userid} />
                </MessagesContext.Provider>
            </GridItem>
        </Grid>
    </FriendContext.Provider>
  )
}

export default Home;