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

import { collection, getFirestore, connectFirestoreEmulator,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  deleteDoc,
  updateDoc, arrayUnion, arrayRemove,
  Timestamp 
 } from "firebase/firestore";

const config = {
  // API Key Here
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
  doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => this.auth.signOut();

  doAuthStateChanged = (authUser) =>
    onAuthStateChanged(this.auth, authUser);

  doGoogleSignIn = async () => {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
    this.setLastLogin();
  }

  setLastLogin = async () => {
    const userData = collection(this.db, "userData");
    await setDoc(doc(userData, this.auth.currentUser.email), {
      lastLogin: Timestamp.fromDate(new Date())
    }, {merge: true});
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
      price: price,
      createTime: Timestamp.fromDate(new Date())
    });
  }

  doBookLater = async (date, time, vehicle) => {
    const bookLaterRef = doc(this.db, "bookLater", this.auth.currentUser.email);
    await setDoc(bookLaterRef, {
      bookings: arrayUnion({date: date, time: time, vehicle: vehicle})
    }, {merge: true});
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

  doSetRole = async (role) => {
    const userData = collection(this.db, "userData");
    await setDoc(doc(userData, this.auth.currentUser.email), {
      role: role
    }, {merge: true});
  }

  doAddVehicle = async (type, color, fuel) => {
    const vehiclesRef = doc(this.db, "vehicles", type);
    await setDoc(vehiclesRef, {
      vehiclesAvailable: arrayUnion({color: color, fuel: fuel})
    }, {merge: true});
  }

  doGetVehicleOptions = async (vehicleType) => {
    const docRef = doc(this.db, "vehicles", vehicleType);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  }
}

export default Firebase;
