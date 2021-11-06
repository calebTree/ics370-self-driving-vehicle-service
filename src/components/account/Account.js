import React from "react";

import { withAuthorization } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { AccountSnackBar } from '../mdc-components';

const AccountPage = (props) => (
    <div>
        <section className="content mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Account Update Form</h2>
            </div>
            <AccountForm />
        </section>
        <AccountSnackBar />
    </div>
);

const INITIAL_STATE = {
    displayName: '',
    error: null,
};

class AccountFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdcComponent: null,
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
                    // MDC Component
                    this.state.mdcComponent.labelText = "Your new display name is: " + authUser.displayName;
                    this.state.mdcComponent.open();
                    this.setState({ ...INITIAL_STATE });
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
                    <input name="displayName" className="mdl-textfield__input" value={this.state.displayName} type="text" onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="displayName">Enter a new display name.</label>
                </div>
                <button type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Update Profile</button>
            </form>
        );
    }
}

const condition = authUser => !!authUser;

const AccountForm = withAuthorization(condition)(AccountFormBase);

export { AccountForm };

export default AccountPage;
