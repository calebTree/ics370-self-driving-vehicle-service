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
import { collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc, arrayUnion, arrayRemove
 } from "firebase/firestore";

const config = {
  // API Keys Here
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

  doSignInWithEmailAndPassword = async (email, password) => {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        const userData = collection(this.db, "userData");
        setDoc(doc(userData, email), {
          role: "user"
        });
      }
    );
  }

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
  doBookNow = async (pickup, dropoff, distance, price) => {
    const currentUser = this.auth.currentUser;
    const bookNow = collection(this.db, "bookNow");
    await setDoc(doc(bookNow, currentUser.email), {
      origin: pickup,
      destination: dropoff,
      distance: distance,
      price: price
    });
  }

  doBookLater = async (date, time, vehicle) => {
    const bookLaterRef = doc(this.db, "bookLater", this.auth.currentUser.email);
    // Atomically add a new region to the "regions" array field.
    await updateDoc(bookLaterRef, {
      bookings: arrayUnion({date: date, time: time})
    });
  }

  doReadBooking = async () => {
    const docRef = doc(this.db, "bookNow", this.auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      // console.log("booking for " + this.auth.currentUser.email + " not found.");
    }
  }

  doCancelBooking = async () => {
    await deleteDoc(doc(this.db, "bookNow", this.auth.currentUser.email));
  }

  doReadAccount = async () => {
    const docRef = doc(this.db, "userData", this.auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      // console.log("booking for " + this.auth.currentUser.email + " not found.");
    }
  }

  doUpdateRole = async (role) => {
    const userData = collection(this.db, "userData");
    await setDoc(doc(userData, this.auth.currentUser.email), {
      role: role
    });
  }

  doAddVehicle = async (type, color, fuel) => {
    // console.log(type, color, fuel);    
    try {
      const docRef = await addDoc(collection(this.db, "vehicles"), {
        type: type,
        color: color,
        fuel: fuel
      });    
      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
}

export default Firebase;
