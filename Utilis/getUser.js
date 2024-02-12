import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { rdb } from "../firebase"


const useFetchUserData = (currentUser, setUser, setBio) => {
    useEffect(() => {
      const starCountRef = ref(rdb, `users/${currentUser.uid}/`);
      const onDataChange = (snapshot) => {
        const data = snapshot.val();
        setUser(data);
        if(setBio) {
          setBio(data.bio);
        }
      };
  
      const unsubscribe = onValue(starCountRef, onDataChange);
  
      return () => {
        // Unsubscribe from the Firebase listener when the component unmounts
        unsubscribe();
      };
    }, [currentUser, setUser, setBio]);
};


export default useFetchUserData;