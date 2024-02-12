import React, { useEffect, useState } from 'react'
import { useChat } from '../../../../context/ChatContext'
import { onValue, ref } from 'firebase/database'
import { rdb } from '../../../../firebase'
import { useAuth } from '../../../../context/AuthContext'
import Message from './Message'

const Messages = () => {

    const [messages, setMessages] = useState([])
    const { data } = useChat()
    const { currentUser } = useAuth()


    useEffect(() => {
        const starCountRef = ref(rdb, `messages/${data.chatId}/`);
       const unSub = onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          let array = []
          for(let i in data) {
            array.push(data[i])
          }
          setMessages(array)
        });

        return () => {
          unSub();
        };
      }, [data.chatId]);

    useEffect(() => {
        const starCountRef = ref(rdb, `users/${currentUser.uid}/messages/${data.user}/sawTime`);
       const unSub = onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data)
        });

        return () => {
          unSub();
        };
      }, [data.user]);



  //mobile responsive hiding search friends and showing chat and reverse
  useEffect(() => {
    let friends = document.getElementById("friends")
    let chat = document.getElementById("messages")
    if(data.user && document.body.clientWidth < 1100) {

      friends.classList.add("hide-friends")
      chat.classList.add("show-chat")

    } 

    if(!data.user && document.body.clientWidth < 1100) {
      friends.classList.remove("hide-friends")
   
      chat.classList.remove("show-chat")
    }


  }, [data.user])
    



  return (
    <>
        {data.chatId && 
            <div id="chat-center" className='center-bar messages' >

            {messages.map((m) => (
              <Message key={m.id} {...m} />
            ))}

            </div>
        }
    </>
    
  )
}

export default Messages