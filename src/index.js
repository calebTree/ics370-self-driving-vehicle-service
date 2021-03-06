'use strict';

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect, withRouter, Router } from "react-router-dom";

// firebase
import { withFirebase } from './components/firebase';
import Firebase, { FirebaseContext } from './components/firebase';

// components
import { BookNowPage, BookLaterPage, PricingPage, ConfirmPage } from './components/booking';
import { AccountPage, SignUpPage, SignInPage } from './components/account';
import { AdminPage } from './components/admin'

// style
import "./style/mdc.scss";
import "./style/custom-style.css";

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { MDCLinearProgress } from '@material/linear-progress';
import { GeneralSnackBar, LinearProgress } from './components/mdc-components';

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
    return this.state.authUser && this.state.authUser.displayName;
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
    const SignOutButton = withFirebase(this.SignOutButton);
    const GoogleSignInButton = withFirebase(this.GoogleSignInButton);
    const ProfilePic = authUser ? this.profileElement : null;
    // to-do: send this logic to a banner notification with a button to fix it.
    const displayName = this.getUserName() ? this.getUserName() : "<-- Click here to choose a display name.";
    return (
      <div>
        <div className="mdl-layout--fixed-header">
          <header className="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
            <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
              <div className="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                <h1>
                  {/* home link brings user to welcome when logged in or greeting when logged out*/}
                  { authUser ? <Link to="/welcome"><i className="material-icons">directions_car</i> FAV-RIDE ???</Link> :
                  <Link to="/"><i className="material-icons">directions_car</i> FAV-RIDE ???</Link> }
                </h1>
              </div>
              <div id="user-container">
                { authUser ? <Link to="/account"><ProfilePic /></Link> : null}
                <div className="user-name">
                  { authUser ? displayName : null }
                </div>
                { authUser
                  ? <SignOutButton />
                  : <GoogleSignInButton />
                }
              </div>
            </div>
          </header>
        </div>
        <Switch>
          <Route exact path="/" component={Greeting} />
          <Route exact path="/welcome" render={props => (<Welcome state={this.state} firebase={this.props.firebase} />)} />
          <Route path="/register" component={SignUpPage} />
          <Route path="/login" component={SignInPage} />
          <Route path="/account" component={AccountPage} />
          <Route path="/booking/now" component={BookNowPage} />
          <Route path="/booking/later" component={BookLaterPage} />
          <Route path="/booking/pricing" component={PricingPage} />
          <Route path="/booking/confirm" component={ConfirmPage} />
          <Route path="/admin" component={AdminPage} />
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
      <section className="content mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Welcome to FAV-RIDE ???</h2>
        </div>
        <div>
          <div className="mdl-card__supporting-text">
            FAV-RIDE is the future of transportation using F-ully A-utonomous V-ehicles.
            Brought to you by Metro State, Fall 2021 ICS370, Team 2:
          </div>
          
          <br />
          Caleb Anderson:
          <a href="mailto:caleb.anderson@my.metrostate.edu">caleb.anderson@my.metrostate.edu</a>
          <br />
          Arielle Hounton:
          <a href="mailto:arielle.hounton@my.metrostate.edu">arielle.hounton@my.metrostate.edu</a>
          {/* <br />
          Youssoufou Kante:
          <a href="mailto:youssoufou.kante@my.metrostate.edu">youssoufou.kante@my.metrostate.edu</a> */}
          <br />
          Jonathan Bracamontes:
          <a href="mailto:jonathan.bracamontes@my.metrostate.edu">jonathan.bracamontes@my.metrostate.edu</a>
          <br />
          <br />
          <div>
            <Link to="/welcome" className="section-button mdl-button mdl-js-button mdl-button--raised" >Continue</Link>
          </div>
        </div>
      </section>
    )
  }
}

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
    }
  }

  componentDidMount() {
    // load mdl-js* classes
    // componentHandler.upgradeDom();

    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcProgress: linearProgress });

    // MDC Component
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    this.setState({ mdcComponent: snackbar });

    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      if(authUser) {
        linearProgress.open();
        this.props.firebase.doReadAccount()
          .then(data => {
              if(data.role === "admin")
                  this.setState({ isAdmin: true });
              linearProgress.close();
          }).catch((error) => {
              // console.log(error.message);
              linearProgress.close();
          });
      } else {
        this.setState({ data: '' });
        linearProgress.close();
      }
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const authUser = this.props.state.authUser;
    const adminPage = this.state.isAdmin ? <Link to='/admin' className="section-button mdl-button mdl-button--raised">Admin Page</Link> : null;
    return (
      <div>
        <LinearProgress />
        <section className="content mdl-card mdl-shadow--2dp">
            {authUser
              ? 
              <div>
                <div className="mdl-card__title">
                  <h2 className="mdl-card__title-text">Welcome Back: {authUser.displayName ? authUser.displayName : "empty"}</h2>
                </div>
                  <Link to='/booking/now' className="section-button mdl-button mdl-button--raised mdl-button--accent">Book Now <i className="material-icons">hail</i></Link>
                  <Link to='/booking/later' className="section-button mdl-button mdl-button--raised mdl-button--colored">Book Later <i className="material-icons">departure_board</i></Link>
                  {adminPage}
              </div>
              : 
              <div>
                <div className="hmlogo">
                  <span className="material-icons">directions_car</span>
                </div>
                <div className="mdl-card__supporting-text">
                  For all your trips requiring a ride, we will get you there safely.
                </div>                
                <div className="homeReg">
                  <Link to='/register' className="section-button mdl-button mdl-button--raised mdl-button--colored pull-left">Create your account</Link>
                  <Link to='/login' className="section-button mdl-button mdl-button--raised mdl-button--accent pull-right">Login</Link>
                </div>
              </div>
            }
        </section>
        <GeneralSnackBar />
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
