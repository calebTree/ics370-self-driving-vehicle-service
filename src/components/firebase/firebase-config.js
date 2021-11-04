/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { collection, addDoc, getDocs, setDoc, doc, query, where } from "firebase/firestore";

const config = {
  // add config from firebase console
};

function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.\n' +
      'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}

class Firebase {
  // initalize
  constructor() {
    initializeApp(getFirebaseConfig());
    this.auth = getAuth();
    this.db = getFirestore();
    // emulate if on localhost
    if (location.hostname === 'localhost') {
      connectAuthEmulator(this.auth, 'http://localhost:9099/', { disableWarnings: false });
      connectFirestoreEmulator(this.db, 'localhost', 8080);
    }
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => this.auth.signOut();

  doAuthStateChanged = (authUser) =>
    onAuthStateChanged(this.auth, authUser);

  doGoogleSignIn = async () => {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  doUpdateProfile = (displayName) => {
    return new Promise((resolve, reject) => {
      updateProfile(this.auth.currentUser, {
        displayName: displayName,
      }).then(() => {
        // Profile updated!        
        return resolve(this.auth.currentUser);
      }).catch((error) => {
        // An error occurred
        return reject(error.message);
      });
    });
  }

  // *** firestore API ***
  doBookNow = async (destination) => {
    const currentUser = this.auth.currentUser;
    const bookNow = collection(this.db, "bookNow");

    await setDoc(doc(bookNow, currentUser.email), {
      destination: destination
    });

    // const citiesRef = collection(this.db, "cities");
    // await setDoc(doc(citiesRef, "SF"), {
    //   name: "San Francisco", state: "CA", country: "USA",
    //   capital: false, population: 860000,
    //   regions: ["west_coast", "norcal"]
    // });
    // await setDoc(doc(citiesRef, "LA"), {
    //   name: "Los Angeles", state: "CA", country: "USA",
    //   capital: false, population: 3900000,
    //   regions: ["west_coast", "socal"]
    // });
    // await setDoc(doc(citiesRef, "DC"), {
    //   name: "Washington, D.C.", state: null, country: "USA",
    //   capital: true, population: 680000,
    //   regions: ["east_coast"]
    // });
    // await setDoc(doc(citiesRef, "TOK"), {
    //   name: "Tokyo", state: null, country: "Japan",
    //   capital: true, population: 9000000,
    //   regions: ["kanto", "honshu"]
    // });
    // await setDoc(doc(citiesRef, "BJ"), {
    //   name: "Beijing", state: null, country: "China",
    //   capital: true, population: 21500000,
    //   regions: ["jingjinji", "hebei"]
    // });

    // try {
    //   const docRef = await addDoc(collection(this.db, "users"), {
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    //   });
    //   console.log("Document written with ID: ", docRef.id);
    //   return 
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }

    // try {
    //   const docRef = await addDoc(collection(db, "users"), {
    //     first: "Alan",
    //     middle: "Mathison",
    //     last: "Turing",
    //     born: 1912
    //   });
    
    //   console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //   console.error("Error adding document: ", e);
    // }
    
  }

  doReadBooking = async () => {
    // const querySnapshot = await getDocs(collection(this.db, "users"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });

    const q = query(collection(this.db, "cities"), where("capital", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }

}

export default Firebase;
