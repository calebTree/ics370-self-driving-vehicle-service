// react
import React from "react";
import { withRouter } from "react-router-dom";

// firebase
import { withFirebase } from '../firebase';

// material design component
import { MDCBanner } from '@material/banner';
import { FormErrorBanner } from '../mdc-components';

const SignUpPage = (props) => (
  <div>
    <FormErrorBanner />
    <section className="content mdl-card mdl-shadow--2dp">
      <div>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Create Account</h2>
        </div>
        <SignUpForm />
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
    mdcComponent: null,
  };
  
  class SignUpFormBase extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ...INITIAL_STATE
      };
    }
  
    componentDidMount() {
      // load mdl-js* classes
      componentHandler.upgradeDom();
  
      // MDC Component
      const banner = new MDCBanner(document.querySelector('.mdc-banner'));
      this.setState({ mdcComponent: banner });
    }
  
    onSubmit = event => {
      const { mdcComponent, email, passwordOne, fName, lName } = this.state;
      const firebase =  this.props.firebase;
      const history = this.props.history;

      firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            if(fName + " " + lName != " ")
              firebase
                .doUpdateProfile((fName + " " + lName).trim())
                  .then(authUser => {
                    history.push('/welcome');
                  })
                  .catch(error => {
                    // this.setState({ error });
                    mdcComponent.setText(error.message);
                  });
            this.setState({ ...INITIAL_STATE });
            firebase.setLastLogin();
            history.push('/welcome');
          })
            .catch(error => {
              // this.setState({ error });
              mdcComponent.setText(error.message);
              mdcComponent.open();
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
      // close fixit banner
      this.state.mdcComponent.close();
    }
  
    render() {
      const {
        fName,
        lName,
        email,
        passwordOne,
        passwordTwo,
      } = this.state;
  
      const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '';
  
      return (
        <div>
          <form onSubmit={this.onSubmit}>
            <div id="name">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input name="fName" className="mdl-textfield__input" type="text" value={fName} onChange={this.onChange} />
                <label className="mdl-textfield__label" htmlFor="first-name">First Name</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input name="lName" className="mdl-textfield__input" type="text" value={lName} onChange={this.onChange} />
                <label className="mdl-textfield__label" htmlFor="last-name">Last Name</label>
              </div>
            </div>
            <div id="contact">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input name="email" className="mdl-textfield__input" type="email" value={email} onChange={this.onChange} required />
                <label className="mdl-textfield__label" htmlFor="regEmail">E-mail / Username</label>
              </div>
            </div>
            <div id="password">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password">
                <input name="passwordOne" className="mdl-textfield__input" type="password" value={passwordOne} onChange={this.onChange} required />
                <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label password">
                <input name="passwordTwo" className="mdl-textfield__input" type="password" value={passwordTwo} onChange={this.onChange} required />
                <label className="mdl-textfield__label" htmlFor="regPass">Veryify Password</label>
              </div>
            </div>
            <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
            {passwordOne !== passwordTwo ? <span>passwords must match</span> : null}
          </form>
        </div>
      )
    }
  }

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export { SignUpForm };

export default SignUpPage;
  