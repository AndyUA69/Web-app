import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBx2eIRyVSnCpgd56fWnBXIgVg_hMmnGDM",
  authDomain: "res1-be23d.firebaseapp.com",
  projectId: "res1-be23d",
  storageBucket: "res1-be23d.appspot.com",
  messagingSenderId: "424227464870",
  appId: "1:424227464870:web:e32934fba7236db1cb7667",
  databaseUrl: "https://res1-be23d-default-rtdb.europe-west1.firebasedatabase.app/"
};

//inicialition function 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rdb = getDatabase(app);
const sdb = getStorage(app)
const auth = getAuth(app);
const analytics = getAnalytics(app)

export { db, rdb, sdb, auth, analytics }
export default app
