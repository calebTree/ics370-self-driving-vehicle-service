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
      data: '',
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


    this.listener = this.props.firebase.doAuthStateChanged(authUser => {
      authUser
        ? this.props.firebase.doReadBooking().then(data => {
          console.log("mount doRead success");
          if(data)
            this.setState({
              map: <MyGoogleMap origin={data.origin} destination={data.destination} />,
              data: data
            });
          else
            this.setState({
              map: <MyGoogleMap />,
              data: ''
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
    if (this.state.data.origin !== prevState.data.origin) {
      this.props.firebase.doReadBooking().then(data => {
        console.log("update doRead success");
        if(data)
          this.setState({
            map: <MyGoogleMap origin={data.origin} destination={data.destination} />,
            data: data
          });
        else
          this.setState({
            map: <MyGoogleMap />,
            data: ''
          });
        this.state.mdcComponent.close();
      }).catch((error) => {
        console.log("update doRead fail")
        this.state.mdcComponent.close();
      });
    }
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

    this.props.firebase.doReadBooking()
    .then(() => {
      console.log("onsubmit doRead success");
      this.setState({
        map: <MyGoogleMap origin={pickup} destination={dropoff} />,
        data: {origin: 'Please wait ...'}
      });     
      this.state.mdcComponent.close();
    }).catch(error => {
      console.log("onsubmit doRead fail");
      this.state.mdcComponent.close();
    });
    event.preventDefault();
  }

  cancel = () => {
    this.state.mdcComponent.open();
    this.props.firebase.doCancelBooking()
    .then(() => {
      console.log("cancel success");
      this.setState({
        map: <MyGoogleMap />,
        data: ''
      });
      this.state.mdcComponent.close();
    })
    .catch(error => {
      console.log("cancle fail");
      this.state.mdcComponent.close();
    });
  }

  render() {
    const price = this.state.data ? "$" + this.state.data.price / 1000 : '';
    const origin = this.state.data ? this.state.data.origin : '';
    const destination = this.state.data ? this.state.data.destination : '';
    const distance = this.state.data ? this.state.data.distance : '';
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
