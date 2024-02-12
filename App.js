import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import "./App.css"
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { AdminPanelSettings, ArrowBack, Logout } from '@mui/icons-material'
import { rdb } from './firebase'
import { onValue, ref,  update } from 'firebase/database'
import { useAuth } from './context/AuthContext'
import MenuIcon from '@mui/icons-material/Menu';

import { motion } from "framer-motion"

const App = ({children}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(true)
  let location = useLocation();
  let path = location.pathname
  const [clickedVerify, setClickVerify] = useState(false)
  const { currentUser, logout, sendEmailVerify} = useAuth()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [seconds, setSeconds] = useState(60);
  const [shutDownInfo, setShutDownInfo] = useState()

  const getShutDown  = () => {
    const starCountRef = ref(rdb, `shutdown/`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setShutDownInfo(data);
    });
  }

  const handleLogout = async() => {
    try {
      await logout()
    } catch(err) {
      console.log(err)
    }
  }

  const getUser = () => {
    const starCountRef = ref(rdb, `users/${currentUser.uid}`);
      onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
      if(!data.admin) {
        getShutDown()
      }
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      document.title = "web app"
    }, 1000)
  
    getUser()

    update(ref(rdb, 'users/' + currentUser.uid), {
      verify: currentUser.emailVerified
    }); 
  }, [])

  const handleSendVerify = async() => {
    setLoadingBtn(true)
    try{
      await sendEmailVerify(currentUser.uid)
      setLoadingBtn(false)
      setClickVerify(true)
    }catch(err) {
      console.log(err)
      setLoadingBtn(false)
    }
  }

  useEffect(() => {
    if(clickedVerify) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            clearInterval(interval);
            setClickVerify(false)
            setSeconds(60)
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [clickedVerify])

 
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if(currentUser && user) {
      if(new Date().valueOf() > user.banTime) {
        update(ref(rdb, 'users/' + currentUser.uid), {
          ban: false, 
          banTime: null
        }); 
      }
    }
  }, [user])


  return (
    <>
      <>
        {}
      </>
    { !loading && currentUser.emailVerified && !user.ban && !user.block && !shutDownInfo &&
      <div id="main" >
        <motion.div 
          initial={{ opacity: 0  }}
          animate={{ opacity: 1 }}
          transition={{delay: .1}}
          className='navbar left-side ' id='menu'
        >
          <div className='wrapper-navbar'>
            <ArrowBack 
              onClick={() => {document.getElementById("menu").classList.remove("left-menu");  document.body.style.overflow="visible"}}
              className='arrow-back-mobile'
            />
          <nav>
            <ul>
              <Link to="/" className={path === "/" ? "active" : null} >
                <motion.div 
                  initial={{ opacity: 0,  }}
                  animate={{ opacity: 1, }}
                  transition={{delay: .4}}
                  className='ul-icon'
                >
                  <HomeIcon />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{delay: .4}}
                >Home</motion.p>
              </Link>
              <Link to="/chat" className={path === "/chat" ? "active" : null} >
                <motion.div 
                  initial={{ opacity: 0,  }}
                  animate={{ opacity: 1, }}
                  transition={{delay: .5}}
                  className='ul-icon'
                >
                <ChatIcon />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{delay: .5}}
                >Chat</motion.p>
              </Link>
              <Link to="/settings" className={path === "/settings" ? "active" : null}>
                <motion.div 
                  initial={{ opacity: 0,  }}
                  animate={{ opacity: 1, }}
                  transition={{delay: .8}}
                  className='ul-icon'
                >
                <SettingsIcon />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{delay: .8}}
                >Settings</motion.p>
              </Link>

              {user.admin ? 

              <Link to="/admin" className={path === "/admin" ? "active" : null}>
                <motion.div 
                  initial={{ opacity: 0,  }}
                  animate={{ opacity: 1, }}
                  transition={{delay: .8}}
                  className='ul-icon'
                >
                  <AdminPanelSettings />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{delay: .8}}
                >
                  Admin
                </motion.p>
              </Link> : null
              }


            </ul>
          </nav>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{delay: 1}}
              className='logout'  onClick={handleLogout}
            >
              <Logout className='icon' />
              <h4>Logout</h4>
            </motion.div>
          </div>
        </motion.div>
        <div className='right-side' >
          <div className='mobile_top_bar' >
            { user && 
              <div className='profile' >
                <img src={user.profilePic} />
                <h3>{user.username}</h3>
              </div>
            }
            <MenuIcon
              onClick={() => {document.getElementById("menu").classList.add("left-menu"); document.body.style.overflow="hidden"} }
              className='menu-bar-icon'
            />
          </div>
          <div id='children' >
            {children}
          </div>
        </div>

      </div> 
    }
    { !loading && !currentUser.emailVerified && !user.ban && !shutDownInfo &&
      <div id='verify' >
        <div className='wrp' >
          <h2>Email verification required</h2>
          <p>Welcome in <span className='primary-color' >web app !</span>  Secure your account <span className='emil' >{currentUser.email}</span> and unlock full access. To ensure the utmost security and provide you with a seamless experience, we require email verification for all users. Verifying your email address is a quick and essential step to safeguard your account and access all the features and benefits our platform has to offer.</p>
          <div className='btn-wrp' >
            {clickedVerify ? <button disabled={clickedVerify} >{formatTime(seconds)}</button> : <button onClick={() => handleSendVerify()} >{loadingBtn ? <div className='btn-loader' ></div> : "Send verification agian"}</button> }
            <button className='lgt' onClick={handleLogout} >Logout</button>
          </div>
        </div>
      </div>
    }
    { !loading && user.ban && !user.block && !shutDownInfo &&
      <div id='banned' >
        <div className='wrp' >
          <h2>You got banned</h2>
          <p>Admin of <span className='primary-color' >web app</span> banned your account. If you dont agree with banned, try contact our team <a  href="mailto:web app.team@gmail.com" >web app</a>. You will be unban at: </p>
          <h3>{new Date(user.banTime).toLocaleString()}</h3>
          <button onClick={handleLogout} >Logout</button>
        </div>
      </div>
    }
    { !loading && user.ban && user.block && !shutDownInfo &&
      <div id='banned' >
        <div className='wrp' >
          <h2>Blocked</h2>
          <p>Admin of <span className='primary-color' >web app</span> blocked your account. If you dont agree with block, try contact our team <a  href="mailto:web app.team@gmail.com" >web app</a>. Block can be permanent: </p>
          <button onClick={handleLogout} >Logout</button>
        </div>
      </div>
    }
    { !loading && !user.ban && user.block && !shutDownInfo &&
      <div id='banned' >
        <div className='wrp' >
          <h2>Blocked</h2>
          <p>Admin of <span className='primary-color' >web app</span> blocked your account. If you dont agree with block, try contact our team <a  href="mailto:web app.team@gmail.com" >web app</a>. Block can be permanent: </p>
          <button onClick={handleLogout} >Logout</button>
        </div>
      </div>
    }
    {shutDownInfo &&
     <div id='banned' >
     <div className='wrp' >
       <h2>{shutDownInfo.message}</h2>
       <p>{shutDownInfo.description}</p>
       <button onClick={handleLogout} >Logout</button>
     </div>
   </div>
    }


  </>
  )
}

export default App