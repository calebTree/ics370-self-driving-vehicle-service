// react
import React from "react";
import { withRouter } from "react-router-dom";

// firebase
import { withFirebase } from '../firebase';

// material design component
import { MDCBanner } from '@material/banner';
import { RegisterBanner } from '../mdc-components';

const SignUpPage = (props) => (
    <div className="mdl-layout">
      <RegisterBanner />
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
    mdcComponent: null,
  };
  
  class SignUpFormBase extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ...SIGN_UP_INITIAL_STATE
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
      const { email, passwordOne } = this.state;
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          // console.log(authUser);
          this.setState({ ...SIGN_UP_INITIAL_STATE });
          this.props.history.push('/welcome');
        })
        .catch(error => {
          this.setState({ error });
          this.state.mdcComponent.setText(error.message);
          this.state.mdcComponent.open();
          // console.log(error.message);
        });
      event.preventDefault();
    };
  
    onChange = event => {
      this.state.mdcComponent.close();
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
        email === '';
  
      return (
        <div>
          <form onSubmit={this.onSubmit}>
            {/* <div id="name">
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input name="fName" className="mdl-textfield__input" type="text" value={fName} onChange={this.onChange} />
                <label className="mdl-textfield__label" htmlFor="first-name">First Name</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input name="lName" className="mdl-textfield__input" type="text" value={lName} onChange={this.onChange} />
                <label className="mdl-textfield__label" htmlFor="last-name">Last Name</label>
              </div>
            </div> */}
            <div id="contact">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="email" className="mdl-textfield__input" type="email" value={email} onChange={this.onChange} required />
                    <label className="mdl-textfield__label" htmlFor="regEmail">E-mail / Username</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="passwordOne" className="mdl-textfield__input" type="password" value={passwordOne} onChange={this.onChange} required />
                    <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
                </div>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="passwordTwo" className="mdl-textfield__input" type="password" value={passwordTwo} onChange={this.onChange} required />
                    <label className="mdl-textfield__label" htmlFor="regPass">Veryify Password</label>
                </div>
            </div>
            <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Register</button>
            {/* {error && <p>{error.message}</p>} */}
          </form>
        </div>
      )
    }
  }

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export { SignUpForm };

export default SignUpPage;
  