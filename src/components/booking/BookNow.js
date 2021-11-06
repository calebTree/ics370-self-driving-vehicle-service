import React from 'react'

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

// firebase
import { withFirebase } from "../firebase";

// map
import { MyGoogleMap } from "../maps";

class BookNowFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcComponent: null,
      map: <MyGoogleMap />,
      dropoff: '',
      pickup: '',
    };
  }

  componentDidMount() {
    // defined by mdl js
    componentHandler.upgradeDom();
    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcComponent: linearProgress });
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
    const pickup = this.state.pickup;
    const dropoff = this.state.dropoff;
    this.state.mdcComponent.open();
    this.props.firebase.doBookNow(pickup, dropoff);
    // this.props.firebase.doReadBooking();
    this.setState({ map: <MyGoogleMap origin={pickup} destination={dropoff} /> });
    
    setTimeout(() => this.state.mdcComponent.close(), 1000);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <LinearProgress />
        <section className="content mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Book A Ride Now</h2>
          </div>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
              <form onSubmit={this.onSubmit}>
                <div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label mdl-textfield--full-width">
                    <select className="mdl-textfield__input" name="service">
                      <option>Basic</option>
                      <option>Deluxe</option>
                    </select>
                    <label className="mdl-textfield__label" htmlFor="service">Choose your service</label>
                  </div>
                </div>
                <div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="text" name="pickup" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="pickup">Pickup location</label>
                  </div>
                </div>
                <div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="text" name="dropoff" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="dropoff">Drop of location</label>
                  </div>
                </div>
                <button className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
              </form>
            </div>
            <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
              {/* <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Location</h2>
              </div> */}
              {this.state.map}
            </div>
          </div>
        </section>
      </div>
    )
  }
}

const BookNowPage = withFirebase(BookNowFormBase);

export default BookNowPage;
