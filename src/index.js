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
  connectAuthEmulator,
} from 'firebase/auth';

import { getFirebaseConfig } from './firebase-config.js';

let emulate = true;
// const auth = getAuth();

// email password authentication
function createEmailUser(email, password, displayName) {
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      // Signed in 
      // const user = userCredential.user;
      updateProfile(getAuth().currentUser, {
        displayName: displayName,
      }).then(() => {
        // Profile updated!
        initFirebaseAuth();
        welcomeSection.removeAttribute('hidden');
        registerForm.setAttribute('hidden', 'true');
        console.log("User: " + userCredential.user.displayName + " added.");
      }).catch((error) => {
        // An error occurred
        console.log(error.message);
        alert(error.message);
      });
    })
    .catch((error) => {
      // const errorCode = error.code;
      console.log(error.message);
      alert(error.message);
    });
}

function loginEmailUser(email, password) {
  signInWithEmailAndPassword(getAuth(), email, password)
  .then((userCredential) => {
    // Signed in 
    // const user = userCredential.user;
    welcomeSection.removeAttribute('hidden');
    loginForm.setAttribute('hidden', 'true');
  })
  .catch((error) => {
    // const errorCode = error.code;
    console.log(error.message);
    alert(error.message);
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

// validate email
// https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html
// function validateEmail(email) {
//   const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return res.test(String(email).toLowerCase());
// }

// progress bar
var i = 0;
function progress() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 50);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        // i = 0;
        alert('Your ride has arrived!');
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
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
var hailNowBtn = document.getElementById('hailNowBtn');

var continueBtn = document.getElementById('continue');
var greeting = document.getElementById('greeting');

// google login/out buttons
signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

// my listeners
// e.stopPropagation(); 
// https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
// continue past welcome button
continueBtn.addEventListener('click', (e) => {
  e.preventDefault();
  greeting.setAttribute('hidden', 'true');
  welcomeSection.removeAttribute('hidden');
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
});

// show login form
showLoginForm.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});
// login event listener
document.getElementById('loginBtn').addEventListener('click', (e) => {
  e.preventDefault();
  let email = document.getElementById('loginUsername').value;
  let loginPass = document.getElementById('loginPass').value;
  if(email && loginPass) {
    loginEmailUser(email, loginPass);
  } else
  alert("Please complete the form.");
});

// show registration form listener
showRegisterForm.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});
// register event click listener
document.getElementById('registerBtn').addEventListener('click', (e) => {
  e.preventDefault();
  let regEmail = document.getElementById('regEmail').value;
  let regPass = document.getElementById('regPass').value;
  let fName = document.getElementById('first-name').value;
  let lName = document.getElementById('last-name').value;
  
  // if(validateEmail(regEmail)) {
  if (regEmail && regPass && fName && lName) {
    if(regPass.length > 5) {
      createEmailUser(regEmail, regPass, fName + " " + lName);
    } else {
      alert("Please choose a password length of at least 6.");
    }
  } else {
    alert("Please complete the form.");
  }
  // } else {
  //   alert("Please use a valid email address.");
  // }
});

// hail/schedule buttons
hailBtn.addEventListener('click', (e) => {
  e.preventDefault();
  hailForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});
hailNowBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let dropOff = document.getElementById('dropOff').value;
  if(dropOff) {
    document.getElementById('destination').innerHTML = "Sending an FAV to: " + dropOff;
    document.getElementById('myBar').removeAttribute('hidden');
    progress();
  } else {
    alert("Please enter a drop-off location.");
  }
});
scheduleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  schForm.removeAttribute('hidden');
  welcomeSection.setAttribute('hidden', 'true');
});

// Your web app's Firebase configuration
const firebaseApp = initializeApp(getFirebaseConfig());

// enable/disable emulate on line 20
if(emulate)
  connectAuthEmulator(getAuth(), "http://localhost:9099");

initFirebaseAuth();
