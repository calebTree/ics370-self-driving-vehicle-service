'use strict';

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";

// firebase
import Firebase, { FirebaseContext } from './components/firebase';

let emulate = true;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  handleClick() {
    console.log("you ciicked google sign in/out");
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
          <Route path="/register" component={SignUpPage}/>
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

const SignUpPage = () => (
  <div className="mdl-layout">
    <section className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div className="mdl-card__supporting-text">
        <h3>Create Account</h3>
        <FirebaseContext.Consumer>
          {firebase => <SignUpForm firebase={firebase} />}
        </FirebaseContext.Consumer>
      </div>
    </section>
  </div>
);

const INITIAL_STATE = {
  fName: '',
  lName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  onSubmit = event => {
    const { email, passwordOne } = this.state; 
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        console.log(authUser.email + " created");
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
              <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
            </div>
          </div>
        </div>
        <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
        {error && <p>{error.message}</p>}
      </form>
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
// if(emulate)
  // connectAuthEmulator(getAuth(), "http://localhost:9099");

// initFirebaseAuth();

const domContainer = document.querySelector('#root');
ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </FirebaseContext.Provider>,
domContainer);
