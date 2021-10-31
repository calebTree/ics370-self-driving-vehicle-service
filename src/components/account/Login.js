import React from "react";
import { withRouter } from "react-router";
// firebase
import { withFirebase } from "../firebase";
// material design component
import { MDCSnackbar } from '@material/snackbar';
import { AccountSnackBar } from '../mdc-components';

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

const INITIAL_STATE = {
    email: '',
    password: '',
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
        const { email, password } = this.state;
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                // console.log("signed in " + this.state.email);
                this.setState({ ...INITIAL_STATE });
                this.props.history.push('/welcome');
            })
            .catch(error => {
                // this.setState({ error });
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
                <AccountSnackBar />
            </form>
        )
    }
}

const SignInForm = withRouter(withFirebase(LoginFormBase));

export default SignInPage;
