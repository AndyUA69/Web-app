import React, { useContext, useState, useEffect } from "react";
import { auth, rdb } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set, update } from "firebase/database";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // VYTVORENIE UCTU - potrebny: email, password, username
  async function signup(email, password, username) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      async (user) => {
        await sendEmailVerification(auth.currentUser).then(() => {
          set(ref(rdb, "users/" + user.user.uid), {
            username: username,
            profilePic: "https://i.postimg.cc/zfP6Tk3W/profile-pic-default.png",
            email: email,
            mood: "🙂",
            id: user.user.uid,
            lastLogin: new Date().valueOf(),
            verify: false,
            createdAt: new Date(),
          });
        });
      }
    );
  }

  // PRIHLASENIE - potrebny: email, password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(
      async (user) => {
        update(ref(rdb, "users/" + user.user.uid), {
          lastLogin: new Date().valueOf(),
          verify: user.user.emailVerified,
        });
      }
    );
  }

  //odhlasenie
  function logout() {
    return auth.signOut();
  }

  //resetovanie hesla
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function sendEmailVerify(currentUser) {
    return sendEmailVerification(auth.currentUser);
  }

  //nove heslo
  function updateUserPassword(password) {
    return updatePassword(currentUser, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateUserPassword,
    sendEmailVerify,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
