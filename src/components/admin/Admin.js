import React from "react";

import { withAuthorization } from '../session';

// material design component
import { MDCSnackbar } from '@material/snackbar';
import { GeneralSnackBar } from '../mdc-components';

const AdminPage = (props) => (
    <div>
        <section className="content mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Admin page</h2>
            </div>
            <AdminForm />
        </section>
        <GeneralSnackBar />
    </div>
);

const INITIAL_STATE = {
    vehicleType: '',
    error: null,
};

class AdminFormBase extends React.Component {
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
        const { vehicleType } = this.state;
        vehicleType 
        ?
            this.props.firebase
                .doAddVehicle(vehicleType)
                .then(authUser => {
                    // MDC Component
                    this.state.mdcComponent.labelText = "Vehicle added.";
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
                <div className="mdl-textfield mdl-js-textfield getmdl-select">
                    <input type="text" value="" className="mdl-textfield__input" id="sample1" readOnly />
                    <input type="hidden" value="" name="sample1" />
                    <label htmlFor="sample1" className="mdl-textfield__label">Vehicle Type</label>
                    <ul htmlFor="sample1" className="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                        <li className="mdl-menu__item" data-val="car">Car</li>
                        <li className="mdl-menu__item" data-val="trk">Truck</li>
                        <li className="mdl-menu__item" data-val="bus">Bus</li>
                    </ul>
                </div>
                <div>
                    <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="blue">
                        <input type="radio" id="blue" className="mdl-radio__button" name="color" value="1" defaultChecked />
                        <span className="mdl-radio__label">Blue</span>
                    </label>
                    <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="green">
                        <input type="radio" id="green" className="mdl-radio__button" name="color" value="2" />
                        <span className="mdl-radio__label">Green</span>
                    </label>
                </div>
                <button type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Add Vehicle</button>
            </form>
        );
    }
}

const condition = authUser => !!authUser;

const AdminForm = withAuthorization(condition)(AdminFormBase);

export { AdminForm };

export default AdminPage;
