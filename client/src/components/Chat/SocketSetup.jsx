import { useContext, useEffect } from 'react'
import socket from '../../Socket';
import { AccountContext } from '../AccountContext';

const SocketSetup = (setFriendList, setMessages) => {
    const { setUser } = useContext(AccountContext);
    useEffect(() => {
      socket.connect();
      socket.on("friendList", friendList => {
        setFriendList(friendList);
      });
      socket.on("messages", (messages) => {
        setMessages(messages);
      });
      socket.on("sendMessage", message => {
        setMessages(previousMessages => [message, ...previousMessages]);
      });
      socket.on("connected", (status, username) => {
        setFriendList(prevFriends => {
          return [...prevFriends].map(friend => {
            if (friend.username === username) {
              friend.connected = status;
            }
            return friend;
          })
        })
      })
      socket.on("connect_error", () => {
        setUser({ loggedIn: false });
      });
      return () => {
        socket.off("connect_error");
        socket.off("connected");
        socket.off("friendList");
        socket.off("sendMessages");
        socket.off("messages");
      };
    }, [setMessages, setUser, setFriendList]);
}

export default SocketSetup;