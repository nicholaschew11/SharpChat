import { useContext, useRef, useEffect } from 'react'
import { VStack, TabPanels, TabPanel, Tabs, Text } from '@chakra-ui/react'
import { FriendContext, MessagesContext } from './Home'
import ChatBox from './ChatBox'

const Chat = ( { userid } ) => {
  const {friendList, setFriendList} = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const bottom = useRef(null);
  useEffect(() => {
    bottom.current?.scrollIntoView();
  });
  
  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
        <TabPanels overflowY="scroll">
            {friendList.map(friend => (
              <VStack w="100%" flexDir="column-reverse" as={TabPanel} key={`chat:${friend.username}`}>
                <div ref={bottom} />
                  {messages
                    .filter(msg => msg.to === friend.userid || msg.from === friend.userid)
                    .map((message, index) => (
                    <Text key={`msg:${friend.username}.${index}`} 
                      fontSize="lg"
                      bg={message.to === friend.userid ? "blue.200" : "green.200"}
                      color="black"
                      borderRadius={10}
                      m={message.to === friend.userid ? "1rem 0 0 auto !important" : "1rem auto 0 0 !important"}
                      maxW="40%"
                      p="0.5rem 1rem"
                    >
                      {message.content}
                    </Text>
                  ))}; 
              </VStack>
            ))}
        </TabPanels>
        <ChatBox userid={userid} />
    </VStack>
  ) : (
    <></>
  )
}

export default Chat