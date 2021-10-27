'use strict';

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect, withRouter, Router } from "react-router-dom";

// firebase
import { withFirebase } from './components/firebase';
import Firebase, { FirebaseContext } from './components/firebase';
// import { AuthUserContext } from './components/session';

// components
import { BookNowPage, BookLaterPage } from './components/booking';

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
        style= {{ backgroundImage: `url(${addSizeToGoogleProfilePic(this.getProfilePicUrl())})` }}
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
    const SignOutButton = withFirebase(this.SignOutButton);
    const GoogleSignInButton = withFirebase(this.GoogleSignInButton);
    const ProfilePic = this.state.authUser ? this.profileElement : null;
    const displayName = this.state.authUser 
      ? <div>{this.state.authUser.displayName}</div>
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
              { this.state.authUser ? <ProfilePic /> : null }
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
          <Route exact path="/welcome"  render={props => (<Welcome state={this.state}/>)} />
          <Route path="/register" component={SignUpPage} />
          <Route path="/login" component={SignInPage} />
          <Route path="/booking/now" component={BookNowPage} />
          <Route path="/booking/later" component={BookLaterPage} />
          <Redirect to="/" />
        </Switch>
      </div>
    )
  }
}

const App =  withRouter(withFirebase(Home));

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
            { authUser 
              ? <div id="main-buttons" className="mdl-grid">
                  <div className="mdl-typography--text-center">
                    <div className="hmcontent">
                      <h2>Welcome Back <span hidden className="user-name"></span></h2>
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

const SignUpPage = () => (
  <div className="mdl-layout">
    <section className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div className="mdl-card__supporting-text">
        <h3>Create Account</h3>
          <SignUpForm />
      </div>
    </section>
  </div>
);

const SIGN_UP_INITIAL_STATE = {
  fName: '',
  lName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...SIGN_UP_INITIAL_STATE
    };
  }

  // load mdl-js* classes
  componentDidMount() {
    componentHandler.upgradeDom();
  }

  onSubmit = event => {
    const { fName, lName, email, passwordOne } = this.state; 
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // console.log(authUser);
        this.setState({ ...SIGN_UP_INITIAL_STATE });
        this.props.history.push('/welcome');
      })
      .catch(error => {
        this.setState({ error });
        console.log(error.message);
      }); 
    event.preventDefault();
  };

  onChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const {
      fName,
      lName,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    fName === '' || lName === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div id="name">
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input name="fName" className="mdl-textfield__input" type="text" value={fName} onChange={this.onChange} required />
            <label className="mdl-textfield__label" htmlFor="first-name">First Name</label>
          </div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input name="lName" className="mdl-textfield__input" type="text" value={lName} onChange={this.onChange} required />
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
              <input name="email" className="mdl-textfield__input" type="email" value={email} onChange={this.onChange} required />
              <label className="mdl-textfield__label" htmlFor="regEmail">E-mail / Username</label>
            </div>
          </div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input name="passwordOne" className="mdl-textfield__input" type="password" value={passwordOne} onChange={this.onChange} required />
              <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
            </div>
          </div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input name="passwordTwo" className="mdl-textfield__input" type="password" value={passwordTwo} onChange={this.onChange} required />
              <label className="mdl-textfield__label" htmlFor="regPass">Veryify Password</label>
            </div>
          </div>
        </div>
        <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const SignInPage = () => (
  <div className="mdl-layout">
    <section id="login" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div className="mdl-card__supporting-text">
        <h3>Login</h3>
        <SignInForm />
      </div>
    </section>
  </div>
);

const SIGN_IN_INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...SIGN_IN_INITIAL_STATE };
  }

  componentDidMount(){
    componentHandler.upgradeDom();
  }

  onSubmit = event => {
    const { email, password } = this.state; 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        // console.log("signed in " + this.state.email);
        this.setState({ ...SIGN_IN_INITIAL_STATE });
        this.props.history.push('/welcome');
      })
      .catch(error => {
        this.setState({ error });
      }); 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <div id="name">
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input name="email" value={email} onChange={this.onChange} className="mdl-textfield__input" type="text" required />
            <label className="mdl-textfield__label" htmlFor="username">Email / Username</label>
          </div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input name="password" value={password} onChange={this.onChange} className="mdl-textfield__input" type="password" required />
            <label className="mdl-textfield__label" htmlFor="loginPass">Password</label>
          </div>
        </div>
        <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Submit</button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

const SignInForm = withRouter(withFirebase(LoginFormBase));

const domContainer = document.querySelector('#root');
ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FirebaseContext.Provider>,
domContainer);
