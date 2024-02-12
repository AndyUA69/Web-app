import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../style/auth.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const Login = () => {
  const { login } = useAuth();
  let navigate = useNavigate();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    document.title = "web app - Login";
  }, []);

  const handleLogin = async () => {
    if (
      emailRef.current.value.length < 1 &&
      passwordRef.current.value.length < 1
    ) {
      setError("Fill in the fields! Write your email and password.");
    } else {
      try {
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value).then(
          () =>
            setTimeout(() => {
              navigate("/");
            }, 1000)
        );
      } catch (err) {
        setLoading(false);
        switch (err.code) {
          case "auth/invalid-email":
            setError("Wrong email address, please write it corectly.");
            break;
          case "auth/wrong-password":
            setError(
              "Uppss, wrong passwrod, chceck if you typed it alright and try it again."
            );
            document.querySelector(".psw-icon").classList.add("ani-icon");
            setTimeout(() => {
              document.querySelector(".psw-icon").classList.remove("ani-icon");
            }, 1000);
            break;
          case "auth/user-not-found":
            setError("User not found, carefuly chceck your email address.");
            break;
          case "auth/too-many-requests":
            setError("Too many requests, try it leter");
            break;
          default:
            setError("Something wrong");
        }
      }
    }

    setTimeout(() => {
      setError("");
    }, 5000);
  };

  return (
    <>
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
                Login
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
                  Log in to your account on{" "}
                  <span className="primary-color">web app</span> and start
                  conversation with your friends
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
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
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
              </div>
              <motion.a
                initial={{ y: -1, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="auth-forgot"
              >
                <Link to="/forgot" className="primary-color">
                  Forgot password ?
                </Link>
              </motion.a>
              <motion.button
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="auth-btn"
                disabled={loading}
                onClick={handleLogin}
              >
                {!loading ? "Login" : <div className="loader"></div>}
              </motion.button>
              <motion.a
                initial={{ x: -1, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="auth-question"
              >
                You don`t have an account ?{" "}
                <Link className="primary-color" to="/signup">
                  Sign up
                </Link>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
