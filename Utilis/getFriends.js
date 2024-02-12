import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { rdb } from "../firebase";

const useFetchUserFriends = (currentUser, setFriends, setAllFriends) => {
  useEffect(() => {
    const starCountRef = ref(rdb, `users/${currentUser.uid}/messages/`);
    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      setFriends(data);

      let array = [];
      for (let i in data) {
        array.push(data[i]);
      }

      setAllFriends(array);
    };

    const unsubscribe = onValue(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser, setFriends, setAllFriends]);
};

export default useFetchUserFriends;
