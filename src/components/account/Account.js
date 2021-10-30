import React from "react";

import { withFirebase } from '../firebase';

import { withRouter } from "react-router-dom";

// import { AuthUserContext } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';

const AccountPage = () => (
    <div className="mdl-layout">
        <section id="scheduleForm" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
            <div className="mdl-card__supporting-text">
                <h3>Account</h3>
                <AccountForm />
            </div>
        </section>
    </div>
);

const SnackBar = (props) => (
    <div>
        <aside className="mdc-snackbar">
            <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div className="mdc-snackbar__label" aria-atomic="false">
                    Display name is now: {props.value ? props.value : "null"}.
                </div>
                <div className="mdc-snackbar__actions" aria-atomic="true">
                    <button type="button" className="mdc-button mdc-snackbar__action">
                        <div className="mdc-button__ripple"></div>
                        <span className="mdc-button__label">Close</span>
                    </button>
                    {/* <button type="button" className="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss">close</button> */}
                </div>
            </div>
        </aside>
    </div>
)

const INITIAL_STATE = {
    error: null,
    mdcComponent: null,
};

class AccountFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            email: '',
            passwordOne: '',
            passwordTwo: '',
            ...INITIAL_STATE
        }
    }
    
    componentDidMount() {
        // load mdl-js* classes
        componentHandler.upgradeDom();

        // MDC Component
        const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        this.setState({mdcComponent: snackbar});
    }
    
    onSubmit = (event) => {
        const { displayName } = this.state;
        this.props.firebase
            .doUpdateProfile(displayName)
            .then(authUser => {
                this.props.history.push({displayName: authUser.displayName});
                // MDC Component
                this.state.mdcComponent.open();
            })
            .catch(error => {
                this.setState({ error });
                this.state.mdcComponent.actionButtonText = "Close";
                this.state.mdcComponent.labelText = error;
                // console.log(error.message);
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
            displayName,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        // const isInvalid =
        // passwordOne !== passwordTwo ||
        // passwordOne === '' ||
        // email === '' ||
        // fName === '' || lName === '';

        return (
            <form onSubmit={this.onSubmit}>
                <div className='wrapper' id="name">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input name="displayName" className="mdl-textfield__input" type="text" value={displayName} onChange={this.onChange} />
                        <label className="mdl-textfield__label" htmlFor="displayName">Display Name</label>
                    </div>
                </div>
                <div id ="contact">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input disabled id="phone" className="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="mobile" />
                        <label className="mdl-textfield__label" htmlFor="phone">Mobile Phone</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input disabled name="email" className="mdl-textfield__input" type="email" value={email} onChange={this.onChange} />
                        <label className="mdl-textfield__label" htmlFor="regEmail">Email / Username</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input disabled name="passwordOne" className="mdl-textfield__input" type="password" value={passwordOne} onChange={this.onChange} />
                        <label className="mdl-textfield__label" htmlFor="regPass">Password</label>
                    </div>
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input disabled name="passwordTwo" className="mdl-textfield__input" type="password" value={passwordTwo} onChange={this.onChange} />
                        <label className="mdl-textfield__label" htmlFor="regPass">Veryify Password</label>
                    </div>
                </div>
                <button type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Update Profile</button>
                {/* <button disabled={isInvalid} type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Update Profile</button> */}
                {error && <p>{error.message}</p>}
                <SnackBar value={this.state.displayName} />
            </form>
        );
    }
}

export default AccountPage;
 
const AccountForm = withRouter(withFirebase(AccountFormBase));
 
export { AccountForm };
