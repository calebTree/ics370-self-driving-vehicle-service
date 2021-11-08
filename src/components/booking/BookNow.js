import React from 'react'
import { Link } from "react-router-dom";

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

// firebase
import { withFirebase } from "../firebase";
import { withAuthorization } from '../session';

// map
import { MyGoogleMap } from "../maps";

class BookNowFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcComponent: null,
      map: <MyGoogleMap />,
      data: null,
      dropoff: '',
      pickup: '',
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

    // ensure a logged in user has loaded
    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.props.firebase.doReadBooking().then(data => {
          this.setState({
            map: <MyGoogleMap origin={data.origin} destination={data.destination} />,
            data: data
          });
        }).catch(() => {
          this.setState({
            map: <MyGoogleMap />,
            data: null
          });
        })
        : this.setState({ data: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  componentDidUpdate() {
    // this.props.firebase.doReadBooking().then((data) => {
    //   this.setState({data: data})
    // })
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

    this.setState({
      map: <MyGoogleMap origin={pickup} destination={dropoff} />,
    });

    setTimeout(() => this.state.mdcComponent.close(), 1000);
    event.preventDefault();
  }

  cancel = () => {
    this.props.firebase.doCancelBooking().then(() => {
      this.setState({
        map: <MyGoogleMap />,
        data: null
      });
    });
  }

  render() {
    const price = this.state.data ? "$" + this.state.data.price / 1000 : null;
    const origin = this.state.data ? this.state.data.origin : null;
    const destination = this.state.data ? this.state.data.destination : null;
    const distance = this.state.data ? this.state.data.distance : null;
    const rate = .2;

    const ready = this.state.data;
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
                {ready
                  ?
                  <Link to='/booking/pricing' className="section-button mdl-button mdl-button--raised mdl-button--accent">Checkout</Link>
                  :
                  <button className="section-button mdl-button mdl-button--raised mdl-button--accent" disabled={true}>Checkout</button>
                }
              </form>
              <div className="map mdl-card mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
                <div className="mdl-card__title">
                <h2 className="mdl-card__title-text">Travel Overview</h2>
              </div>
                {this.state.map}
              </div>
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
