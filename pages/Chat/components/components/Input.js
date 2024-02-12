import React, { useState } from 'react'
import { useChat } from '../../../../context/ChatContext'
import { useAuth } from '../../../../context/AuthContext'
import { push, ref, set } from 'firebase/database'
import { red } from '@mui/material/colors'
import { rdb } from '../../../../firebase'
import useFetchUsers from '../../../../utilis/getUsers'
import { Send } from '@mui/icons-material'

const Input = () => {

  const { data } = useChat()
  const { currentUser } = useAuth()

 const [message, setMessage] = useState("")
 const [users, setUsers] = useState()
 const [allUsers, setAllUsers] = useState()

 useFetchUsers(setUsers, setAllUsers)

 //handler for sending messages
 const handleSendMessage = async() => {

    try {
        if(message.length > 0) {
          sendMessage(currentUser.uid, data.user, message, new Date().valueOf())
          setMessage("")
        }
    }catch(error) {
        console.log(error)
    }


}

 
  //Send message to Realtime database
  const sendMessage = (fromId, toId, message, date) => {

    //const autoId = rdb.ref('messages/' + fromId + toId).push().key
    const autoId = push(ref(rdb, "message")).key
 
     set(ref(rdb, 'messages/' + fromId + toId + "/" + autoId), {
       fromId: fromId,
       toId: toId,
       message: message,
       date: date, 
       id: autoId
     });
     
     set(ref(rdb, 'messages/' + toId + fromId + "/" + autoId), {
       fromId: fromId,
       toId: toId,
       message: message,
       date: date, 
       id: autoId
     });
 
 
     set(ref(rdb, 'users/' + currentUser.uid + "/messages/" + toId), {
       message: message,
       timestamp: new Date().valueOf(),
       fromId: currentUser.uid,
       toId: toId, 
       id: toId, 
       saw: true,
       username: allUsers.filter(user => {return user.id === data.user}).map(user => { return user.username}),
     });
 
     set(ref(rdb, 'users/' + toId + "/messages/" + currentUser.uid), {
       message: message,
       timestamp: new Date().valueOf(),
       fromId: currentUser.uid,
       toId: toId, 
       id: currentUser.uid, 
       saw: false,
       username: allUsers.filter(user => {return user.id === data.user}).map(user => { return user.username}),
     });
 
   }
 
    //sending messages by enter
  const keyDownHandler = (e) => {
    if(e.keyCode === 13) {
        handleSendMessage()
    }
  }


  return (
    <>
     <div className='bottom-bar send-message' >
       <div className='send-message' >
                <input onKeyUp={keyDownHandler} value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Message...' />
                <Send  onClick={handleSendMessage}  className='send-icon' />
       </div>
    </div>
    </>
  )
}

export default Input