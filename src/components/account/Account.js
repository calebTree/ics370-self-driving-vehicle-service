import React from "react";

import { withAuthorization } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { GeneralSnackBar } from '../mdc-components';

const AccountPage = (props) => (
    <div>
        <section className="content mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Account Update Form</h2>
            </div>
            <AccountForm />
        </section>
        <GeneralSnackBar />
    </div>
);

const INITIAL_STATE = {
    displayName: '',
    error: null,
    isAdmin: '',
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

        this.listener = this.props.firebase.doAuthStateChanged(authUser => {
            authUser
                ? this.props.firebase.doReadAccount().then(data => {
                    this.setState({ isAdmin: data.role });
                    console.log(this.state.isAdmin);
                })
                : this.setState({ isAdmin: null });
        });
    }

    componentWillUnmount() {
        this.listener();
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

        // console.log(this.state.isAdmin);

        this.setState({
            [name]: value
        });
    }

    render() {
        const isAdmin = this.state.isAdmin === "admin" ? true : false;
        return (
            <form onSubmit={this.onSubmit}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="displayName" className="mdl-textfield__input" value={this.state.displayName} type="text" onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="displayName">Enter a new display name.</label>
                </div>
                <div>
                    <label className="switch" htmlFor="isAdmin">
                        <input name="isAdmin" type="checkbox" id="isAdmin" onChange={this.onChange} checked={isAdmin} />
                        <span className="slider round"></span>
                    </label>
                    <span className="label">Toggle System Admin</span>
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
