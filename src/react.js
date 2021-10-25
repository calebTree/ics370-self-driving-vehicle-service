'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";

// firebase
import { initializeApp } from "firebase/app";
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
import { 
  initFirebaseAuth, 
  authStateObserver, 
  userPicElement, 
  userNameElement, 
  signInButtonElement, 
  signOutButtonElement 
} from './index.js';

let emulate = true;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  handleClick() {
    console.log("you ciicked a button.");
  }

  render() {
    return (
      <div>
        <div className="mdl-layout--fixed-header">
          <header className="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
            <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
              <div className="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">                
                <h1>
                  <Link to="/"><i className="material-icons">directions_car</i> FAV-RIDE ™</Link>
                </h1>                
              </div>
              <div id="user-container">
                <div hidden id="user-pic"></div>
                <div hidden className="user-name"></div>
                {this.state.loggedIn ?
                  <button onClick={() => this.handleClick()} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                    Sign-out
                  </button> :
                  <button onClick={() => this.handleClick()} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                    <i className="material-icons">account_circle</i>Sign-in with Google
                  </button> 
                }
              </div>
            </div>
          </header>
        </div>
        <Switch>
          <Route exact path="/" component={Greeting}/>
          <Route path="/welcome" component={Welcome}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
          {/* <Route path="/hail" component={Hail}/>
          <Route path="/book" component={Book}/> */}
          <Redirect to="/welcome" />
        </Switch>
      </div>
    )
  }
}

class Greeting extends React.Component {
  render() {
    return (
      <div className="mdl-layout">
        <section id="greeting" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="mdl-card__supporting-text">
            <h3>Welcome to FAV-RIDE ™</h3>
            <p className="greeting">FAV-RIDE is the future of transportation using F-ully A-utonomous V-ehicles.</p>
            <p className="subGreeting">Brought to you by Metro State, Fall 2021 ICS370, Team 2:</p>
            <br />
              Caleb Anderson:
              <a href="mailto:caleb.anderson@my.metrostate.edu">caleb.anderson@my.metrostate.edu</a>
            <br />
              Arielle Hounton:
              <a href="mailto:arielle.hounton@my.metrostate.edu">arielle.hounton@my.metrostate.edu</a>
            <br />
              Youssoufou Kante:
              <a href="mailto:youssoufou.kante@my.metrostate.edu">youssoufou.kante@my.metrostate.edu</a>
            <br />
              Jonathan Bracamontes:
              <a href="mailto:jonathan.bracamontes@my.metrostate.edu">jonathan.bracamontes@my.metrostate.edu</a>
            <br />
            <br />
            <br />
            <div>
              <Link to="/welcome" className="section-button mdl-button mdl-js-button mdl-button--raised" >Continue</Link>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  render() {
    return (
      <div className="mdl-layout">
        <section id="welcome-main" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">

          <div className="home_box">
            {this.state.loggedIn ? 
                <div id="main-buttons" className="mdl-grid">
                  <div className="mdl-typography--text-center">
                    <div className="hmcontent">
                      <h2>Welcome Back <span hidden className="user-name"></span></h2>
                    </div>
                    <Link to='/book' className="section-button mdl-button mdl-button--raised mdl-button--colored">Schedule A Ride <i className="material-icons">departure_board</i></Link>
                    <Link to='/hail' className="section-button mdl-button mdl-button--raised mdl-button--accent">Hail A Ride <i className="material-icons">hail</i></Link>
                  </div>
                </div>
              :
              <div>
                <div className="hmlogo">
                  <span className="material-icons">directions_car</span>
                </div>
                <div className="hmcontent">
                  <p>For all your trips requiring a ride, we will get you there safely.</p>
                </div>
                <div id="welcome" className="homeReg">
                  <Link to='/register' className="section-button mdl-button mdl-button--raised mdl-button--colored pull-left">Create your account</Link>
                  <Link to='/login' className="section-button mdl-button mdl-button--raised mdl-button--accent pull-right">Login</Link>
                </div>
              </div>
            }
          </div>

        </section>
      </div>
    )
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: '',
      lName: '',
      email: '',
      password: '',
      loggedIn: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    createUserWithEmailAndPassword(getAuth(), this.state.email, this.state.password)
    .then((userCredential) => {
      // Signed in 
      // const user = userCredential.user;
      updateProfile(getAuth().currentUser, {
        displayName: this.state.fName + " " + this.state.lName,
      }).then(() => {
        // Profile updated!
        initFirebaseAuth();
        console.log("User: " + userCredential.user.displayName + " added.");
        this.setState({loggedIn: true});
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
    event.preventDefault();
  }

  render() {
    if(this.state.loggedIn)
      return <Redirect to="/welcome" />;
    return (
      <div className="mdl-layout">
        <section id="regFormSection" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="mdl-card__supporting-text">
            <h3>Create Account</h3>
            <form id="regForm" onSubmit={this.handleSubmit}>
              <div id="name">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input name="fName" className="mdl-textfield__input" type="text" value={this.state.fName} onChange={this.handleInputChange} required />
                  <label className="mdl-textfield__label" htmlFor="first-name">First Name</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input name="lName" className="mdl-textfield__input" type="text" value={this.state.lName} onChange={this.handleInputChange} required />
                  <label className="mdl-textfield__label" htmlFor="last-name">Last Name</label>
                </div>
              </div>
              <div id ="contact">
                {/* <!-- <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input id="phone" class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="mobile">
                    <label class="mdl-textfield__label" htmlFor="phone">Mobile Phone</label>
                  </div>
                </div>					 --> */}
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="email" className="mdl-textfield__input" type="email" value={this.state.email} onChange={this.handleInputChange} required />
                    <label className="mdl-textfield__label" htmlFor="regEmail">E-mail / Username</label>
                  </div>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="password" className="mdl-textfield__input" type="password" value={this.state.password} onChange={this.handleInputChange} required />
                    <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
                  </div>
                </div>
              </div>
              <button className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
            </form>
          </div>
        </section>
      </div>
    )
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mdl-layout">
        <section id="login" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="mdl-card__supporting-text">
            <h3>Login</h3>
            <form action="#">
              <div id="name">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="loginUsername" className="mdl-textfield__input" type="text" required />
                  <label className="mdl-textfield__label" htmlFor="username">Email / Username</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="loginPass" className="mdl-textfield__input" type="password" required />
                  <label className="mdl-textfield__label" htmlFor="loginPass">Password</label>
                </div>
              </div>
              <button id="loginBtn" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Submit</button>
            </form>
          </div>
        </section>
      </div>
    )
  }
}

// const firebaseApp = initializeApp(getFirebaseConfig());

// enable/disable emulate on line 20
if(emulate)
  connectAuthEmulator(getAuth(), "http://localhost:9099");

// initFirebaseAuth();

const domContainer = document.querySelector('#root');
ReactDOM.render(
  <BrowserRouter>
    <Home />
  </BrowserRouter>,
domContainer);
