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
    type: "car",
    color: "blue",
    fuel: "electric"
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

        this.listener = this.props.firebase.doAuthStateChanged(authUser => {
            if(authUser) {
              this.props.firebase.doReadAccount()
                .then(data => {
                    if(!(data.role === "admin"))
                        this.props.history.push("/welcome");
                }).catch((error) => {
                    // console.log(error.message);
                });
            }
        });
    }

    componentWillUnmount() {
        this.listener();
    }

    onSubmit = (event) => {
        const { type, color, fuel } = this.state;
        this.props.firebase
            .doAddVehicle(type, color, fuel)
                .then(authUser => {
                    // MDC Component
                    this.state.mdcComponent.labelText = "Vehicle added.";
                    this.state.mdcComponent.open();
                })
                .catch(error => {
                    // this.setState({ error });
                    this.state.mdcComponent.labelText = error;
                    this.state.mdcComponent.open();
                })
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
                <div className="grid-container">
                    <div>
                        <label htmlFor="type">Vehicle Type: </label>
                        <select id="type" name="type" onClick={this.onChange}>
                            <option value="car">Car</option>
                            <option value="truck">Truck</option>
                            <option value="bus">Bus</option>
                        </select>
                    </div>
                    <div>
                        <div>Vehicle Color:</div>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="blue">
                            <input type="radio" id="blue" className="mdl-radio__button" name="color" onClick={this.onChange} value="blue" defaultChecked />
                            <span className="mdl-radio__label">Blue</span>
                        </label>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="green">
                            <input type="radio" id="green" className="mdl-radio__button" name="color" onClick={this.onChange} value="green" />
                            <span className="mdl-radio__label">Green</span>
                        </label>
                    </div>
                    <div>
                        <div>Fuel Type:</div>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="electric">
                            <input type="radio" id="electric" className="mdl-radio__button" name="fuel" onClick={this.onChange} value="electric" defaultChecked />
                            <span className="mdl-radio__label">Electric</span>
                        </label>
                        <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="petrol">
                            <input type="radio" id="petrol" className="mdl-radio__button" name="fuel" onClick={this.onChange} value="petrol" />
                            <span className="mdl-radio__label">Petrol</span>
                        </label>
                    </div>
                    <div>
                        <button type="submit" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Add Vehicle</button>
                    </div>
                </div>
            </form>
        );
    }
}

const condition = authUser => !!authUser;

const AdminForm = withAuthorization(condition)(AdminFormBase);

export { AdminForm };

export default AdminPage;
