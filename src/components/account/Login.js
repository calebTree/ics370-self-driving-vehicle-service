import React from "react";
import { withRouter } from "react-router";
// firebase
import { withFirebase } from "../firebase";
// material design component
import { MDCSnackbar } from '@material/snackbar';
import { GeneralSnackBar } from '../mdc-components';

const SignInPage = () => (
    <div>
        <section className="content mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Login</h2>
            </div>
            <div>
                <SignInForm />
            </div>
        </section>
        <GeneralSnackBar />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    loginType: 'user',
    error: null,
    mdcComponent: null,
};

class LoginFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        componentHandler.upgradeDom();
        // MDC Component
        const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        this.setState({ mdcComponent: snackbar });
    }

    onSubmit = event => {
        const { email, password, loginType } = this.state;
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password, loginType)
            .then(() => {
                // console.log("signed in " + this.state.email);
                this.setState({ ...INITIAL_STATE });
                this.props.history.push('/welcome');
            })
            .catch(error => {
                // this.setState({ error });
                console.log(error.message);
                this.state.mdcComponent.labelText = error.message;
                this.state.mdcComponent.open();
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
                <div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input id="email" name="email" value={email} onChange={this.onChange} className="mdl-textfield__input" type="text" required />
                        <label className="mdl-textfield__label" htmlFor="email">Email / Username</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input id="password" name="password" value={password} onChange={this.onChange} className="mdl-textfield__input" type="password" required />
                        <label className="mdl-textfield__label" htmlFor="password">Password</label>
                    </div>
                </div>
                <div>
                    <div>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="user">
                            <input className="mdl-radio__button" id="user" onChange={this.onChange} name="loginType" type="radio" value="user" defaultChecked/>
                            <span className="mdl-radio__label">User</span>
                        </label>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="admin">
                            <input className="mdl-radio__button" id="admin" onChange={this.onChange} name="loginType" type="radio" value="admin" />
                            <span className="mdl-radio__label">Admin</span>
                        </label>
                    </div>
                </div>
                <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left" data-upgraded=",MaterialButton">Submit</button>
            </form>
        )
    }
}

const SignInForm = withRouter(withFirebase(LoginFormBase));

export default SignInPage;
