import React from "react";

import { withAuthorization } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { MDCLinearProgress } from '@material/linear-progress';
import { GeneralSnackBar, LinearProgress } from '../mdc-components';

const AccountPage = (props) => (
    <div>
        <LinearProgress />
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
};

class AccountFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdcComponent: null,
            mdcProgress: null,
            isAdmin: false,
            ...INITIAL_STATE
        }
    }

    componentDidMount() {
        // load mdl-js* classes
        componentHandler.upgradeDom();

        // setup linear progress bar
        const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
        linearProgress.close();
        linearProgress.determinate = false;
        this.setState({ mdcProgress: linearProgress });
        linearProgress.open();

        // MDC Component
        const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
        this.setState({ mdcComponent: snackbar });

        this.listener = this.props.firebase.doAuthStateChanged(authUser => {
            authUser
                ? this.props.firebase.doReadAccount()
                    .then(data => {
                        if(data.role === "admin")
                            this.setState({ isAdmin: true });
                        linearProgress.close();
                    }).catch((error) => {
                        // console.log(error.message);
                        linearProgress.close();
                    })
                : this.setState({ data: '' });
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

    changeRole = (event) => {
        this.state.mdcProgress.open();
        const role = event.target.checked ? "admin" : "user";
        this.props.firebase.doUpdateRole(role)
            .then(() => {
                this.setState({
                    isAdmin: (this.state.isAdmin == false),
                });
                this.state.mdcProgress.close();
        }).catch(() => {
            console.log("failed to change role");
            this.state.mdcProgress.close();
        });
    }

    onChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }

    render() {
        const isAdmin = this.state.isAdmin;
        return (
            <form onSubmit={this.onSubmit}>
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input name="displayName" className="mdl-textfield__input" value={this.state.displayName} type="text" onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="displayName">Enter a new display name.</label>
                </div>
                <div>
                    <div className="label">System Admin</div>
                    <label className="switch" htmlFor="isAdmin">
                        <input name="isAdmin" type="checkbox" id="isAdmin" onChange={this.changeRole} checked={isAdmin}/>
                        <span className="slider round"></span>
                    </label>
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
