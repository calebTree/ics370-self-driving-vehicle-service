import React from "react";

// components
import { withAuthorization } from '../session';

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { MDCSnackbar } from '@material/snackbar';
import { LinearProgress, GeneralSnackBar } from '../mdc-components';

const BookLaterPage = () => (
  <div>
    <LinearProgress />
    <section className="content mdl-card mdl-shadow--2dp">
      <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Book a Future Ride</h2>
        </div>
      <div className="mdl-grid">
        <BookLaterForm />
      </div>
      <GeneralSnackBar />
    </section>
  </div>
);

const INITIAL_STATE = {
  date: "",
  time: "",
  vehicleOptions: null,
  vehicleType: "cars",
  chosenOptions: null,
};

class BookLaterFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcSnackbar: null,
      ...INITIAL_STATE
    }
  }

  componentDidMount() {
    // componentHandler defined by mdl js
    componentHandler.upgradeDom();
    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcProgress: linearProgress });
    // linearProgress.open();
    // setup snackbar
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    this.setState({ mdcSnackbar: snackbar });

    this.props.firebase
      .doGetVehicleOptions("cars")
        .then((data) => {
          const options = data.vehiclesAvailable;
          this.setState({
            vehicleOptions: options,
            chosenOptions: options[0],
          })
        })
        .catch((error) => {

        })
  }

  onChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  getVehicles = event => {
    const value = event.target.value;
    this.props.firebase
      .doGetVehicleOptions(value)
        .then((data) => {
          const options = data.vehiclesAvailable;
          this.setState({
            vehicleOptions: options,
            chosenOptions: options[0],
            vehicleType: value,
          })
        })
        .catch((error) => {
          // console.log(error.message)
          this.setState({
            vehicleOptions: null,
            chosenOptions: null,
            vehicleType: value,
          })
        })
  }

  onSubmit = (event) => {
    const { date, time, vehicleType, chosenOptions } = this.state;
    const options = chosenOptions.color + " " + chosenOptions.fuel;
    const type = vehicleType;
    const vehicle = { type, options }
    if(date === '' || time === '') {
      this.state.mdcSnackbar.labelText = "Please complete the form.";
      this.state.mdcSnackbar.open();
    } else {
      this.props.firebase
        .doBookLater(date, time, vehicle)
          .then(authUser => {
              // MDC Component
              this.state.mdcSnackbar.labelText = "Booking added.";
              this.state.mdcSnackbar.open();
          })
          .catch(error => {
              // this.setState({ error });
              console.log(error.message);
              this.state.mdcSnackbar.labelText = error;
              this.state.mdcSnackbar.open();
          })
    }
    event.preventDefault();
  };

  render() {
    // console.log(this.state)
    let vehicleOptions = [];
    const options = this.state.vehicleOptions;
    if(options) {
      for(let i = 0; i < options.length; i++) {
        vehicleOptions.push(
          <option key={i} value={options[i].color + " " + options[i].fuel}>
            {options[i].color + " " + options[i].fuel}
          </option>
        )
      }
    }
    return(
      <form onSubmit={this.onSubmit}>
        <div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label section-button">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input id="date" name="date" onChange={this.onChange} className="mdl-textfield__input" type="date" />
            </div>
          </div>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label section-button">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input id="time" name="time" onChange={this.onChange} className="mdl-textfield__input" type="time" />
            </div>
          </div>
        </div>
        <div>
        <div>Car Type:</div>
          <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="car">
              <input type="radio" id="car" className="mdl-radio__button" name="vehicleType" onClick={this.getVehicles} value="cars" defaultChecked />
              <span className="mdl-radio__label">Car</span>
          </label>
          <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="truck">
              <input type="radio" id="truck" className="mdl-radio__button" name="vehicleType" onClick={this.getVehicles} value="trucks" />
              <span className="mdl-radio__label">Truck</span>
          </label>
          <label className="section-button mdl-radio mdl-js-radio mdl-js-ripple-effect" htmlFor="bus">
              <input type="radio" id="bus" className="mdl-radio__button" name="vehicleType" onClick={this.getVehicles} value="busses" />
              <span className="mdl-radio__label">Bus</span>
          </label>
        </div>
        <div>
          <div>
            <label htmlFor="vehicleOptions">Choose a vehicle: </label>
            <select id="vehicleOptions" name="chosenOptions" onChange={this.onChange}>
              {vehicleOptions.length > 0 ? vehicleOptions : <option disabled>none available</option>}
            </select>
          </div>
        </div>
        <button className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored pull-left">Submit</button>
      </form>
    )
  }
}

const condition = authUser => !!authUser;

const BookLaterForm = withAuthorization(condition)(BookLaterFormBase);

export { BookLaterForm };

export default BookLaterPage;