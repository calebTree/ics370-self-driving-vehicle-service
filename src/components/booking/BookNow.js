import React from 'react'
import { Link } from "react-router-dom";

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

// firebase
import { withFirebase } from "../firebase";
import { withAuthorization } from '../session';

// google maps
import { useJsApiLoader, DistanceMatrixService } from '@react-google-maps/api';
import { MyGoogleMap } from "../maps";
import { Loader } from "@googlemaps/js-api-loader"
import googleMapsApiKey from '../maps';

const trip = {
  origin: "someplace",
  destination: "otherplace"
}
class BookNowFormBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mdcComponent: null,
      map: <MyGoogleMap plan={trip}/>,
      pickup: '',
      dropoff: '',
      distance: '',
      rate: '',
      price: '',
    };
  }

  // loader = new Loader({
  //   apiKey: googleMapsApiKey,
  //   version: "weekly",
  //   // ...additionalOptions,
  // });

  componentDidMount() {
    // componentHandler defined by mdl js
    componentHandler.upgradeDom();
    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcComponent: linearProgress });

    // check if plan already exists
    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.props.firebase.doReadBooking().then(data => {
          console.log("mount doRead success");
          
          const trip = {
            origin: data.origin,
            destination: data.destination
          }
          console.log(trip);
          this.setState({
            pickup: data.origin,
            dropoff: data.destination,
            distance: data.distance,
            price: data.price,
            map: <MyGoogleMap plan={trip} />
          })

          this.state.mdcComponent.close();
        }).catch((error) => {
          console.log("mount doRead fail");
          this.state.mdcComponent.close();
          throw new Error(error);
        })
        : null
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (this.state.data.origin !== prevState.data.origin) {
    //   this.props.firebase.doReadBooking().then(data => {
    //     console.log("update doRead success");
    //     if(data)
    //       this.setState({
    //         data: data
    //       });
    //     else
    //       this.setState({
    //         data: ''
    //       });
    //     this.state.mdcComponent.close();
    //   }).catch((error) => {
    //     console.log("update doRead fail")
    //     this.state.mdcComponent.close();
    //   });
    // }
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
    // this.loader.load().then(() => {
      const pickup = this.state.pickup;
      const dropoff = this.state.dropoff;
      const service = new google.maps.DistanceMatrixService();
      const geocoder = new google.maps.Geocoder();
      const request = {
        origins: [pickup],
        destinations: [dropoff],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      // get distance matrix response
      service.getDistanceMatrix(request).then((response) => {
        // show on map
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;

        //  calculate price, distance, and store
        const distance = response.rows[0].elements[0].distance;
        this.props.firebase.doBookNow(originList[0], destinationList[0], distance.text, distance.value * .2);

        const trip = {
          origin: originList[0],
          destination: destinationList[0]
        }

        this.setState({
          pickup: originList[0],
          dropoff: destinationList[0],
          distance: distance.text,
          price: distance.value * .2,
          map: <MyGoogleMap plan={trip} />,
        })

        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;  
          geocoder
            .geocode({ address: originList[i] })
            // .then(showGeocodedAddressOnMap(false));
          for (let j = 0; j < results.length; j++) {
            geocoder
              .geocode({ address: destinationList[j] })
              // .then(showGeocodedAddressOnMap(true));
          }
        }

      }).catch((error) => {
        console.log("distance calc fail");
        console.log(error);
      });
    // })

    this.state.mdcComponent.close();

    event.preventDefault();
  }

  cancel = () => {
    this.state.mdcComponent.open();
    this.props.firebase.doCancelBooking()
    .then(() => {
      console.log("cancel success");
      this.setState({
        map: <MyGoogleMap />,
      });
      this.state.mdcComponent.close();
    })
    .catch(error => {
      console.log("cancle fail");
      this.state.mdcComponent.close();
    });
  }

  render() {
    const price = this.state.price ? "$" + this.state.price / 1000 : '';
    const origin = this.state.pickup ? this.state.pickup : '';
    const destination = this.state.dropoff ? this.state.dropoff : '';
    const distance = this.state.distance ? this.state.distance : '';
    const rate = "$0.20/KM";

    const ready = this.state.data;
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
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="text" name="pickup" required onChange={this.onChange} />
                    <label className="mdl-textfield__label" htmlFor="pickup">Pickup location (O)</label>
                  </div>
                </div>
                <div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="text" name="dropoff" required onChange={this.onChange} />
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
