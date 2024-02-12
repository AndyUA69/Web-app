import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/auth.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";

import { motion } from "framer-motion";

const Signup = () => {
  const { signup } = useAuth();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordCon, setVisiblePasswordCon] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConRef = useRef();

  useEffect(() => {
    document.title = "web app - sign up";
  }, []);

  const handleSignup = async () => {
    if (
      emailRef.current.value < 1 &&
      passwordRef.current.value < 1 &&
      passwordConRef.current.value < 1 &&
      usernameRef.current.value < 1
    ) {
      setError("Fill the all fields! And create your account");
    } else {
      try {
          if (
            passwordConRef.current.value === passwordRef.current.value &&
            passwordRef.current.value.length > 5
          ) {
            if (usernameRef.current.value.length < 19) {
              setLoading(true);
              await signup(
                emailRef.current.value,
                passwordRef.current.value,
                usernameRef.current.value
              ).then(() =>
                setTimeout(() => {
                  navigate("/");
                }, 1000)
              );
            } else {
              setError("Username length is too long, only 18 characters.");
            }
          } else if (passwordRef.current.value.length < 5) {
            setError("Password have to contains more than 6 characters");
          } else {
            document
              .querySelector(".password .psw-icon")
              .classList.add("ani-icon");
            document
              .querySelector(".password-c .psw-icon")
              .classList.add("ani-icon");
            setError(
              "The password does not match the confirmation password, please check carefully and try again"
            );
            setTimeout(() => {
              document
                .querySelector(".password .psw-icon")
                .classList.remove("ani-icon");
              document
                .querySelector(".password-c .psw-icon")
                .classList.remove("ani-icon");
            }, 500);
          }
      } catch (err) {
        setLoading(false);
        console.log(err);
        switch (err.code) {
          case "auth/email-already-in-use":
            setError(
              "The email is already being used by someone else. Please check your email and try again"
            );
            break;
          default:
            break;
        }
      }
    }

    setTimeout(() => {
      setError("");
    }, 5000);
  };

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
              Sign up
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
                By creating account on{" "}
                <span className="primary-color">web app</span> you can connect
                conversation with your friends.
              </motion.p>
            )}
            <div className="inputs">
              <div className="ema-usr">
                <motion.input
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                />
                <motion.input
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                />
              </div>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="password"
              >
                <input
                  ref={passwordRef}
                  type={!visiblePassword ? "password" : "text"}
                  placeholder="Password"
                />
                {visiblePassword && (
                  <VisibilityIcon
                    onClick={() => setVisiblePassword(false)}
                    className="psw-icon"
                  />
                )}
                {!visiblePassword && (
                  <VisibilityOffIcon
                    onClick={() => setVisiblePassword(true)}
                    className="psw-icon"
                  />
                )}
              </motion.div>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="password-c"
              >
                <input
                  ref={passwordConRef}
                  type={!visiblePasswordCon ? "password" : "text"}
                  placeholder="Password Confirm"
                />
                {visiblePasswordCon && (
                  <VisibilityIcon
                    onClick={() => setVisiblePasswordCon(false)}
                    className="psw-icon"
                  />
                )}
                {!visiblePasswordCon && (
                  <VisibilityOffIcon
                    onClick={() => setVisiblePasswordCon(true)}
                    className="psw-icon"
                  />
                )}
              </motion.div>
            </div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="auth-btn"
              disabled={loading}
              onClick={handleSignup}
            >
              {!loading ? "Sign up" : <div className="loader"></div>}
            </motion.button>
            <motion.a
              initial={{ x: -1, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="auth-question"
            >
              Do you already have account ?{" "}
              <Link className="primary-color" to="/login">
                Login
              </Link>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
