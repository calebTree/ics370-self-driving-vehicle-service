// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { getFirebaseConfig } from './firebase-config.js';

// Signs-in FAV-RIDE
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}

// Signs-out of FAV-RIDE.
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
// function isUserSignedIn() {
//   return !!getAuth().currentUser;
// }

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
  // Get the signed-in user's profile pic and name.
  var profilePicUrl = getProfilePicUrl();
  var userName = getUserName();

  // Set the user's profile pic and name.
  userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
  userNameElement.textContent = userName;

  // Show user's profile and sign-out button.
  userNameElement.removeAttribute('hidden');
  userPicElement.removeAttribute('hidden');
  signOutButtonElement.removeAttribute('hidden');
  // Hide sign-in button.
  signInButtonElement.setAttribute('hidden', 'true');
  
  // Show main options
  mainButtons.removeAttribute('hidden');
  // hide welcome buttons
  welcomeButtons.setAttribute('hidden', 'true');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');
    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');

    // Hide main options
    mainButtons.setAttribute('hidden', 'true');
    // show welcome buttons
    welcomeButtons.removeAttribute('hidden');
  }
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// Shortcuts to DOM Elements.
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');

// my DOM
var welcomeButtons = document.getElementById('welcome');
var mainButtons = document.getElementById('main-buttons');

//  var signInSnackbarElement = document.getElementById('must-signin-snackbar');

signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

// Your web app's Firebase configuration
const firebaseApp = initializeApp(getFirebaseConfig());

initFirebaseAuth();
