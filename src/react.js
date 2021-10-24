'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";

class Home extends React.Component {
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
                <button hidden id="sign-out" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                  Sign-out
                </button>
                <button hidden id="sign-in" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                  <i className="material-icons">account_circle</i>Sign-in with Google
                </button>
              </div>
            </div>
          </header>
        </div>
        <Route exact path="/" component={Greeting}/>
        <Route path="/welcome" component={Welcome}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
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
            <p>
              Caleb Anderson:
              <a href="mailto:caleb.anderson@my.metrostate.edu">caleb.anderson@my.metrostate.edu</a>
            </p>
            <p>
              Arielle Hounton:
              <a href="mailto:arielle.hounton@my.metrostate.edu">arielle.hounton@my.metrostate.edu</a>
            </p>
            <p>
              Youssoufou Kante:
              <a href="mailto:youssoufou.kante@my.metrostate.edu">youssoufou.kante@my.metrostate.edu</a>
            </p>
            <p>
              Jonathan Bracamontes:
              <a href="mailto:jonathan.bracamontes@my.metrostate.edu">jonathan.bracamontes@my.metrostate.edu</a>
            </p>
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
  render() {
    return (
      <div className="mdl-layout">
        <section id="welcome-main" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">   
          <div className="home_box">       
            <div className="hmlogo">
              <span className="material-icons">directions_car</span>
            </div>
            <div className="hmcontent">
              <p>For all your trip requiring a ride, we will get you there safely.</p>
            </div>
            <div id="welcome" className="homeReg">
              <Link to='/register' className="section-button mdl-button mdl-button--raised mdl-button--colored pull-left">Create your account</Link>
              <Link to='/login' id="loginFormBtn" className="section-button mdl-button mdl-button--raised mdl-button--accent pull-right">Login</Link>
            </div>

            <div id="main-buttons" className="mdl-grid" hidden>
              <div className="mdl-typography--text-center">
                <div className="hmcontent">
                  <h2>Welcome Back <span hidden className="user-name"></span></h2>
                </div>
                <a id="scheduleBtn" className="section-button mdl-button mdl-button--raised mdl-button--colored">Schedule A Ride <i className="material-icons">departure_board</i></a>
                <a id="hailBtn" className="section-button mdl-button mdl-button--raised mdl-button--accent">Hail A Ride <i className="material-icons">hail</i></a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mdl-layout">
        <section id="regFormSection" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="mdl-card__supporting-text">
            <h3>Create Account</h3>
            <form id="regForm" action="#">
              <div id="name">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="first-name" className="mdl-textfield__input" type="text" required />
                  <label className="mdl-textfield__label" htmlFor="first-name">First Name</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="last-name" className="mdl-textfield__input" type="text" required />
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
                    <input id="regEmail" className="mdl-textfield__input" type="email" required />
                    <label className="mdl-textfield__label" htmlFor="regEmail">E-mail / Username</label>
                  </div>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input id="regPass" className="mdl-textfield__input" type="password" required />
                    <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
                  </div>
                </div>
              </div>
              <button id="registerBtn" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
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

const domContainer = document.querySelector('#root');
ReactDOM.render(
  <BrowserRouter>
    <Home />
  </BrowserRouter>
, domContainer);
