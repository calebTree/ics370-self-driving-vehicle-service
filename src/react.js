'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <header className="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
          <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
            <div className="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
              <h1 id="home"><i className="material-icons">directions_car</i> FAV-RIDE ™</h1>
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
        <div>
          <Greeting />
        </div>
      </div>
    )
  }
}

class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: true,
    }
  }

  // my listeners
  // e.stopPropagation(); 
  // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
  // continue past welcome button
  continue() {
    var greeting = document.getElementById('greeting');
    var welcomeSection = document.getElementById('welcome-main');

    greeting.setAttribute('hidden', 'true');
    welcomeSection.removeAttribute('hidden');

    this.state.shown = false;
  }

  render() {
    return (
      <div>
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
            <button id="continue" className="section-button mdl-button mdl-js-button mdl-button--raised" 
              onClick={() => this.continue()}>Continue
            </button>
          </div>
        </section>

        <Welcome />
      </div>
    )
  }
}

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <section id="welcome-main" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid" hidden>   
          <div className="home_box">       
            <div className="hmlogo">
              <span className="material-icons">directions_car</span>
            </div>
            <div className="hmcontent">
              <p>For all your trip requiring a ride, we will get you there safely.</p>
            </div>
            <div id="welcome" className="homeReg" hidden>
              <button id="showRegFormBtn" className="section-button mdl-button mdl-button--raised mdl-button--colored pull-left">Create your account</button>
              <button id="loginFormBtn" className="section-button mdl-button mdl-button--raised mdl-button--accent pull-right">Login</button>
            </div>

            {/* <!-- Welcome/Main Button Form */}
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

const domContainer = document.querySelector('#root');
ReactDOM.render(<App />, domContainer);
