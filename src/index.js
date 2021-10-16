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
  updateProfile,
  // connectAuthEmulator,
} from 'firebase/auth';

import { getFirebaseConfig } from './firebase-config.js';

// email password authentication
function createEmailUser(email, password, displayName) {
  createUserWithEmailAndPassword(getAuth(), email, password, displayName)
    .then((userCredential) => {
      // Signed in 
      // const user = userCredential.user;
      // console.log(user);
      updateProfile(getAuth().currentUser, {
        displayName: displayName,
      }).then(() => {
        // Profile updated!
        onAuthStateChanged(getAuth(), authStateObserver);
      }).catch((error) => {
        // An error occurred
      });
    })
    .catch((error) => {
      // const errorCode = error.code;
      console.log(error.message);
    });
}

function loginEmailUser(email, password) {
  signInWithEmailAndPassword(getAuth(), email, password)
  .then((userCredential) => {
    // Signed in 
    // const user = userCredential.user;
  })
  .catch((error) => {
    // const errorCode = error.code;
    console.log(error.message);
  });
}

// Signs-in FAV-RIDE
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
  
  // go back home
  loginForm.setAttribute('hidden', 'true');
  registerForm.setAttribute('hidden', 'true');
  greeting.setAttribute('hidden', 'true');
  welcomeSection.removeAttribute('hidden');
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
  userNameElement[0].textContent = userName;
  userNameElement[1].textContent = userName;

  // Show user's profile and sign-out button.
  userNameElement[0].removeAttribute('hidden');
  userNameElement[1].removeAttribute('hidden');
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
    userNameElement[0].setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');
    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');

    // main welcome section
    welcomeSection.setAttribute('hidden', 'true');              // hide main welcome section when logged out
    // hide main options
    mainButtons.setAttribute('hidden', 'true');
    // show welcome buttons
    welcomeButtons.removeAttribute('hidden');

    // welcome when logging out
    if(greeting.getAttribute('hidden') != null) {               // if greeting is hidden
      greeting.removeAttribute('hidden');                       // show greeting
    } else {                                                    // else
      welcomeSection.setAttribute('hidden', 'true');            // hide welcome section
    }
    
    // back to home from other pages
    loginForm.setAttribute('hidden', 'true');
    registerForm.setAttribute('hidden', 'true');
    schForm.setAttribute('hidden', 'true');
    hailForm.setAttribute('hidden', 'true');
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
var userNameElement = document.getElementsByClassName('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');

//  var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// my DOM
// welcome
var welcomeSection = document.getElementById('welcome-main');
// logged-in/out
var mainButtons = document.getElementById('main-buttons');
// guest
var welcomeButtons = document.getElementById('welcome');

// register form
var showRegisterForm = document.getElementById('showRegFormBtn');
var registerForm = document.getElementById('regFormSection');

// login form
var showLoginForm = document.getElementById('loginFormBtn');
var loginForm = document.getElementById('login');

// schedule / hail form
var schForm = document.getElementById('scheduleForm');
var hailForm = document.getElementById('hailForm');

var continueBtn = document.getElementById('continue');
var greeting = document.getElementById('greeting');

// google login/out buttons
signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

// my listeners

// continue past welcome
continueBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.setAttribute('hidden', 'true');
  registerForm.setAttribute('hidden', 'true');
  schForm.setAttribute('hidden', 'true');
  hailForm.setAttribute('hidden', 'true');
  greeting.setAttribute('hidden', 'true');
  welcomeSection.removeAttribute('hidden');
})

// show login form
showLoginForm.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
  // login event listener
  document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    let email = document.getElementById('loginUsername').value;
    let loginPass = document.getElementById('loginPass').value;
    loginEmailUser(email, loginPass);
    welcomeSection.removeAttribute('hidden');
    loginForm.setAttribute('hidden', 'true');
  })
});

// show registration form
showRegisterForm.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
  // register button click event
  document.getElementById('registerBtn').addEventListener('click', (e) => {
    e.preventDefault();
    let regEmail = document.getElementById('regEmail').value;
    let regPass = document.getElementById('regPass').value;
    let fName = document.getElementById('first-name').value;
    let lName = document.getElementById('last-name').value;
    createEmailUser(regEmail, regPass, fName + " " + lName);
    welcomeSection.removeAttribute('hidden');
    registerForm.setAttribute('hidden', 'true');
  });
});

// home button
document.getElementById('home').addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.setAttribute('hidden', 'true');
  registerForm.setAttribute('hidden', 'true');
  schForm.setAttribute('hidden', 'true');
  hailForm.setAttribute('hidden', 'true');
  greeting.setAttribute('hidden', 'true');
  welcomeSection.removeAttribute('hidden');
})

// hail/schedule buttons
hailBtn.addEventListener('click', (e) => {
  e.preventDefault();
  hailForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});
scheduleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  schForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});

// Your web app's Firebase configuration
const firebaseApp = initializeApp(getFirebaseConfig());
// connectAuthEmulator(getAuth(), "http://localhost:9099");

initFirebaseAuth();
