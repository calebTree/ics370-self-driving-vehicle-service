import React from 'react'

// mdcw
import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

// firebase
import { withFirebase } from "../firebase";

// map
import { MyGoogleMap } from "../maps";

const BookNowPage = () => (
  <div>
    <LinearProgress />
    <section className="content mdl-card mdl-shadow--2dp">
      <div className="mdl-card__title">
        <h2 className="mdl-card__title-text">Book a Ride Now</h2>
      </div>
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
          <BookNowForm />
        </div>
        <div className="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Location</h2>
          </div>
            <MyGoogleMap />
        </div>
      </div>
    </section>
  </div>
)

class BookNowFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcComponent: null,
      dropOff: ''
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

  onSubmit = event => {
    this.state.mdcComponent.open();
    this.props.firebase.doBookNow(this.state.dropOff);
    // this.props.firebase.doReadBooking();

    // to-do: figure out how to properly async the progress bar  
    setTimeout(() => this.state.mdcComponent.close(), 1000);

    // to-do: learn how to slowly increment i
    // for(let i = 0.0; i <= 1.05; i+=.05) {
    //   console.log(i.toFixed(2))
    //   this.state.mdcComponent.progress = i.toFixed(2)
    // }

    event.preventDefault();
  }

  render() {
    // const location = navigator.geolocation.getCurrentPosition();
    // console.log(location)
    return (
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
        <div id="destination">
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input className="mdl-textfield__input" type="text" name="dropOff" required onChange={this.onChange}/>
            <label className="mdl-textfield__label" htmlFor="dropOff">Drop of destination</label>
          </div>
        </div>
        <button id="hailNowBtn" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
      </form>
    )
  }
}

const BookNowForm = withFirebase(BookNowFormBase);

export default BookNowPage
