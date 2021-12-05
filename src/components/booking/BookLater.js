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
  vehicle: ""
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
    }

    onChange = event => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }

    onSubmit = (event) => {
      const { date, time, vehicle } = this.state;
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
      event.preventDefault();
    };

    render() {
        return(
          <form onSubmit={this.onSubmit}>
            <div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="date" name="date" onChange={this.onChange} className="mdl-textfield__input" type="date" />
                  {/* to-do: mdl lable overlaps HTML lable */}
                  {/* <label className="mdl-textfield__label" htmlFor="pickDate">Pick your ride date</label> */}
                </div>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                  <input id="time" name="time" onChange={this.onChange} className="mdl-textfield__input" type="time" />
                  {/* to-do: mdl lable overlaps HTML lable */}
                  {/* <label className="mdl-textfield__label" htmlFor="pickTime">Enter your pick up time</label> */}
                </div>
              </div>
            </div>
            <div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <select id="schServ" className="mdl-textfield__input" name="service">
                  <option></option>
                </select>
                <label className="mdl-textfield__label" htmlFor="schServ">Choose your service</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <select id="carType" className="mdl-textfield__input" name="carType">
                  <option></option>							
                </select>
                <label className="mdl-textfield__label" htmlFor="carType">Select your luxury car</label>
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