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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // connectAuthEmulator,
} from 'firebase/auth';

import { getFirebaseConfig } from './firebase-config.js';

// email password authentication
function createEmailUser(email, password) {
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // console.log(user);
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(errorMessage);
    });
}

function loginEmailUser(email, password) {
  signInWithEmailAndPassword(getAuth(), email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log(errorMessage);
  });
}

// Signs-in FAV-RIDE
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
  document.getElementById('login').setAttribute('hidden', 'true');
  document.getElementById('regFormSection').setAttribute('hidden', 'true');
  document.getElementById('welcome-main').removeAttribute('hidden');
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

//  var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// my DOM
// welcome
var welcomeSection = document.getElementById('welcome-main');
var welcomeButtons = document.getElementById('welcome');
var mainButtons = document.getElementById('main-buttons');

// register form
var showRegisterForm = document.getElementById('showRegFormBtn');
var registerForm = document.getElementById('regFormSection');

// login form
var loginForm = document.getElementById('login');
var loginFormBtn = document.getElementById('loginFormBtn');

// var hailBtn = document.getElementById('hailBtn');
// var scheduleBtn = document.getElementById('scheduleBtn');

signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

// my listeners
loginFormBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');

  let loginButton = document.getElementById('loginBtn');
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    let email = document.getElementById('loginUsername').value;
    let loginPass = document.getElementById('loginPass').value;
    loginEmailUser(email, loginPass);
    welcomeSection.removeAttribute('hidden');
    loginForm.setAttribute('hidden', 'true');
  })
});

showRegisterForm.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');

  var regButton = document.getElementById('registerBtn');
  regButton.addEventListener('click', (e) => {
    e.preventDefault();
    let regEmail = document.getElementById('regEmail').value;
    let regPass = document.getElementById('regPass').value;
    createEmailUser(regEmail, regPass);
    welcomeSection.removeAttribute('hidden');
    registerForm.setAttribute('hidden', 'true');
  });
});

// home button
document.getElementById('home').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('login').setAttribute('hidden', 'true');
  document.getElementById('regFormSection').setAttribute('hidden', 'true');
  document.getElementById('welcome-main').removeAttribute('hidden');
})

// hailBtn.addEventListener('click', showHailForm);
// scheduleBtn.addEventListener('click', showScheduleForm);

// Your web app's Firebase configuration
const firebaseApp = initializeApp(getFirebaseConfig());
// connectAuthEmulator(getAuth(), "http://localhost:9099");

initFirebaseAuth();
