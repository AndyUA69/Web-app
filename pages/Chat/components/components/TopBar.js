import { ArrowBack, MoreVert } from '@mui/icons-material';
import { onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { rdb } from '../../../../firebase';
import { useChat } from '../../../../context/ChatContext';
import { useAuth } from '../../../../context/AuthContext';

const TopBar = (props) => {

  const { data, dispatch } = useChat()
  const { currentUser } = useAuth()

  const [deleteSection, setDeleteSection] = useState(false)


 //delete chat
 const handleDeleteChat = () => {
    remove(ref(rdb, "messages/" + currentUser.uid + data.user))

    dispatch({ type: "CLOSE_USER" })

    remove(ref(rdb, "users/"+currentUser.uid+"/messages/"+data.user))
  }

  const [dataActiveFriend, setDataActiveFriend] = useState()


 
  useEffect(() => {

      const starCountRef = ref(rdb, `users/` + data.user);
      const unChng = onValue(starCountRef, (snapshot) => {
        const d = snapshot.val();
        setDataActiveFriend(d);
     });
    
     return () => {
        unChng();
      };

  }, [data.user, setDataActiveFriend])

  return (
    <>
        {dataActiveFriend &&
        <div className='top-bar'>
            <div className='wrapper' >
            <ArrowBack className='chat-left' onClick={() => {
                setDataActiveFriend();
                let friends = document.getElementById("friends")
                let chat = document.getElementById("messages")
                friends.classList.remove("hide-friends")
                dispatch({ type: "CLOSE_USER" })
                chat.classList.remove("show-chat")
            }} />
            <img alt='profile' src={dataActiveFriend.profilePic} />
            <h3>{dataActiveFriend.block ? "Blocked Account" : dataActiveFriend.username}</h3>
            </div>
        
            {deleteSection &&
            <div onClick={handleDeleteChat} className='delete-section' >
            <a>Delete</a>
            </div> }
            <div>
            <MoreVert className='more-top' onClick={() => setDeleteSection(!deleteSection)} />
            </div>
        </div>
        }
    </>
  )
}

export default TopBar