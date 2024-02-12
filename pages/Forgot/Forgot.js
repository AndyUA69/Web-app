import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import "../../style/auth.css"

import { motion } from "framer-motion"
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const emailRef = useRef()

  useEffect(() => {
    document.title = "web app - prihlásiť sa"
  }, [])
  
  const handleReset = async() => {
    if(emailRef.current.value.length < 1) {
      setError("Fill the email address if you forgot password")
    } else {
      try {
        setLoading(true)
        await resetPassword(emailRef.current.value)
        setError("Check your email inbox")
        emailRef.current.value = ""
        setLoading(false)
      } catch(err) {
        setLoading(false)
        switch (err.code) {
          case "auth/user-not-found":
            setError(
              "Daný použivateľ sa nenašiel, pozorne skontrolujte svojú emailovu adresu"
            );
            break;
          default: break;
        }
      }
    }
    
      setTimeout(() => {
        setError("")
      }, 5000)
     
  }

  return (
    <div id="auth">
      <div className="wrapper">
        <div className="left-side">
          <div className="content">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="auth-title"
            >
              Forgot password ?
            </motion.h2>
            {error && (
              <motion.p
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.1 }}
                className="auth-subtitle"
              >
                {error}
              </motion.p>
            )}
            {!error && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="auth-subtitle"
              >
                Only type your email address and we will send you email for
                reset your password.
              </motion.p>
            )}
            <div className="inputs">
              <motion.input
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                ref={emailRef}
                type="email"
                placeholder="Email"
              />
            </div>
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="auth-btn"
              disabled={loading}
              onClick={handleReset}
            >
              {!loading ? "Reset" : <div className="loader"></div>}
            </motion.button>
            <motion.a
              initial={{ x: -1, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="auth-question"
            >
              <Link className="primary-color" to="/signup">
                Sign up{" "}
              </Link>
              <Link className="primary-color" to="/login">
                Login
              </Link>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login