'use strict';

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect, withRouter, Router } from "react-router-dom";

// firebase
import { withFirebase } from './components/firebase';
import Firebase, { FirebaseContext } from './components/firebase';

// components
import { BookNowPage, BookLaterPage } from './components/booking';
import { AccountPage, SignUpPage } from './components/account';
import { SignInPage } from './components/account';

// scss style
import "./style/mdc.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }

  getProfilePicUrl() {
    return this.state.authUser.photoURL || '/images/profile_placeholder.png';
  }

  profileElement = () => {
    function addSizeToGoogleProfilePic(url) {
      if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=150';
      }
      return url;
    }
    return (
      <div id="user-pic"
        style={{ backgroundImage: `url(${addSizeToGoogleProfilePic(this.getProfilePicUrl())})` }}
      ></div>
    )
  }

  getUserName() {
    return this.state.authUser.displayName;
  }

  componentDidMount() {
    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  SignOut = () => {
    this.props.firebase.doSignOut();
    this.props.history.push('/welcome');
  }

  SignOutButton = () => (
    <button type="button" onClick={this.SignOut} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
      Sign Out
    </button>
  );

  GoogleSignIn = async () => {
    await this.props.firebase.doGoogleSignIn();
    this.props.history.push('/welcome');
  }

  GoogleSignInButton = () => (
    <button onClick={this.GoogleSignIn} className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
      <i className="material-icons">account_circle</i>Sign-in with Google
    </button>
  );

  render() {
    const authUser = this.state.authUser;

    const condition = authUser => !!authUser;
    const SignOutButton = withFirebase(this.SignOutButton);
    const GoogleSignInButton = withFirebase(this.GoogleSignInButton);
    const ProfilePic = authUser ? this.profileElement : null;
    const displayName = authUser
      ? <div>{this.getUserName()}</div>
      : null
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
                {this.state.authUser ? <Link to="/account"><ProfilePic /></Link> : null}
                <div className="user-name">
                  {displayName}
                </div>
                {this.state.authUser
                  ? <SignOutButton />
                  : <GoogleSignInButton />
                }
              </div>
            </div>
          </header>
        </div>
        <Switch>
          <Route exact path="/" component={Greeting} />
          <Route exact path="/welcome" render={props => (<Welcome state={this.state} />)} />
          <Route path="/register" component={SignUpPage} />
          <Route path="/login" component={SignInPage} />
          <Route path="/booking/now" component={BookNowPage} />
          <Route path="/booking/later" component={BookLaterPage} />
          <Route path="/account" component={AccountPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    )
  }
}

const App = withRouter(withFirebase(Home));

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
  }

  render() {
    const authUser = this.props.state.authUser;
    return (
      <div className="mdl-layout">
        <section id="welcome-main" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div className="home_box">
            {authUser
              ? <div id="main-buttons" className="mdl-grid">
                <div className="mdl-typography--text-center">
                  <div className="hmcontent">
                    <h2>Welcome Back <span className="user-name">{authUser.displayName}</span></h2>
                  </div>
                  <Link to='/booking/now' className="section-button mdl-button mdl-button--raised mdl-button--accent">Book Now <i className="material-icons">hail</i></Link>
                  <Link to='/booking/later' className="section-button mdl-button mdl-button--raised mdl-button--colored">Book Later <i className="material-icons">departure_board</i></Link>
                </div>
              </div>
              : <div>
                <div className="hmlogo">
                  <span className="material-icons">directions_car</span>
                </div>
                <div className="hmcontent">
                  <p>For all your trips requiring a ride, we will get you there safely.</p>
                </div>
                <div className="homeReg">
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

const domContainer = document.querySelector('#root');
ReactDOM.render (
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FirebaseContext.Provider>,
  domContainer
);
