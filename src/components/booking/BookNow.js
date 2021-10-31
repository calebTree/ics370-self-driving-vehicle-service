import React from 'react'

import { MDCLinearProgress } from '@material/linear-progress';
import { LinearProgress } from '../mdc-components'

const BookNowPage = () => (
  <div className="mdl-layout">
    <LinearProgress />
    <section className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
      <div className="mdl-card__supporting-text">
        <h3>Book a Ride Now</h3>
        <BookNowForm />
      </div>
    </section>
  </div>
)

class BookNowForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mdcComponent: null,
    };
  }

  componentDidMount() {
    // defined by mdl js
    componentHandler.upgradeDom()
    // setup linear progress bar
    const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
    linearProgress.close();
    linearProgress.determinate = false;
    this.setState({ mdcComponent: linearProgress });
  }
  onSubmit = event => {
    this.state.mdcComponent.open();

    // to-do: learn how to slowly increment i
    // for(let i = 0.0; i <= 1.05; i+=.05) {
    //   console.log(i.toFixed(2))
    //   this.state.mdcComponent.progress = i.toFixed(2)
    // }

    event.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div id="option">
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
            <input className="mdl-textfield__input" type="text" name="dropOff" required />
            <label className="mdl-textfield__label" htmlFor="dropOff">Drop of destination</label>
          </div>
        </div>
        <button id="hailNowBtn" className="section-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Submit</button>
      </form>
    )
  }
}

export default BookNowPage
