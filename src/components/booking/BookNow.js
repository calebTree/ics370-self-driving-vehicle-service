import React from 'react'
import { Link } from "react-router-dom";

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

// firebase
import { withFirebase } from "../firebase";
import { withAuthorization } from '../session';

// google maps
import { MyGoogleMap } from "../maps";

const INITIAL_STATE = {
  map: <MyGoogleMap markers={null}/>,
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
      mdcComponent: null,
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
    this.setState({ mdcComponent: linearProgress });
    linearProgress.open();

    // check if plan already exists
    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.props.firebase.doReadBooking().then(data => {
          console.log("mount doRead success");
          if(data) { // if data found populate travel overview
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
          } else {  // else reset to initial state
            this.setState({
              ...INITIAL_STATE
            })
          }
          linearProgress.close();
        }).catch((error) => {
          console.log("mount doRead fail");
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
  }

  onSubmit = (event) => {
    this.state.mdcComponent.open();
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
      this.props.firebase.doBookNow(origin, destination, distance.text, distance.value * .2);

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
      
      this.state.mdcComponent.close();
    }).catch((error) => {
      console.log("distance calc fail");
      this.state.mdcComponent.close();
      throw new Error(error);
    });
    
    event.preventDefault();
  }

  cancel = () => {
    this.state.mdcComponent.open();
    this.props.firebase.doCancelBooking()
    .then(() => {
      console.log("cancel success");
      this.setState({
        ...INITIAL_STATE
      });
      this.state.mdcComponent.close();
    })
    .catch(error => {
      console.log("cancle fail");
      this.state.mdcComponent.close();
      throw new Error(error);
    });
  }

  render() {
    const price = "$" + this.state.price / 1000;
    const origin = this.state.pickup;
    const destination = this.state.dropoff;
    const distance = this.state.distance;
    const rate = "$0.20/KM";
    const ready = this.state.ready;

    return (
      <div>
        <LinearProgress />
        <section className="content mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Book A Ride Now</h2>
          </div>
          <div className="grid-container">
            <div>
              <form onSubmit={this.onSubmit}>
                <div>
                  {/* to-do: can the textfields be styled with values in them? */}
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" value={origin} type="text" name="pickup" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="pickup">Pickup location (O)</label>
                  </div>
                </div>
                <div>
                  {/* to-do: can the textfields be styled with values in them? */}
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" value={destination} type="text" name="dropoff" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="dropoff">Drop-off location (D)</label>
                  </div>
                </div>
                <button className="section-button mdl-button mdl-button--raised mdl-button--colored" type="submit">Verify</button>
              </form>
            </div>
            <div className="map">
              <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Travel Overview</h2>
              </div>
              {this.state.map}
            </div>
            <div>
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
          </div>
        </section>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

const BookNowPage = withAuthorization(condition)(withFirebase(BookNowFormBase));

export default BookNowPage;
