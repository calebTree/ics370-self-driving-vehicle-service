/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */

//  import app from 'firebase/app';
//  import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const config = {
  // add config from firebase console
};

function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}

class Firebase {
  constructor() {
    initializeApp(getFirebaseConfig()); 
    this.auth = getAuth();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => {
    console.log("signed out");
    this.auth.signOut();
  } 
  doAuthStateChanged = (authUser) =>
    onAuthStateChanged(this.auth, authUser);

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);
}
 
export default Firebase;