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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  // updateProfile,
  connectAuthEmulator,
} from 'firebase/auth';

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
  constructor() {
    initializeApp(getFirebaseConfig()); 
    this.auth = getAuth();
    // emulate if on localhost
    if (location.hostname === 'localhost') {
      connectAuthEmulator(this.auth, 'http://localhost:9099/', { disableWarnings: false });
    }
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password, displayName) =>
    createUserWithEmailAndPassword(this.auth, email, password);
    // .then((userCredential) => {
    //   // console.log("user created");
    //   updateProfile(this.auth.currentUser, {
    //     displayName: displayName,
    //   }).then(() => {
    //     // Profile updated!
    //     // initFirebaseAuth();
    //     console.log("User: " + userCredential.user.displayName + " added.");
    //   }).catch((error) => {
    //     // An error occurred
    //     console.log(error.message);
    //     alert(error.message);
    //   });

    // })
    // .catch((error) => {
    //   // An error occurred
    //   console.log(error.message);
    //   alert(error.message);
    // });

  // doUpdateUsername = (authUser, username) =>
  //   updateProfile(authUser, {
  //     displayName: username,
  //   }).then(() => {
  //     // Profile updated!
  //     // initFirebaseAuth();
  //     console.log("User: " + username + " added.");
  //   }).catch((error) => {
  //     // An error occurred
  //     console.log(error.message);
  //     alert(error.message);
  //   });

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => this.auth.signOut();
   
  doAuthStateChanged = (authUser) =>
    onAuthStateChanged(this.auth, authUser);

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);

  // async sign in Firebase using popup auth and Google as the identity provider.
  doGoogleSignIn = async () => {
    var provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

}
 
export default Firebase;
