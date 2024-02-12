import {
  ArrowForwardRounded,
  Message,
} from "@mui/icons-material";
import { ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UnSeen from "../../components/UnSeen/UnSeen";
import { useAuth } from "../../context/AuthContext";
import { rdb } from "../../firebase";
import "./Home.css";

import { motion } from "framer-motion";

import useFetchUserData from "../../utilis/getUser";
import useFetchUserFriends from "../../utilis/getFriends";
import useFetchUsers from "../../utilis/getUsers";

const Home = () => {
  const { currentUser } = useAuth();

  const [user, setUser] = useState();

  const [newMessage, setNewMessage] = useState(true);

  const [bioLength, setBioLength] = useState();

  const maxBio = 40;

  const [allFriends, setAllFriends] = useState();
  const [friends, setFriends] = useState();

  const [allUsers, setAllUsers] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState();

  const [loadingSave, setLoadingSave] = useState(false);


  useFetchUserData(currentUser, setUser, setBio);
  useFetchUserFriends(currentUser, setFriends, setAllFriends);
  useFetchUsers(setUsers, setAllUsers);

  //call function after web is loaded
  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu");
    document.body.style.overflow = "visible";
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChangeMood = (mood) => {
    update(ref(rdb, "users/" + currentUser.uid), {
      mood: mood,
    });
  };

  const handleUpdateBio = () => {
    setLoadingSave(true);

    if (bioLength <= maxBio) {
      update(ref(rdb, "users/" + currentUser.uid), {
        bio: bio,
      });
    }

    setTimeout(() => {
      setLoadingSave(false);
    }, 1000);
  };

  useEffect(() => {
    if (bio) {
      setBioLength(bio.length);
    }
  }, [bio]);

  useEffect(() => {
    setNewMessage(true);
    if (allFriends) {
      setTimeout(() => {
        setNewMessage(false);
      }, 1000);
    }
  }, [allFriends]);

  return (
    <>
      <div id="home">
        <div className="wrapper-home">
          <div className="content">
            {/* title welcome  */}
            <div className="titles">
              {user && (
                <motion.h3
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome, {user.username}
                </motion.h3>
              )}
            </div>

            <div className="wrapper-3boxes">
              {/* chat */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="small-b box"
              >
                <div className="title">
                  <Message className="titles-icon" />
                  <h3>Unread messages</h3>
                  <Link className="create-icon" to="/chat">
                    <ArrowForwardRounded />
                  </Link>
                </div>

                <div className="unseen-wrp">
                  {friends &&
                    !loading &&
                    allFriends &&
                    !newMessage &&
                    allFriends
                      .filter((a) => {
                        return a.saw === false;
                      })
                      .map((f) => (
                        <Link to="/chat">
                          <UnSeen users={allUsers} user={f} />
                        </Link>
                      ))}
                  {allFriends &&
                    allFriends.filter((a) => {
                      return a.saw === false;
                    }).length === 0 && (
                      <p className="no-new-messages">
                        You have not any new messages. You had everything read.
                      </p>
                    )}
                </div>
              </motion.div>
              {/* chat end */}
            </div>
          </div>

          {/* PROFILE */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="big-b box profile-right"
          >
            {user && (
              <div className="profile">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="titles"
                >
                  <img alt="profile" src={user.profilePic} />
                  <h3 className="email">{user.email}</h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="moods"
                >
                  <h3>What is your mood ?</h3>
                  <p>Select emoji and express your feelings</p>
                  <div className="mood-wrapper">
                    <span
                      onClick={() => {
                        handleChangeMood("🥰");
                      }}
                      className={user.mood === "🥰" ? "active" : null}
                    >
                      🥰
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😂");
                      }}
                      className={user.mood === "😂" ? "active" : null}
                    >
                      😂
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("🙂");
                      }}
                      className={user.mood === "🙂" ? "active" : null}
                    >
                      🙂
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😔");
                      }}
                      className={user.mood === "😔" ? "active" : null}
                    >
                      😔
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😤");
                      }}
                      className={user.mood === "😤" ? "active" : null}
                    >
                      😤
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="bio"
                >
                  <h3>
                    Share your thoughts{" "}
                    <span style={{ fontSize: "8px", marginLeft: "10px" }}>
                      {bioLength}/{maxBio}
                    </span>
                  </h3>
                  <p>Your thoughts will see only friends.</p>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write some thoughts..."
                  />
                  <button
                    disabled={bioLength <= maxBio ? false : true}
                    onClick={handleUpdateBio}
                  >
                    {loadingSave ? <div className="loader-b"></div> : "Save"}
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
          {/* PROFILE end */}
        </div>
      </div>
    </>
  );
};

export default Home;
