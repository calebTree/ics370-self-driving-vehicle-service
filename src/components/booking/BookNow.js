import React from 'react'
import { Link } from "react-router-dom";

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { MDCBanner } from '@material/banner';
import { MDCSnackbar } from '@material/snackbar';
import { LinearProgress, FormErrorBanner, GeneralSnackBar } from '../mdc-components';

// firebase
import { withFirebase } from "../firebase";
import { withAuthorization } from '../session';

// google maps
import { MyGoogleMap } from "../maps";

const INITIAL_STATE = {
  map: <MyGoogleMap markers={null} />,
  pickup: '',
  dropoff: '',
  distance: '',
  rate: '',
  price: '',
  ready: false
}

class BookNowFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcProgress: null,
      mdcBanner: null,
      mdcSnackbar: null,
      ...INITIAL_STATE
    };
  }

  componentDidMount() {
    // componentHandler defined by mdl js
    componentHandler.upgradeDom();
    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcProgress: linearProgress });
    linearProgress.open();
    // setup banner
    const banner = new MDCBanner(document.querySelector('.mdc-banner'));
    this.setState({ mdcBanner: banner });
    // setup snackbar
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    this.setState({ mdcSnackbar: snackbar });

    // check if plan already exists
    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.props.firebase.doReadBooking().then(data => {
          // console.log("mount doRead success");
          if (data) { // if data found populate travel overview
            const markers = {
              origin: data.origin,
              destination: data.destination
            }
            this.setState({
              pickup: data.origin,
              dropoff: data.destination,
              distance: data.distance,
              price: data.price,
              map: <MyGoogleMap markers={markers} />,
              ready: true
            })
            // this.state.mdcSnackbar.labelText = this.state.pickup + " to " + this.state.dropoff + " found.";
            this.state.mdcSnackbar.labelText = "Previous trip found.";
            this.state.mdcSnackbar.open();
          } else {  // else reset to initial state
            this.setState({
              ...INITIAL_STATE
            })
          }
          linearProgress.close();
        }).catch((error) => {
          // console.log("mount doRead fail");
          linearProgress.close();
          throw new Error(error);
        })
        : null
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  onChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    this.state.mdcBanner.close();
  }

  onSubmit = (event) => {
    this.state.mdcProgress.open();
    const service = new google.maps.DistanceMatrixService();
    const geocoder = new google.maps.Geocoder();
    const request = {
      origins: [this.state.pickup],
      destinations: [this.state.dropoff],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    // get distance matrix response
    service.getDistanceMatrix(request).then((response) => {
      // show on map
      const origin = response.originAddresses[0];
      const destination = response.destinationAddresses[0];
      //  calculate price, distance, and store
      const distance = response.rows[0].elements[0].distance;
      // store trip in database
      this.props.firebase.doBookNow(origin, destination, distance.text, distance.value * .2).then(() => {
        this.state.mdcSnackbar.labelText = this.state.pickup + " to " + this.state.dropoff + " saved.";
        this.state.mdcSnackbar.open();
      });

      const markers = {
        origin: origin,
        destination: destination
      }

      this.setState({
        pickup: origin,
        dropoff: destination,
        distance: distance.text,
        price: distance.value * .2,
        map: <MyGoogleMap markers={markers} />,
        ready: true
      })

      geocoder.geocode({ address: origin });
      geocoder.geocode({ address: destination });

      this.state.mdcProgress.close();
    }).catch((error) => {
      // console.log("distance calc fail");
      this.state.mdcProgress.close();
      if(error.name === 'TypeError') {
        this.state.mdcBanner.setText("Failed to save " + this.state.pickup + " to " + this.state.dropoff + ": address is malformed.");
        this.state.mdcBanner.open();
      }
      // throw new Error(error);
    });

    event.preventDefault();
  }

  cancel = () => {
    this.state.mdcProgress.open();
    this.props.firebase.doCancelBooking()
      .then(() => {
        // console.log("cancel success");
        this.setState({
          ...INITIAL_STATE
        });
        this.state.mdcProgress.close();
        this.state.mdcSnackbar.labelText = "Booking canceled.";
        this.state.mdcSnackbar.open();
      })
      .catch(error => {
        // console.log("cancle fail");
        this.state.mdcProgress.close();
        throw new Error(error);
      });
  }

  render() {
    const price = "$" + (this.state.price / 1000).toFixed(2);
    const origin = this.state.pickup;
    const destination = this.state.dropoff;
    const distance = this.state.distance;
    const rate = "$0.20/KM";
    const ready = this.state.ready;

    return (
      <div>
        <LinearProgress />
        <section className="content mdl-card mdl-shadow--2dp">
          <FormErrorBanner />
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Book A Ride Now</h2>
          </div>
          <div className="grid-container">
            <div>
              <form onSubmit={this.onSubmit}>
                <div>
                  {/* to-do: can the textfields be styled with values in them? */}
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" name="pickup" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="pickup">Pickup location (O)</label>
                  </div>
                </div>
                <div>
                  {/* to-do: can the textfields be styled with values in them? */}
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" name="dropoff" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="dropoff">Drop-off location (D)</label>
                  </div>
                </div>
                <button className="section-button mdl-button mdl-button--raised mdl-button--colored" type="submit">Verify</button>
              </form>
              <div>
                <table className="mdl-data-table mdl-js-data-table">
                  <tbody>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Pickup:</th>
                      <td>{origin}</td>
                    </tr>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Destination:</th>
                      <td>{destination}</td>
                    </tr>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Distance:</th>
                      <td>{distance}</td>
                    </tr>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Rate:</th>
                      <td>{rate}</td>
                    </tr>
                    <tr>
                      <th className="mdl-data-table__cell--non-numeric">Price:</th>
                      <td>{price}</td>
                    </tr>
                  </tbody>
                </table>
                <button className="section-button mdl-button mdl-button--raised" onClick={this.cancel}>Cancel</button>
                {ready
                  ?
                  <Link to='/booking/pricing' className="section-button mdl-button mdl-button--raised mdl-button--accent">Checkout</Link>
                  :
                  <button className="section-button mdl-button mdl-button--raised mdl-button--accent" disabled={true}>Checkout</button>
                }
              </div>
            </div>
            <div className="map">
              <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Travel Overview</h2>
              </div>
              {this.state.map}
            </div>
          </div>
        </section>
        <GeneralSnackBar />
      </div>
    )
  }
}

const condition = authUser => !!authUser;

const BookNowPage = withAuthorization(condition)(withFirebase(BookNowFormBase));

export default BookNowPage;
