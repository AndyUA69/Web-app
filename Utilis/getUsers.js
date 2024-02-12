import { ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { rdb } from "../firebase"


const useFetchUsers = (setUsers, setAllUsers) => {
    useEffect(() => {
      const starCountRef = ref(rdb, `users/`);
      const onDataChange = (snapshot) => {
        const data = snapshot.val();
        setUsers(data);
     
  

      let array = [];
      for (let i in data) {
        array.push(data[i]);
      }
      if(setAllUsers) {
        setAllUsers(array);
      }
      };

      const unsubscribe = onValue(starCountRef, onDataChange);
  
      return () => {
        // Unsubscribe from the Firebase listener when the component unmounts
        unsubscribe();
      };
    }, [setUsers, setAllUsers]);
};


export default useFetchUsers;