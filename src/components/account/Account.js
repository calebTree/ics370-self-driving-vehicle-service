import React from "react";

import { withAuthorization } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { AccountSnackBar } from '../mdc-components';

const AccountPage = (props) => (
    <div className="mdl-layout">
        <section id="scheduleForm" className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
            <div className="mdl-card__supporting-text">
                <h3>Account Update Form</h3>
                <AccountForm />
            </div>
        </section>
    </div>
);

const INITIAL_STATE = {
    error: null,
    mdcComponent: null,
};

class AccountFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    componentDidMount() {
        // load mdl-js* classes
        componentHandler.upgradeDom();

        // MDC Component
        const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        this.setState({ mdcComponent: snackbar });
    }

    onSubmit = (event) => {
        const { displayName } = this.state;
        displayName 
        ?
            this.props.firebase
                .doUpdateProfile(displayName)
                .then(authUser => {
                    this.props.history.push({ displayName: authUser.displayName });
                    // MDC Component
                    this.state.mdcComponent.labelText = displayName + " is your new display name.";
                    this.state.mdcComponent.open();
                    return;
                })
                .catch(error => {
                    // this.setState({ error });
                    this.state.mdcComponent.labelText = error;
                    return;
                })
        :
                this.state.mdcComponent.labelText = "Please complete the form.";
                this.state.mdcComponent.open();

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
        return (
            <form onSubmit={this.onSubmit}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="displayName" className="mdl-textfield__input" type="text" onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="displayName">Enter a new display name.</label>
                </div>
                <button type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Update Profile</button>
                <AccountSnackBar />
            </form>
        );
    }
}

const condition = authUser => !!authUser;

const AccountForm = withAuthorization(condition)(AccountFormBase);

export { AccountForm };

export default AccountPage;
